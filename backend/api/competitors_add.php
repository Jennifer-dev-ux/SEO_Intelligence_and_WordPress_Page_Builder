<?php

// api/competitors_add.php

declare(strict_types=1);

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/../config.php';

header('Content-Type: application/json');

// Read JSON body
$rawBody = file_get_contents('php://input');
$data = json_decode($rawBody, true);

if ($data === null) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

// Required fields
$name = trim($data['name'] ?? '');
$domain = trim($data['domain'] ?? '');
$metrics = $data['metrics'] ?? null;

if ($name === '' || $domain === '' || !is_array($metrics)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

// Metric fields
$metricDate = $metrics['date'] ?? date('Y-m-d');
$numPagesWithTargetKeyword     = $metrics['numPagesWithTargetKeyword']     ?? null;
$avgTitleLength                = $metrics['avgTitleLength']                ?? null;
$percentPagesWithH1Keyword     = $metrics['percentPagesWithH1Keyword']     ?? null;
$totalBacklinks                = $metrics['totalBacklinks']                ?? null;
$referringDomains              = $metrics['referringDomains']              ?? null;
$avgPositionForMainKeywords    = $metrics['avgPositionForMainKeywords']    ?? null;
$totalClicks                   = $metrics['totalClicks']                   ?? null;
$totalImpressions              = $metrics['totalImpressions']              ?? null;

try {
    $pdo = getPdo();
    $pdo->beginTransaction();

    // ➤ 1️⃣ Find or create competitor
    $stmt = $pdo->prepare("SELECT id FROM competitors WHERE domain = :domain");
    $stmt->execute(['domain' => strtolower($domain)]);
    $competitor = $stmt->fetch();

    if ($competitor) {
        $competitorId = (int)$competitor['id'];
    } else {
        $insertCompetitor = $pdo->prepare(
            "INSERT INTO competitors (name, domain) VALUES (:name, :domain)"
        );
        $insertCompetitor->execute([
            'name' => $name,
            'domain' => strtolower($domain),
        ]);
        $competitorId = (int)$pdo->lastInsertId();
    }

    // ➤ 2️⃣ Prevent duplicate metric snapshots (same competitor + date)
    $check = $pdo->prepare(
        "SELECT id FROM seo_metrics 
         WHERE competitor_id = :competitor_id AND metric_date = :metric_date"
    );
    $check->execute([
        'competitor_id' => $competitorId,
        'metric_date' => $metricDate
    ]);

    if ($check->fetch()) {
        $pdo->rollBack();
        echo json_encode([
            "success" => false,
            "message" => "Metrics already exist for this competitor and date"
        ]);
        exit;
    }

    // ➤ 3️⃣ Insert metrics snapshot
    $insertMetrics = $pdo->prepare(
        "INSERT INTO seo_metrics (
            competitor_id, metric_date,
            num_pages_with_target_keyword,
            avg_title_length,
            percent_pages_with_h1_keyword,
            total_backlinks,
            referring_domains,
            avg_position_for_main_keywords,
            total_clicks,
            total_impressions
        ) VALUES (
            :competitor_id, :metric_date,
            :num_pages_with_target_keyword,
            :avg_title_length,
            :percent_pages_with_h1_keyword,
            :total_backlinks,
            :referring_domains,
            :avg_position_for_main_keywords,
            :total_clicks,
            :total_impressions
        )"
    );

    $insertMetrics->execute([
        'competitor_id'                   => $competitorId,
        'metric_date'                     => $metricDate,
        'num_pages_with_target_keyword'   => $numPagesWithTargetKeyword,
        'avg_title_length'                => $avgTitleLength,
        'percent_pages_with_h1_keyword'   => $percentPagesWithH1Keyword,
        'total_backlinks'                 => $totalBacklinks,
        'referring_domains'               => $referringDomains,
        'avg_position_for_main_keywords'  => $avgPositionForMainKeywords,
        'total_clicks'                    => $totalClicks,
        'total_impressions'               => $totalImpressions,
    ]);

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => "Metrics saved",
        "competitor_id" => $competitorId,
    ]);

} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);
    echo json_encode([
        "error" => "Server error",
        "details" => $e->getMessage()
    ]);
}

?>
