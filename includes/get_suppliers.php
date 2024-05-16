<?php
include './conn.php';

if (isset($_GET['operation'])) {
    $operation = $_GET['operation'];

    if ($operation==='spisak'){
        try {
            $query = "SELECT DISTINCT dobavljac FROM blagajna";
            $result=$conn->query($query);

            $data = $result->fetchAll(PDO::FETCH_ASSOC);
            header('Content-Type: application/json');
            echo json_encode($data);

        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    } elseif($operation==='blagajna'){
        try {
            $query = "SELECT * FROM blagajna";
            $result=$conn->query($query);

            $data = $result->fetchAll(PDO::FETCH_ASSOC);
            header('Content-Type: application/json');
            echo json_encode($data);

        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
} else {
        echo json_encode(['error' => 'Invalid parameters']);
        http_response_code(400);
}