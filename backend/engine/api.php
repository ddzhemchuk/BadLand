<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/engine/config.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/engine/utils.php';

if ($_SERVER['REQUEST_METHOD'] === "GET" && isset($_GET['action'])) {
    switch ($_GET['action']) {
        case 'home':
            //валюты
            $data = $config['currencies'];

            if (!isset($data) || !is_array($data) || empty($data)) {
                $data = [];
            }

            array_unshift($data, ["code" => "KZT", "icon" => "₸", "rate" => 1]);

            $response = [
                'currencies' => $data,
            ];

            //товары
            $data = $config['servers'];

            if (!isset($data) || !is_array($data) || empty($data)) {
                $response["servers"] = [];
            } else {
                $response["servers"] = removeSensetiveData($data);
            }

            //контакнты
            $data = $config['contacts'];

            if (!isset($data) || !is_array($data) || empty($data)) {
                $response["contacts"] = [];
            } else {
                $response["contacts"] = $data;
            }

            //контакнты
            $data = $config['agreements'];

            if (!isset($data) || !is_array($data) || empty($data)) {
                $response["agreements"] = [];
            } else {
                $response["agreements"] = getPages($data);
            }


            sendResponse(true, $response);
            break;
        case 'tutorial':
            $data = $config['how-to-buy'];

            if (!isset($data) || !is_array($data) || empty($data)) {
                sendResponse(false, false, "Нет доступных инструкций");
            }

            sendResponse(true, $data);
            break;
        case 'direct':
            $req_nickname = $_GET["nickname"] ?? null;
            $req_product = $_GET["product"] ?? null;
            $req_server = $_GET["server"] ?? null;
            $req_quantity = $_GET["quantity"] ?? null;
            $req_currency = $_GET["currency"] ?? "RUB";

            $payLink = toPay($req_nickname, $req_product, $req_server, $req_quantity, $req_currency, null);
            header("Location: $payLink");
            die();

            break;
        case 'page':
            $page_slug = $_GET["slug"] ?? null;
            $data = findPage($page_slug);

            if (!isset($data) || !is_array($data) || empty($data)) {
                sendResponse(false, false, "Страница не найдена");
            }

            sendResponse(true, $data);
            break;
        default:
            sendResponse(false, false, "Unknown action");
            break;
    }
}

if ($_SERVER['REQUEST_METHOD'] === "POST") {
    $data = file_get_contents('php://input');

    try {
        $data = json_decode($data, true);
    } catch (\Throwable $th) {
        sendResponse(false, false, "JSON expected");
    }

    if (!isset($data["action"])) {
        sendResponse(false, false, "Unknown action");
    }

    switch ($data["action"]) {
        case 'pay':
            $req_nickname = $data["nickname"] ?? null;
            $req_product = $data["product"] ?? null;
            $req_server = $data["server"] ?? null;
            $req_quantity = $data["quantity"] ?? null;
            $req_currency = $data["currency"] ?? null;
            $req_email = $data["email"] ?? null;

            $payLink = toPay($req_nickname, $req_product, $req_server, $req_quantity, $req_currency, $req_email);
            sendResponse(true, ["link" => $payLink]);

            break;
        default:
            sendResponse(false, false, "Unknown action");
            break;
    }
}
