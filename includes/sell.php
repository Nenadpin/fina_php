<?php
include 'config.php';
include 'conn.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $requestData = json_decode(file_get_contents("php://input"), true);
    $enteredPassword = $requestData['password'];
    $total = $requestData['total'];
    $dateOfSell = $requestData['dateOfSell'];
    $bulkOrder = $requestData['sellData'];

    if ($enteredPassword !== $correctPassword) {
        http_response_code(401);
        exit("Unauthorized");
    }

    $bulkOrder = array_map(function($e) {
        return [
            'id' => $e['id'],
            'naziv'=> $e['naziv'],
            'prodajna_cena'=>$e['prodajna_cena'],
            'lager' => $e['lager']
        ];
    }, $bulkOrder);

    try {
        $conn->beginTransaction();

        $query1 = "INSERT INTO proizvodi (id, lager) VALUES ";
        $query1 .= implode(', ', array_map(function($entry) {
            return "({$entry['id']}, {$entry['lager']})";
        }, $bulkOrder));
        
        $query1 .= " ON DUPLICATE KEY UPDATE lager = lager - VALUES(lager)";

        $conn->exec($query1);

        $query2 = "INSERT INTO prodaja (promet, datum, total) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($query2);
        $stmt->execute([json_encode($bulkOrder), $dateOfSell, $total]);

        $query3 = "INSERT INTO promet (prod_id, prodaja, datum) VALUES ";
        $query3 .= implode(', ', array_map(function($item) use ($dateOfSell) {
            return "({$item['id']}, {$item['lager']}, '{$dateOfSell}')";
        }, $bulkOrder));

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