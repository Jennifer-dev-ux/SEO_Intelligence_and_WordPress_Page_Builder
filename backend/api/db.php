<?php

// db.php

declare(strict_types=1);

require_once __DIR__ . '/../config.php';

function getPdo(): PDO
{
    static $pdo = null;

    if ($pdo === null) {
        // If you defined DB_PORT, use it, otherwise default to 3306
        $host = DB_HOST;
        $db   = DB_NAME;
        $user = DB_USER;
        $pass = DB_PASS;
        $port = defined('DB_PORT') ? DB_PORT : 3306;

        $dsn = "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4";

        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ];

        try {
            $pdo = new PDO($dsn, $user, $pass, $options);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'error'   => 'DB connection failed',
                'details' => $e->getMessage(),
            ]);
            exit;
        }
    }

    return $pdo;
}

?>