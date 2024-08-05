<?php

class BetaTransferApi
{

    const BASE_URL = 'https://merchant.betatransfer.io/api/';

    /**
     * @var string
     */
    private $public;

    /**
     * @var string
     */
    private $secret;


    public function __construct(string $public, string $secret)
    {
        $this->public = $public;
        $this->secret = $secret;
    }


    /**
     * Создание платежа
     * @param string $amount
     * @param string $currency
     * @param string $orderId
     * @param array $options
     * @return array
     */
    public function payment(
        string $amount,
        string $currency,
        string $orderId,
        array $options = []
    ): array {

        $options['amount'] = $amount;
        $options['currency'] = $currency;
        $options['orderId'] = $orderId;
        $options['fullCallback'] = 0;

        $options['sign'] = $this->generateSign($options);

        $queryData = [
            'token' => $this->public,
        ];

        return $this->request('/payment?' . http_build_query($queryData), $options);
    }


    /**
     * Инициализация платежа для h2h
     * @param string $amount
     * @param string $currency
     * @param string $orderId
     * @param string $paymentSystem
     * @param string $urlSuccess
     * @param string $urlFail
     * @param array $options
     * @return array
     */
    public function h2hInitialization(
        string $amount,
        string $currency,
        string $orderId,
        string $paymentSystem,
        string $urlSuccess,
        string $urlFail,
        array $options = []
    ): array {

        $options['fullCallback'] = 1;
        $options['amount'] = $amount;
        $options['currency'] = $currency;
        $options['orderId'] = $orderId;
        $options['paymentSystem'] = $paymentSystem;
        $options['urlSuccess'] = $urlSuccess;
        $options['urlFail'] = $urlFail;

        $options['sign'] = $this->generateSign($options);

        $queryData = [
            'token' => $this->public,
        ];

        return $this->request('/h2h/initialization?' . http_build_query($queryData), $options);
    }


    public function h2hCard(
        string $hash,
        string $card_number,
        string $expiry_month,
        string $expiry_year,
        string $cvv,
        array $options = []
    ): array {
        $options['hash'] = $hash;
        $options['card_number'] = $card_number;
        $options['expiry_month'] = $expiry_month;
        $options['expiry_year'] = $expiry_year;
        $options['cvv'] = $cvv;

        $options['sign'] = $this->generateSign($options);

        $queryData = [
            'token' => $this->public,
        ];

        return $this->request('/h2h/card?' . http_build_query($queryData), $options);
    }


    /**
     * Создание запроса на вывод
     * @param string $amount
     * @param string $currency
     * @param string $orderId
     * @param string $paymentSystem
     * @param array $options
     * @return array
     */
    public function withdrawalPayment(string $amount, string $currency, string $orderId, string $paymentSystem, array $options = []): array
    {

        $options['amount'] = $amount;
        $options['currency'] = $currency;
        $options['orderId'] = $orderId;
        $options['paymentSystem'] = $paymentSystem;

        $options['sign'] = $this->generateSign($options);

        $queryData = [
            'token' => $this->public,
        ];

        return $this->request('/withdrawal-payment?' . http_build_query($queryData), $options);
    }


    /**
     * Информация о балансе аккаунта и его статусе
     * @return array
     */
    public function accountInfo(): array
    {

        $queryData = [
            'token' => $this->public,
            'sign' => md5($this->public . $this->secret)
        ];

        return $this->request('/account-info?' . http_build_query($queryData));
    }

    /**
     * @param string|null $id
     * @param string|null $orderId
     * @return array
     * @throws Exception
     */
    public function info(string $id = null, string $orderId = null): array
    {

        $options = [];

        if ($id){
            $options['id'] = $id;
        }
        if ($orderId){
            $options['orderId'] = $orderId;
        }

        if (!$options){
            throw new Exception();
        }

        $options['sign'] = $this->generateSign($options);

        $queryData = [
            'token' => $this->public,
        ];

        return $this->request('/info?' . http_build_query($queryData), $options);
    }

    public function history(array $options = []): array
    {

        $options['sign'] = $this->generateSign($options);

        $queryData = [
            'token' => $this->public,
        ];

        return $this->request('/history?' . http_build_query($queryData), $options);
    }


    /**
     * @param array $options
     * @return string
     */
    private function generateSign(
        array $options
    ): string {
        return md5(implode("", $options) . $this->secret);
    }


    public function callbackSignIsValid($sign, $amount, $orderId): bool
    {
        return $sign == md5($amount . $orderId . $this->secret);
    }

    /**
     * @param string $action
     * @param array $data
     * @return array
     */
    private function request(
        string $action,
        array $data = []
    ): array {
        $ch = curl_init();
        
        $url = rtrim(self::BASE_URL, '/') . $action;

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

        if ($data) {
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
        }

        

        $response = curl_exec($ch);

        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        $curlError = curl_error($ch);

        $curlErrno = curl_errno($ch);

        curl_close($ch);

        if ($httpCode == 200) {
            $response = json_decode($response, true);
        }

        return [
            'code' => $httpCode,
            'error' => $curlError,
            'errno' => $curlErrno,
            'body' => $response,
        ];
    }
}

// $public = '********************************';
// $secret = '********************************';

// $class = new BetaTransferApi($public, $secret);




///* Прием и проверка колбека */
//$sign = $_POST['sign'] ?? null;
//$amount = $_POST['amount'] ?? null;
//$orderId = $_POST['orderId'] ?? null;
//
//if ($sign && $amount && $orderId && $class->callbackSignIsValid($sign, $amount, $orderId))
//{
//    // order handler
//
//    die('OK');
//}





///* Получение информации по аккаунту */
//echo '<pre>'; print_r($class->accountInfo()); echo '</pre>';
//exit();





//$history = $class->history([
//    'type' => 'deposit'
//]);
//echo '<pre>'; print_r($history); echo '</pre>';
//exit();




//$info = $class->info(null, 'test_5555');
//echo '<pre>'; print_r($info); echo '</pre>';
//exit();






///* Создание платежа */
//echo '<pre>';
//print_r($class->payment('1000.55', 'USD', 'test_221', ['paymentSystem' => 'Card'])); echo '</pre>';
//exit();






///* Создание запроса на вывод */
//$withdraw = $class->withdrawalPayment('1000', 'USD', 'test_888', 'Card', [
//    'address' => '4242424242424242'
//]);
//echo '<pre>'; print_r($withdraw); echo '</pre>';
//exit();





///* Запрос на указание данных карты плательщика */
//$init = $class->h2hInitialization('1500', 'USD', 'test_5555', 'Card', 'https://site.com/urlSuccess',
//    'https://site.com/urlFailv');
//echo '<pre>';
//print_r($init);
//echo '</pre>';
//$hash = $init['body']['hash'] ?? null;
//
//if (!$hash){
//    return;
//}
//
//$setCard = $class->h2hCard($hash, '4242424242424242', '05', '25', '366');
//echo '<pre>';
//print_r($setCard);
//echo '</pre>';
//exit();



