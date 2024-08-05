<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/engine/config.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/engine/utils.php';

$prefix = "[BETATRANSFER]";
$secret = $config["paymentSystems"]["betaTransfer"]["api_secret"];

writeToLog($prefix, "DATA IN: " . print_r($_POST, true));


$sign = $_POST['sign'] ?? null;
$amount = $_POST['amount'] ?? null;
$orderId = $_POST['orderId'] ?? null;
$comment = $_POST['user_comment'] ?? null;

if ($sign && $amount && $orderId && $comment && $sign == md5($amount . $orderId . $secret)) {
    $data = json_decode($comment, true);

    executeRconCommand($data["server"], $data["command"], $prefix);

    die('OK');
}
