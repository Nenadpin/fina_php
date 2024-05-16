<?php
include 'config.php';
include 'conn.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $requestData = json_decode(file_get_contents("php://input"), true);
    $enteredPassword = $requestData['password'];

    $total = $requestData['total'];
    $dateOfOrder = $requestData['dateOfOrder'];
    $bulkOrder = $requestData['orderData'];
    $order_id=$requestData['id'];

    if ($enteredPassword !== $correctPassword) {
        http_response_code(401);
        exit("Unauthorized");
    }
    $bulkOrder = array_map(function($e) {
        return [
            'id' => $e['id'],
            'naziv' => $e['naziv'],
            'prodajna_cena' => $e['prodajna_cena'],
            'lager' => $e['lager']
        ];
    }, $bulkOrder);
    try {
        $conn->beginTransaction();
        $query1 = "INSERT INTO proizvodi (id, naziv, prodajna_cena, lager) VALUES ";
        $query1 .= implode(', ', array_map(function($entry) {
            return "({$entry['id']}, '{$entry['naziv']}', {$entry['prodajna_cena']}, {$entry['lager']})";
        }, $bulkOrder));
        $query1 .= " ON DUPLICATE KEY UPDATE lager = VALUES(lager) - lager, prodajna_cena=VALUES(prodajna_cena)";
        $conn->exec($query1);

        $query2 = "DELETE FROM nabavka WHERE id = $order_id";
        $conn->exec($query2);

        $query3 = "DELETE FROM promet WHERE nabavka_id = $order_id";
        $conn->exec($query3);

        $conn->commit();
        http_response_code(200);

    } catch (PDOException $error) {
        $conn->rollBack();
        echo json_encode(['error' => $error->getMessage()]);
        http_response_code(501);
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
    http_response_code(400);
}
