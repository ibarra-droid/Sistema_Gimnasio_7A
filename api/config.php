<?php
declare(strict_types=1);

// Conexión local predeterminada; las variables de entorno permiten cambiarla sin guardar claves aquí.
function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $host = getenv('GIMNASIO_DB_HOST') ?: '127.0.0.1';
    $name = getenv('GIMNASIO_DB_NAME') ?: 'ingresos_gim';
    $user = getenv('GIMNASIO_DB_USER') ?: 'root';
    $password = getenv('GIMNASIO_DB_PASS');
    if ($password === false) {
        $password = '';
    }

    $pdo = new PDO(
        'mysql:host=' . $host . ';dbname=' . $name . ';charset=utf8mb4',
        $user,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );

    return $pdo;
}
