<?php

return [
    'email' => [
        'title' => 'Zaktualizuj swój e-mail',
        'updated' => 'Twój adres e-mail został zaktualizowany.',
    ],
    'password' => [
        'title' => 'Zmień swoje hasło',
        'requirements' => 'Twoje nowe hasło powinno mieć co najmniej 8 znaków.',
        'updated' => 'Twoje hasło zostało zaktualizowane.',
    ],
    'two_factor' => [
        'button' => 'Skonfiguruj uwierzytelnianie dwuskładnikowe',
        'disabled' => 'Uwierzytelnianie dwuskładnikowe zostało wyłączone na Twoim koncie. Nie będziesz już proszony o podanie kodu podczas logowania.',
        'enabled' => 'Uwierzytelnianie dwuskładnikowe zostało włączone na Twoim koncie! Odtąd podczas logowania będziesz musiał podać kod wygenerowany przez twoje urządzenie.',
        'invalid' => 'Podany token był nieprawidłowy.',
        'setup' => [
            'title' => 'Skonfiguruj uwierzytelnianie dwuskładnikowe',
            'help' => 'Nie możesz zeskanować kodu? Wpisz poniższy kod do swojej aplikacji:',
            'field' => 'Wpisz token',
        ],
        'disable' => [
            'title' => 'Wyłącz uwierzytelnianie dwuskładnikowe',
            'field' => 'Wpisz token',
        ],
    ],
];
