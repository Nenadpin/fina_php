<?php
include 'config.php';
include 'conn.php';
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $sellData = json_decode(file_get_contents("php://input"), true);

    $bulkData = [];
    $bulkDetails = [];

    $enteredPassword = $sellData['password'];

    if ($enteredPassword !== $correctPassword) {
        http_response_code(401);
        exit("Unauthorized");
    }
    unset($sellData['password']);

    foreach ($sellData as $date => $values) {
        $tDate = date('Y-m-d', strtotime(str_replace('.', '-', $date)));

        foreach ($values['items'] as $item) {
            $bulkData[] = [intval($item['Name']), intval($item['Quantity']), $tDate];
        }

        $list = array_map(function ($i) {
            return [
                'id' => intval($i['Name']),
                'lager' => intval($i['Quantity']),
                'naziv' => $i['Name'],
                'total' => intval($i['Quantity']) * floatval($i['UnitPrice']),
                'prodajna_cena' => floatval($i['UnitPrice']),
            ];
        }, $values['items']);

        $bulkDetails[] = [json_encode($list), $tDate, $values['total']];
    }

    try {
        $conn->beginTransaction();

        $updatedSell = [];
        foreach ($bulkDetails as $bulkDetail) {
            $stmtInsert = $conn->prepare("INSERT IGNORE INTO prodaja (promet, datum, total) VALUES (?, ?, ?)");
            $stmtInsert->execute($bulkDetail);

            if ($stmtInsert->rowCount() > 0) {
                $stmtSelect = $conn->prepare("SELECT datum FROM prodaja WHERE id = LAST_INSERT_ID()");
                $stmtSelect->execute();
                $row = $stmtSelect->fetch(PDO::FETCH_ASSOC);
                $updatedSell[] = $row['datum'];
            }
    }

        $filteredBulkData = array_filter($bulkData, function ($item) use ($updatedSell) {
            return in_array($item[2], $updatedSell);
        });

        foreach ($filteredBulkData as $item) {
            $id = intval($item[0]);
            $qty = intval($item[1]);
            $date = $item[2];
            $conn->prepare("INSERT INTO promet (prod_id, prodaja, datum) VALUES (?, ?, ?)")->execute([$id, $qty, $date]);
        }

        foreach ($filteredBulkData as $item) {
            $id = intval($item[0]);
            $qty = intval($item[1]);
            $conn->prepare("UPDATE proizvodi SET lager = lager - ? WHERE id = ?")->execute([$qty, $id]);
        }

        $conn->commit();
        $rowCount = count($filteredBulkData);
        echo json_encode($rowCount);
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
