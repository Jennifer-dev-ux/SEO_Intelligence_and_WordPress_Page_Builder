<?php
// api/serp_keyword.php

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'POST only']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$keyword = isset($input['keyword']) ? trim($input['keyword']) : '';

if ($keyword === '') {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Keyword is required']);
    exit;
}

// DataForSEO-like auth & endpoint (adjust for your provider)
$apiUser = 'm.oni1@edu.salford.ac.uk';
$apiPassword = 'cc8f0cb2d8607837';
$endpoint = 'https://api.dataforseo.com/v3/serp/google/organic/live/advanced';

$payload = [
    [
        "keyword"       => $keyword,
        "location_code" => 2826,
        "language_code" => "en",
        "device"        => "desktop",
        "os"            => "windows",
        "depth"         => 10
    ]
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $endpoint);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 120);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
curl_setopt($ch, CURLOPT_USERPWD, $apiUser . ':' . $apiPassword);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);

$response = curl_exec($ch);

if ($response === false) {
    $error = curl_error($ch);
    curl_close($ch);

    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'SERP API request failed', 'details' => $error]);
    exit;
}

$httpStatus = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Forward DataForSEO’s raw JSON back to the browser
http_response_code($httpStatus);
header('Content-Type: application/json');
echo $response;
