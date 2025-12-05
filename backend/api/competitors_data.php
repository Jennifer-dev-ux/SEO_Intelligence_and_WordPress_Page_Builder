<?php
// api/competitors_data.php

declare(strict_types=1);


require_once __DIR__ . '/db.php';

header('Content-Type: application/json');

try {
    $pdo = getPdo();

    // Optional: support query params for future
    // e.g. ?from=2025-12-01&to=2025-12-31
    $from = $_GET['from'] ?? null;
    $to   = $_GET['to']   ?? null;

    $params = [];
    $where  = '';

    if ($from !== null && $to !== null) {
        $where = 'WHERE sm.metric_date BETWEEN :from AND :to';
        $params['from'] = $from;
        $params['to']   = $to;
    }

    $sql = "
        SELECT 
            c.id AS competitor_id,
            c.name,
            c.domain,
            sm.metric_date,
            sm.num_pages_with_target_keyword,
            sm.avg_title_length,
            sm.percent_pages_with_h1_keyword,
            sm.total_backlinks,
            sm.referring_domains,
            sm.avg_position_for_main_keywords,
            sm.total_clicks,
            sm.total_impressions
        FROM competitors c
        JOIN seo_metrics sm ON sm.competitor_id = c.id
        $where
        ORDER BY c.id, sm.metric_date ASC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    // Group by competitor for easier charting
    $result = [];
    foreach ($rows as $row) {
        $cid = (int) $row['competitor_id'];

        if (!isset($result[$cid])) {
            $result[$cid] = [
                'id'      => $cid,
                'name'    => $row['name'],
                'domain'  => $row['domain'],
                'metrics' => [],
            ];
        }

        $result[$cid]['metrics'][] = [
            'date' => $row['metric_date'],
            'num_pages_with_target_keyword' => $row['num_pages_with_target_keyword'] !== null ? (int) $row['num_pages_with_target_keyword'] : null,
            'avg_title_length' => $row['avg_title_length'] !== null ? (float) $row['avg_title_length'] : null,
            'percent_pages_with_h1_keyword' => $row['percent_pages_with_h1_keyword'] !== null ? (float) $row['percent_pages_with_h1_keyword'] : null,
            'total_backlinks' => $row['total_backlinks'] !== null ? (int) $row['total_backlinks'] : null,
            'referring_domains' => $row['referring_domains'] !== null ? (int) $row['referring_domains'] : null,
            'avg_position_for_main_keywords' => $row['avg_position_for_main_keywords'] !== null ? (float) $row['avg_position_for_main_keywords'] : null,
            'total_clicks' => $row['total_clicks'] !== null ? (int) $row['total_clicks'] : null,
            'total_impressions' => $row['total_impressions'] !== null ? (int) $row['total_impressions'] : null,
        ];
    }

    // Re-index to numeric array
    echo json_encode(['competitors' => array_values($result)]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error', 'details' => $e->getMessage()]);
}

?>