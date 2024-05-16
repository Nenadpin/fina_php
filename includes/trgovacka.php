<?php
include './conn.php';

    try {
        $query = "
        SELECT
    'nabavka' AS `source`,
    id,
    datum,
    total AS pozitive_total,
    opis
FROM
    nabavka
UNION
SELECT
    'prodaja' AS `source`,
    id,
    datum,
    -total AS pozitive_total,
    'prodaja' AS opis
FROM
    prodaja
UNION
SELECT
    'nivelacija' AS `source`,
    id,
    datum,
    total AS pozitive_total,
    'nivelacija' AS opis
FROM
    nivelacija
UNION
SELECT
    'refund' AS `source`,
    id,
    datum,
    total AS pozitive_total,
    'refund' AS opis
FROM
    refund
ORDER BY
    datum;";

        $result = $conn->query($query);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);

        header("Access-Control-Allow-Origin: *");
        header('Content-Type: application/json');
        echo json_encode($data,  JSON_UNESCAPED_UNICODE);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
