<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/engine/config.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/engine/Rcon.class.php';

function writeToLog($prefix, $text)
{
    file_put_contents($_SERVER['DOCUMENT_ROOT'] . '/engine/logs.txt', "$prefix $text\n\n", FILE_APPEND | LOCK_EX);
}

function findServerProduct($servers, $req_server, $req_product)
{
    $result = [
        "server" => null,
        "product" => null,
    ];

    foreach ($servers as $serverItem) {
        if ($serverItem["id"] == $req_server) {
            $result["server"]["id"] = $serverItem["id"];
            $result["server"]["rcon"] = $serverItem["rcon"];

            foreach ($serverItem['categories'] as $categoryItem) {
                foreach ($categoryItem['products'] as $productItem) {
                    if ($productItem['id'] ==  $req_product) {
                        $result["product"] = $productItem;
                    }
                }
            }
        }
    }

    return $result;
}

function executeRconCommand($server, $command, $prefix)
{
    global $config;

    $data = findServerProduct($config["servers"], $server, null);

    if (isset($data["server"]["rcon"])) {
        $rcon = new Rcon($data["server"]["rcon"]["ip"], $data["server"]["rcon"]["port"], $data["server"]["rcon"]["password"], 5);

        if (@$rcon->connect()) {
            $rcon->send_command($command);
            writeToLog($prefix, "SENT COMMAND, RESPONSE: " . $rcon->get_response());
        } else {
            writeToLog($prefix, "RCON ERROR (COMMAND '$command' FOR SERVER '$server': " . $rcon->get_response());
        }
    }
}

function toPay($req_nickname, $req_product, $req_server, $req_quantity, $req_currency)
{
    global $config;

    $servers = $config['servers'];
    if (!validateCurrency($req_currency)) {
        sendResponse(false, false, "Валюта не существует");
    }

    if (!$req_product || !$req_server) {
        sendResponse(false, false, "Fields nickname, product, server are required");
    }

    if (!validateNickname($req_nickname)) {
        sendResponse(false, false, "Формат ника не соответствует стандарту");
    }

    $valid_data = findServerProduct($servers, $req_server, $req_product);

    if (!$valid_data["server"]) {
        sendResponse(false, false, "Сервер не найден");
    }

    if (!$valid_data["product"]) {
        sendResponse(false, false, "Товар не найден");
    }

    $finalCommand = str_replace("{player}", $req_nickname, $valid_data["product"]["command"]);
    $finalAmount = $valid_data["product"]["price"] ?? 0;

    if (isset($valid_data["product"]["custom"])) {
        $req_quantity = (int) $req_quantity;

        if ($req_quantity < $valid_data["product"]["custom"]["min"] || $req_quantity > $valid_data["product"]["custom"]["max"]) {
            sendResponse(false, false, "Количество не может быть меньше {$valid_data["product"]["custom"]["min"]} и не может быть больше {$valid_data["product"]["custom"]["max"]}. Передано значение: $req_quantity");
        }

        $finalCommand = str_replace("{amount}", $req_quantity, $finalCommand);
        $finalAmount = round($valid_data["product"]["custom"]["price"] * $req_quantity, 2);
    }

    $payLink = getPaymentLink($finalAmount, $finalCommand, $valid_data["server"]["id"], $req_currency);

    if ($payLink) {
        return $payLink;
    } else {
        sendResponse(false, false, "Не удалось сформировать ссылку для оплаты");
    }
}

function validateNickname($nickname)
{
    return preg_match('/^[a-zA-Z0-9_]{2,16}$/', $nickname);
}

function validateCurrency($currency)
{
    global $config;

    $exists = false;

    if ($currency == "RUB") {
        $exists = true;
    } else {
        foreach ($config['currencies'] as $value) {
            if ($value['code'] == $currency) {
                $exists = true;
            }
        }
    }

    return $exists;
}

function getPaymentLink($amount, $command, $server, $currency)
{
    global $config;

    $apiKey = $config['paymentSystem']["apiKey"];
    $shop_id = $config['paymentSystem']["shop_id"];

    if ($currency != "RUB") {
        foreach ($config['currencies'] as $value) {
            if ($value["code"] == $currency) {
                $amount = round($amount * $value["rate"], 2);
                break;
            }
        }
    }

    $invoiceData = [
        "amount" => $amount,
        "order_id" => uniqid(),
        "currency" => $currency,
        "custom_fields" => ["command" => $command, "server" => $server],
        "shop_id" => $shop_id
    ];

    $url = "https://api.enot.io/invoice/create";
    $headers = [
        "accept: application/json",
        "content-type: application/json",
        "x-api-key: {$apiKey}"
    ];
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($invoiceData));
    $response = curl_exec($ch);
    curl_close($ch);

    $response = json_decode($response, true);

    if (isset($response["url"])) {
        return $response["url"];
    } else {
        return false;
    }
}

function sendResponse($success, $data, $msg = false)
{
    $response = [
        'success' => $success,
    ];

    if ($data) {
        $response['data'] = $data;
    }

    if ($msg) {
        $response['message'] = $msg;
    }

    die(json_encode($response));
}

function removeSensetiveData($data)
{
    foreach ($data as $serverKey => $server) {
        if ($server['rcon']) {
            unset($data[$serverKey]['rcon']);
        }

        foreach ($server['categories'] as $key => $category) {
            if (isset($category['products']) && is_array($category['products']) && !empty($category['products'])) {
                foreach ($category['products'] as $productKey => $product) {
                    if (isset($product['command'])) {
                        unset($data[$serverKey]['categories'][$key]['products'][$productKey]['command']);
                    }
                }
            }
        }
    }


    return $data;
}
