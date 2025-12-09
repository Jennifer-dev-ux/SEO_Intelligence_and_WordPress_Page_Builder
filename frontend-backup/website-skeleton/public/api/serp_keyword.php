<?php
// public/api/serp_keyword.php

header('Content-Type: application/json');

// Basic guard
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST only']);
    exit;
}

// Read input JSON
$input = json_decode(file_get_contents('php://input'), true);
$keyword = isset($input['keyword']) ? trim($input['keyword']) : '';

if ($keyword === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Keyword is required']);
    exit;
}

// CONFIG ----------------------------------------------------------------------
$ourDomain = 'tileplan.com'; // your domain (no scheme)
$competitors = [
    'tilemountain.co.uk',
    'toppstiles.co.uk',
    'tilesuk.com'
];

// DataForSEO-like auth & endpoint (adjust for your provider)
$apiUser = 'm.oni1@edu.salford.ac.uk';
$apiPassword = 'cc8f0cb2d8607837';
$endpoint = 'https://api.dataforseo.com/v3/serp/google/organic/live/advanced';
;

// Build request payload for SERP API
$payload = [
    'keyword'             => $keyword,
    'location_code'       => 2826,     // GB example
    'language_code'      => 'en',
    'device'              => 'desktop',
    'os'                  => 'windows',
    'depth'               => 10,
    'group_organic_results' => true,
    // "target" is optional; we don't rely on it because we parse domains
];

// -----------------------------------------------------------------------------
// Call SERP API via cURL
// -----------------------------------------------------------------------------
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $endpoint);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
curl_setopt($ch, CURLOPT_USERPWD, $apiUser . ':' . $apiPassword);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([$payload])); // API expects array of tasks
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
if ($response === false) {
    http_response_code(500);
    echo json_encode(['error' => 'SERP API request failed', 'details' => curl_error($ch)]);
    curl_close($ch);
    exit;
}
curl_close($ch);

// Parse SERP API response
$data = json_decode($response, true);

if (!isset($data['status_code']) || $data['status_code'] !== 20000) {
    http_response_code(500);
    echo json_encode(['error' => 'SERP API returned error', 'raw' => $data]);
    exit;
}

if (empty($data['result'][0]['items'])) {
    echo json_encode([
        'keyword' => $keyword,
        'ourRank' => null,
        'competitorDomain' => null,
        'competitorRank' => null,
        'opportunity' => 'No organic results returned',
        'priority' => 'low'
    ]);
    exit;
}

$items = $data['result'][0]['items'];

// -----------------------------------------------------------------------------
// Analyse rankings for our domain and competitors
// -----------------------------------------------------------------------------
$ourRank = null;
$competitorBestDomain = null;
$competitorBestRank = null;

foreach ($items as $item) {
    if (!isset($item['type']) || $item['type'] !== 'organic') {
        continue;
    }

    $domain = $item['domain'] ?? '';
    $rank = $item['rank_group'] ?? null;

    if (!$domain || $rank === null) {
        continue;
    }

    $domain = strtolower($domain);
    $domain = preg_replace('~^www\.~i', '', $domain); // strip www

    // Our rank
    if ($domain === $ourDomain) {
        if ($ourRank === null || $rank < $ourRank) {
            $ourRank = $rank;
        }
    }

    // Competitors
    if (in_array($domain, $competitors, true)) {
        if ($competitorBestRank === null || $rank < $competitorBestRank) {
            $competitorBestRank = $rank;
            $competitorBestDomain = $domain;
        }
    }
}

// -----------------------------------------------------------------------------
// Simple opportunity & priority logic
// -----------------------------------------------------------------------------
$opportunity = '';
$priority = 'low'; // default

if ($ourRank === null && $competitorBestRank !== null) {
    // They rank, we don't
    $opportunity = 'We do not rank; competitor is in top results';
    $priority = 'high';
} elseif ($ourRank !== null && $competitorBestRank !== null) {
    $diff = $ourRank - $competitorBestRank; // positive => we are behind
    if ($diff >= 7) {
        $opportunity = 'Competitor significantly outranks us';
        $priority = 'high';
    } elseif ($diff >= 3) {
        $opportunity = 'Competitor outranks us, we are within reach';
        $priority = 'medium';
    } elseif ($diff <= 0) {
        $opportunity = 'We outrank or match competitors';
        $priority = 'low';
    } else {
        $opportunity = 'Small gap vs competitor';
        $priority = 'low';
    }
} elseif ($ourRank !== null && $competitorBestRank === null) {
    // We rank and they don't
    $opportunity = 'We lead this keyword; keep defending.';
    $priority = 'low';
} else {
    // Neither appears
    $opportunity = 'No tracked domains appear in the top results.';
    $priority = 'low';
}

// -----------------------------------------------------------------------------
// Return a small, frontend-friendly JSON
// -----------------------------------------------------------------------------
echo json_encode([
    'keyword'          => $keyword,
    'ourRank'          => $ourRank,
    'competitorDomain' => $competitorBestDomain,
    'competitorRank'   => $competitorBestRank,
    'opportunity'      => $opportunity,
    'priority'         => $priority
]);
