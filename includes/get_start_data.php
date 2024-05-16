<?php
include './conn.php';

if (isset($_GET['tableName'])) {
    $tableName = $_GET['tableName'];

    try {

        if ($tableName === 'proizvodi') {
            $orderByClause = 'ORDER BY id';
        } else {
            $orderByClause = 'ORDER BY datum';
        }

        $query = "SELECT * FROM $tableName $orderByClause";
        $result = $conn->query($query);

        $data = $result->fetchAll(PDO::FETCH_ASSOC);
        header("Access-Control-Allow-Origin: *");
        header('Content-Type: application/json');
        echo json_encode($data,  JSON_UNESCAPED_UNICODE);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
} elseif (isset($_GET['id'])) {

    $productId = $_GET['id'];

    try {
        $stmt = $conn->prepare("SELECT * FROM promet WHERE prod_id = ? ORDER BY datum");
        $stmt->execute([$productId]);

        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        header('Content-Type: application/json');
        echo json_encode($data);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Invalid parameters']);
    http_response_code(400);
}
