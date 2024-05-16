<?php
include 'config.php';
include 'conn.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $requestData = json_decode(file_get_contents("php://input"), true);
    $enteredPassword = $requestData['password'];
    $total = $requestData['total'];
    $dateOfOrder = $requestData['dateOfOrder'];
    $bulkOrder = $requestData['ordData'];
    
    if ($enteredPassword !== $correctPassword) {
        http_response_code(401);
        exit("Unauthorized");
    }

    $bulkOrder = array_map(function($e) {
        return [
            'id' => $e['id'],
            'naziv' => $e['naziv'],
            'prodajna_cena' => $e['prodajna_cena'],
            'nova_cena' => $e['nova_cena'],
            'lager' => $e['lager']
        ];
    }, $bulkOrder);

    try {
        $conn->beginTransaction();

        $stmt = $conn->prepare("INSERT INTO nivelacija (promet, datum, total) VALUES (?, ?, ?)");
        $stmt->execute([json_encode($bulkOrder), $dateOfOrder, $total]);

        $query1 = "INSERT INTO proizvodi (id, prodajna_cena) VALUES ";
        $query1 .= implode(', ', array_map(function($entry) {
            return "({$entry['id']}, {$entry['nova_cena']})";
        }, $bulkOrder));
        
        $query1 .= " ON DUPLICATE KEY UPDATE prodajna_cena = VALUES(prodajna_cena)";


        $conn->exec($query1);

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
