<?php
include 'conn.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $requestData = json_decode(file_get_contents("php://input"), true);
    $iznos = $requestData['iznos'];
    $valuta = $requestData['paymentDate'];
    $supp = $requestData['dobavljac'];
    
    try {
        $conn->beginTransaction();

        $stmt = $conn->prepare("INSERT INTO blagajna (dobavljac, datum, duguje) VALUES (?, ?, ?)");
        $stmt->execute([$supp, $valuta, $iznos]);

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
