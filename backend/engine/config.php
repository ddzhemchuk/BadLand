<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$config = [
    'currencies' => [
        ["code" => "USD", "icon" => "$", "rate" => 0.011],
        ["code" => "EUR", "icon" => "€", "rate" => 0.0099],
        ["code" => "KZT", "icon" => "₸", "rate" => 4.86],
        ["code" => "UAH", "icon" => "₴", "rate" => 0.42],
        // ["code" => "BYN", "icon" => "Br", "rate" => 0.035]
    ],
    'paymentSystem' => [
        "apiKey" => "123",
        "shop_id" => "423"
    ],
    'contacts' => [
        [
            "title" => "Почта",
            "value" => "support@masedworld.net",
            "href" => "mailto:support@masedworld.net"
        ],
        [
            "title" => "ВКонтакте",
            "value" =>  "vk.me/mased_world",
            "href" => "https://vk.me/mased_world"
        ],
        [
            "title" => "Telegram",
            "value" =>  "@nickname",
            "href" => "https://t.me/nickname"
        ],
        [
            "title" => "Тест",
            "value" =>  "ссылки нет",
            "href" => false
        ],
    ],
    'how-to-buy' => [
        [
            "text" => "1. Выберите режим, введите
            ник и выберите товар",
            "image" => "/images/tutorial/step1.jpg"
        ],
        [
            "text" => "1. Выберите режим, введите
            ник и выберите товар",
            "image" => "/images/tutorial/step1.jpg"
        ],
        [
            "text" => "1. Выберите режим, введите
            ник и выберите товар",
            "image" => "/images/tutorial/step1.jpg"
        ],
        [
            "text" => "1. Выберите режим, введите
            ник и выберите товар",
            "image" => "/images/tutorial/step1.jpg"
        ],
        [
            "text" => "1. Выберите режим, введите
            ник и выберите товар",
            "image" => "/images/tutorial/step1.jpg"
        ],
    ],
    'servers' => [
        [
            "title" => "Сервер 1", //Отображается на сайте
            "id" => "main", //ID сервера (уникальное значение)
            "rcon" => [ //для выдачи доната
                "ip" => "",
                "port" => 25565,
                "password" => ""
            ],

            //Товары, которые относятся к этом серверу:
            'categories' => [
                [
                    "group_title" => "Основной донат", //название группы товаров
                    "products" => [
                        [
                            "title" => "Вип", //отображается в списке товаров
                            "id" => "vip", //должно быть уникальное значение в рамках одного сервера
                            "price" => 100, //цена в рублях
                            "command" => "eco set {player} 500", //команда, которая будет выполнена после покупки. {player} будет заменено на ник игрока

                            /* 
                             *  опциональное описание товара, можно передать разметку HTMl. Если отсутствует или пустое, 
                             *  то отображаться не будет на странице "Описание доната", но всё равно можно будет купить:
                            */
                            "description" => '<ul>
                                <li>Префикс в чате</li>
                                <li>Команды /kit vip</li></ul>'
                        ],
                        [
                            "title" => "Креатив",
                            "id" => "creative",
                            "price" => 150,
                            "command" => "eco set {player} 1000",
                            "description" => 'Просто обычный текст, ничего особенного'
                        ],
                        [
                            "title" => "Своё количество",
                            "id" => "custom",
                            "command" => "eco set {player} {amount}",
                            "custom" => [ //настройки для товара с кастомным количеством
                                "min" => 1, //минимальное количество
                                "max" => 1000, //максимальное количество
                                "price" => 5, //цена за 1 единицу товара
                            ],
                        ],
                    ],
                ],
                [
                    "group_title" => "Ключи",
                    "products" => [
                        [
                            "title" => "1 ключ",
                            "id" => "key-1",
                            "price" => 100,
                            "command" => "give {player} 1 key",
                            "description" => 'Просто обычный текст, ничего особенного'
                        ],
                    ],
                ],
            ]
        ],
        [
            "title" => "Сервер 2", //Отображается на сайте
            "id" => "test", //ID сервера (уникальное значение)
            "rcon" => [ //для выдачи доната
                "ip" => "",
                "port" => 25565,
                "password" => ""
            ],

            //Товары, которые относятся к этом серверу:
            'categories' => [
                [
                    "group_title" => "Ключи",
                    "products" => [
                        [
                            "title" => "2 ключ",
                            "id" => "key-2",
                            "price" => 100,
                            "command" => "give {player} 1 key",
                        ],
                    ],
                ],
            ]
        ]
    ],

];
