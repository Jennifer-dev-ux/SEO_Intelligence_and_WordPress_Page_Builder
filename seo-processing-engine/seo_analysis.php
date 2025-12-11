<?php
// seo_analysis.php — Final, Robust, and Compliant PHP Endpoint

header("Content-Type: application/json");

// --- CONFIGURATION ---
$BASE_URL = "https://cinder-rigged.poseidon.salford.ac.uk/SEO_API/api";
$CACHE_EXPIRY_S = 300; // 5 minutes in seconds
$CACHE_DIR = __DIR__ . '/cache/'; // Store cache files in a sub-folder

// --- PHP INITIATION & UTILITIES ---

// 1. Ensure the cache directory exists
if (!is_dir($CACHE_DIR)) {
    mkdir($CACHE_DIR, 0777, true);
}

// 2. Set the necessary SSL/TLS security bypass for file_get_contents and cURL
$arrContextOptions = [
    "ssl" => [
        "verify_peer" => false,
        "verify_peer_name" => false,
    ],
];
$sslContext = stream_context_create($arrContextOptions);

// 3. Helper function for cURL (POST requests)
function postDataToAPI($url, $payload) {
    global $arrContextOptions; 

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    // Apply SSL bypass
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

    $response = curl_exec($ch);
    $error = curl_error($ch);
    curl_close($ch);

    if ($error) {
        return ["success" => false, "message" => "Network/Fetch Error", "details" => $error];
    }
    return json_decode($response, true);
}


// --- READ QUERY AND FILE-BASED CACHE CHECK ---
if (!isset($_GET["domain"]) || empty($_GET["domain"])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing 'domain' query parameter."]);
    exit;
}

$domain = $_GET["domain"];
$cacheFile = $CACHE_DIR . md5($domain) . '.json';

// Check cache file existence and expiry
if (file_exists($cacheFile) && (filemtime($cacheFile) + $CACHE_EXPIRY_S) > time()) {
    $cachedData = json_decode(file_get_contents($cacheFile), true);
    // Logging (optional, but good practice): echo "LOG: Cache HIT for $domain\n";
    echo json_encode($cachedData);
    exit;
}


// --- 1. FETCH DATABASE INSIGHTS (ENDPOINT 4) ---
$insightsUrl = "$BASE_URL/ai_insights.php?domain=$domain&latest=1";
// Use SSL context to bypass certificate error
$insightsJson = @file_get_contents($insightsUrl, false, $sslContext);
$insights = json_decode($insightsJson, true);

// Extract the required nested data structure
$insightsReport = $insights['insights'][0] ?? null; 
if (!$insightsReport) {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "No insights found for domain: $domain"]);
    exit;
}

// --- 2. FORMAT FOR AI PAGE BUILDER (FINAL CORRECTED LOGIC) ---

// a) Extract Gaps and Topic (GUARANTEED TO BE NON-EMPTY)
$keywordGaps = $insightsReport['keywordGaps'] ?? [];
$contentOpportunities = $insightsReport['contentOpportunities'] ?? [];

$finalTargetKeywords = [];
$mainTopic = "Default Product Category Page Topic"; 
$foundKeyword = false;

// 1. Try to use ANY keyword from Gaps
if (!empty($keywordGaps)) {
    $firstGapKeyword = $keywordGaps[0]['keywordOrTopic'];
    $mainTopic = $firstGapKeyword;
    $finalTargetKeywords[] = $firstGapKeyword;
    $foundKeyword = true;
}

// 2. Fallback to Content Opportunity if Gaps were empty
if (!$foundKeyword && !empty($contentOpportunities)) {
    $topOpportunityIdea = $contentOpportunities[0]['idea'];
    $mainTopic = $topOpportunityIdea;
    
    // Attempt to extract keyword from the quoted string in the idea
    if (preg_match('/"(.*?)"/', $topOpportunityIdea, $matches) && isset($matches[1])) {
        $finalTargetKeywords[] = $matches[1];
    } else {
        // Use the whole opportunity idea as the keyword if no quotes found
        $finalTargetKeywords[] = $topOpportunityIdea;
    }
    $foundKeyword = true;
}

// 3. Last safety check: If still empty, use a generic, guaranteed keyword
if (!$foundKeyword) {
    // If the topic is still the 'Default' name, use a generic tile keyword
    $mainTopic = "Tile Installation and Care"; 
    $finalTargetKeywords[] = "tile installation guide";
}

// b) Build Competitor Summary
$competitorSummary = array_merge(
    array_map(fn($w) => $w['summary'], $insightsReport['weaknesses'] ?? []),
    array_map(fn($s) => $s['summary'], $insightsReport['strengths'] ?? [])
);
$competitorSummary = implode('; ', $competitorSummary);

$topCompetitors = $insightsReport['competitorDomains'] ?? ["toppstiles.co.uk", "tilegiant.co.uk"];

// c) Final Payload Structure (must match Endpoint 5 exactly)
$aiPayload = [
    "topic" => $mainTopic,
    "category" => "Product category page",
    "target_keywords" => $finalTargetKeywords, // GUARANTEED to be non-empty now
    "competitor_insights" => [
        "summary" => $competitorSummary,
        "top_competitors" => $topCompetitors,
        "notes" => "Emphasis should be placed on high-durability and installation ease due to competitor gaps."
    ],
    "save" => true
];


// --- 3. SEND TO PAGE GENERATOR API (ENDPOINT 5) ---
$pageGenUrl = "$BASE_URL/generate_seo_page.php";
$pageGenResult = postDataToAPI($pageGenUrl, $aiPayload);

// --- 4. FINAL RESPONSE ASSEMBLY ---
$finalResponse = [
    "success" => true,
    "domain" => $domain,
    "analysis" => $insightsReport, // Return the clean insightsReport data
    "ai_page_builder_payload" => $aiPayload,
    "page_generation_status" => $pageGenResult
];

// --- 5. STORE IN CACHE AND RETURN ---
file_put_contents($cacheFile, json_encode($finalResponse));
// Logging (optional, but good practice): echo "LOG: Cache MISS successful. Stored result for $domain\n";

echo json_encode($finalResponse);

?>