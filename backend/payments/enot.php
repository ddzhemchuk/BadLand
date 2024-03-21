<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/engine/config.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/engine/utils.php';

$prefix = "[ENOT]";

$data = file_get_contents('php://input');

try {
    $data = json_decode($data, true);
    writeToLog($prefix, "DATA IN: " . print_r($data, true));
} catch (\Throwable $th) {
    die(json_encode(["success" => false, "error" => "Malformed JSON"]));
}

if (isset($data["invoice_id"]) && isset($data["status"]) && $data["status"] === "success") {
    $url = "https://api.enot.io/invoice/info?invoice_id={$data["invoice_id"]}&shop_id={$config["paymentSystem"]["shop_id"]}";

    $headers = [
        "accept: application/json",
        "x-api-key: {$config["paymentSystem"]["apiKey"]}"
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST, false);
    $response = curl_exec($ch);
    curl_close($ch);

    $response = json_decode($response, true);

    if (isset($response["data"]["status"]) && $response["data"]["status"] === "success") {
        writeToLog($prefix, "PAYMENT VERIFICATION " . print_r($data, true));

        if (!isset($response["data"]["custom_field"]["command"])) {
            writeToLog($prefix, "ERROR: command is missing");
        }

        if (!isset($response["data"]["custom_field"]["server"])) {
            writeToLog($prefix, "ERROR: server is missing");
        }

        executeRconCommand($response["data"]["custom_field"]["server"], $response["data"]["custom_field"]["command"], $prefix);
    } else {
        die(json_encode(["success" => false, "error" => "Not verified"]));
    }
} else {
    die(json_encode(["success" => false, "error" => "Не хватает данных"]));
}
