Роут отправки письма (с готовым HTML)
POST https://api.rusender.ru/api/v1/external-mails/send
В заголовке «X-Api-Key» необходимо передать строкой ключ API для аутентификации.

Пример тела запроса
{
"idempotencyKey": "unique-key-string",
"mail": {
"to": {
"email": "user@example.com",
"name": "string"
},
"from": {
"email": "user@example.com",
"name": "string"
},
"subject": "string",
"previewTitle": "string",
"headers": {
},
"cc": "string",
"bcc": "string",
"html": "string",
"text": "string"
}
}
Описание полей
subject* (тема) — содержит тему или заголовок письма;
previewTitle — прехедер письма, до 255 символов;
html*, text — если передать и текстовую и HTML-версию одновременно, то клиент почты получателя будет решать, какую версию отобразить пользователю в зависимости от его настроек и возможностей. Обычно почтовые клиенты отображают в формате HTML, если они поддерживают эту функцию. Наш сервис автоматически генерирует text похожий на html, если text не передан (или передана пустая строка);
Важно:
Для приёма письма обязательно наличие хотя бы одного типа контента — html или text. Если оба поля отсутствуют, письмо будет отклонено.

name (to/from) — имя получателя/отправителя письма;
headers — системные заголовки письма (необязательно поле, для опытных пользователей) https://nodemailer.com/message/custom-headers;
cc и bcc — это адрес получателя копии и адрес получателя скрытой копии;
cc (Carbon Copy) — это поле «копия» или «отправить копию». Адресат указанный в CC получит копию сообщения, но все получатели смогут видеть, кому еще были отправлены копии сообщения;
bcc (Blind Carbon Copy) — это поле «скрытая копия». Это может быть полезно, если вы хотите отправить копию сообщения кому-то без раскрытия его адреса другим адресатам.
Если указаны получатели в cc или bcc, в ответе будет присутствовать дополнительное поле — additionalRecipients. Оно содержит информацию по каждому такому получателю.
attachments — вложение в письмо (файл), в формате массива файлов структурой вида:
{ "название файла.расширение": "тело файла закодированное в base64"};

idempotencyKey (String) — пользовательский ключ идемпотентности для предотвращения дублирования запросов.
Отправка с использованием ключа идемпотентности
Если в течение одного часа поступает повторный запрос на отправку письма с полностью совпадающими параметрами:

From (отправитель);
To (получатель);
Body (тело письма);
Subject (заголовок);
Attachments (вложения).
Тогда:

без ключа идемпотентности API отвечает кодом 201 и возвращает тот же uuid письма, что и в первом запросе, повторная отправка не создаёт нового письма;
с ключом идемпотентности (idempotencyKey, передаётся вне блока mail) письма считаются разными при различающихся значениях ключа и будут отправлены повторно.
Рекомендации по использованию
Мы настоятельно рекомендуем всегда передавать свой уникальный idempotencyKey.

Использование пользовательского ключа идемпотентности считается необходимым для надёжного управления повторными запросами.

Механизм автоматического определения повторов без ключа существует только для обратной совместимости и базовой защиты от дублирования, но не гарантирует отсутствие пропущенных или лишних отправок.

Примечания
Сервис ограничивает частоту запросов: допускается не более 10 запросов в секунду с одного IP-адреса.
Кодировку указать нельзя, всегда используется UTF-8;
Запрос принимает любые системные заголовки, но те которые проставляются нами — имеют приоритет, а именно: Return-Path, List-Unsubscribe, Errors-To, X-Complaints-To, Precedence, Feedback-ID, X-SenderName-MailID, X-Mailru-Msgtype, X-Postmaster-Msgtype.
Возможные ответы
Статус	Описание
201	Email accepted for sending

Пример:

{ "uuid": "3fa85f64-5717-4562-b3fc-2c963f66afa6"}
400	Request body format is invalid

Пример:

{ "message": "mail.to.name must be shorter than or equal to 255 characters,mail.from.email must be an email", "statusCode": 400}

or «Attachments parse failed» or «Attachments size more than allowed» or «Attachments type forbidden»
401	Invalid api-key

Пример:

{ "message": "Неверный ключ API", "statusCode": 401}

Решение — замените код передачи API-ключа на:

$headers = array( 'Content-Type: application/json', 'X-Api-Key: YOUR_API_KEY');
402	Is not enough resource on user Balance
403	ExternalMailApiKey not enabled, or user domain is not verify
404	User, UserDomain or ExternalMailApiKey not found
422	Email receiver unsubscribed from this API key mails
422	Email receiver complained from this API key mails
422	Email receiver doesn’t exist
422	Email receiver unavailable
503	Service temporarily unavailable
Ограничения по прикрепляемым файлам и размеру
Ограничение на размер тела запроса	5 мб
Ограничение на общий размер вложений в письме	5 мб
Ограничение на количество вложений в письме	20 штук
Ограничение на вложения в письме (тип файла)	ADE, ADP, APK, APPX, APPXBUNDLE, BAT, CAB, CHM, CMD, COM, CPL, DIAGCAB, DIAGCFG, DIAGPACK, DLL, DMG, EX, EX_, EXE, HTA, IMG, INS, ISO, ISP, JAR, JNLP, JS, JSE, LIB, LNK, MDE, MSC, MSI, MSIX, MSIXBUNDLE, MSP, MST, NSH, PIF, PS1, SCR, SCT, SHB, SYS, VB, VBE, VBS, VHD, VXD, WSC, WSF, WSH, XLL.
Примеры использования API
PHP
$url = 'https://api.rusender.ru/api/v1/external-mails/send';
$data = array(
'idempotencyKey' => 'unique-key-string',
'mail' => array(
'to' => array(
'email' => 'user@example.com',
'name' => 'string'
),
'from' => array(
'email' => 'user@example.com',
'name' => 'string'
),
'subject' => 'string',
'previewTitle' => 'string',
'html' => 'string'
)
);
$headers = array(
'Content-Type' => 'application/json',
'X-Api-Key' => 'YOUR_API_KEY'
);
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
Python
import requests
import json
url = 'https://api.rusender.ru/api/v1/external-mails/send'
data = {
'idempotencyKey': 'unique-key-string',
'mail': {
'to': {
'email': 'user@example.com',
'name': 'string'
},
'from': {
'email': 'user@example.com',
'name': 'string'
},
'subject': 'string',
'previewTitle': 'string',
'html': 'string'
}
}
headers = {
'Content-Type': 'application/json',
'X-Api-Key': 'YOUR_API_KEY'
}
response = requests.post(url, json=data, headers=headers)
Node.js
const axios = require('axios');
const url = 'https://api.rusender.ru/api/v1/external-mails/send';
const data = {
idempotencyKey: 'unique-key-string',
mail: {
to: {
email: 'user@example.com',
name : 'string'
},
from: {
email: 'user@example.com',
name: 'string'
},
subject: 'string',
previewTitle: 'string',
html: 'string'
}
};
const headers = {
'Content-Type': 'application/json',
'X-Api-Key': 'YOUR_API_KEY'
};
axios.post(url, data, { headers })
.then(response => {
// Обработка ответа API
})
.catch(error => {
// Обработка ошибки
});
JavaScript
const url = 'https://api.rusender.ru/api/v1/external-mails/send';
const data = {
idempotencyKey: 'unique-key-string',
mail: {
to: {
email: 'user@example.com',
name: 'string'
},
from: {
email: 'user@example.com',
name: 'string'
},
subject: 'string',
previewTitle: 'string',
html: 'string'
}
};
const headers = {
'Content-Type': 'application/json',
'X-Api-Key': 'YOUR_API_KEY'
};
fetch(url, {
method: 'POST',
headers: headers,
body: JSON.stringify(data)
})
.then(response => response.json())
.then(data => {
// Обработка ответа API
})
.catch(error => {
// Обработка ошибки
});
Отправка письма с использованием шаблона RuSender
POST 'https://api.rusender.ru/api/v1/external-mails/send-by-template';
В заголовке «X-Api-Key» передать строкой ключ API для аутентификации.

Запрос идентичен обычной отправки письма по API за исключением тела письма (тело не имеет html и text, однако имеет idTemplateMailUser и params).

Пример тела запроса
{
"idempotencyKey": "unique-key-string",
"mail": {
"to": {
"email": "user@example.com",
"name": "string"
},
"from": {
"email": "user@example.com",
"name": "string"
},
"subject": "string",
"previewTitle": "string",
"idTemplateMailUser": number,
"params": {
"test": "string",
"test1": "string",
"test2": "string"
}
}
}
Описание полей
subject* (тема) — содержит тему или заголовок письма;
previewTitle — прехедер письма, до 255 символов;
html*, text — если передать и текстовую и HTML-версию одновременно, то клиент почты получателя будет решать, какую версию отобразить пользователю в зависимости от его настроек и возможностей. Обычно почтовые клиенты отображают в формате HTML, если они поддерживают эту функцию. Наш сервис автоматически генерирует text похожий на html, если text не передан (или передана пустая строка);
Важно:
Для приёма письма обязательно наличие хотя бы одного типа контента — html или text. Если оба поля отсутствуют, письмо будет отклонено.

name (to/from) — имя получателя/отправителя письма;
headers — системные заголовки письма (необязательно поле, для опытных пользователей) https://nodemailer.com/message/custom-headers;
cc и bcc — это адрес получателя копии и адрес получателя скрытой копии;
cc (Carbon Copy) — это поле «копия» или «отправить копию». Адресат указанный в CC получит копию сообщения, но все получатели смогут видеть, кому еще были отправлены копии сообщения;
bcc (Blind Carbon Copy) — это поле «скрытая копия». Это может быть полезно, если вы хотите отправить копию сообщения кому-то без раскрытия его адреса другим адресатам.
Если указаны получатели в cc или bcc, в ответе будет присутствовать дополнительное поле — additionalRecipients. Оно содержит информацию по каждому такому получателю.
attachments — вложение в письмо (файл), в формате массива файлов структурой вида:
{ "название файла.расширение": "тело файла закодированное в base64"};

idempotencyKey (String) — пользовательский ключ идемпотентности для предотвращения дублирования запросов.
Отправка с использованием ключа идемпотентности
Если в течение одного часа поступает повторный запрос на отправку письма с полностью совпадающими параметрами:

From (отправитель);
To (получатель);
Body (тело письма);
Subject (заголовок);
Attachments (вложения).
Тогда:

без ключа идемпотентности API отвечает кодом 201 и возвращает тот же uuid письма, что и в первом запросе, повторная отправка не создаёт нового письма;
с ключом идемпотентности (idempotencyKey, передаётся вне блока mail) письма считаются разными при различающихся значениях ключа и будут отправлены повторно.
Рекомендации по использованию
Мы настоятельно рекомендуем всегда передавать свой уникальный idempotencyKey.

Использование пользовательского ключа идемпотентности считается необходимым для надёжного управления повторными запросами.

Механизм автоматического определения повторов без ключа существует только для обратной совместимости и базовой защиты от дублирования, но не гарантирует отсутствие пропущенных или лишних отправок.

Примеры использования API с шаблоном письма RuSender
PHP
$url = 'https://api.rusender.ru/api/v1/external-mails/send-by-template';
$data = array(
'idempotencyKey' => 'unique-key-string',
'mail' => array(
'to' => array(
'email' => 'user@example.com',
'name' => 'string'
),
'from' => array(
'email' => 'user@example.com',
'name' => 'string'
),
'subject' => 'string',
'previewTitle' => 'string',
'idTemplateMailUser' => number,
'params' => array(
'test' => 'string',
'test1' => 'string',
'test2' => 'string'
)
)
);
$headers = array(
'Content-Type' => 'application/json',
'X-Api-Key' => 'YOUR_API_KEY'
);
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
Python
import requests
import json
url = 'https://api.rusender.ru/api/v1/external-mails/send-by-template'
data = {
'idempotencyKey': 'unique-key-string',
'mail': {
'to': {
'email': 'user@example.com',
'name': 'string'
},
'from': {
'email': 'user@example.com',
'name': 'string'
},
'subject': 'string',
'previewTitle': 'string',
'idTemplateMailUser': number,
'params': {
'test': 'string',
'test1': 'string',
'test2': 'string'
}
}
}
headers = {
'Content-Type': 'application/json',
'X-Api-Key': 'YOUR_API_KEY'
}
response = requests.post(url, json=data, headers=headers)
Node.js
const axios = require('axios');
const url = 'https://api.rusender.ru/api/v1/external-mails/send-by-template';
const data = {
idempotencyKey: 'unique-key-string',
mail: {
to: {
email: 'user@example.com',
name: 'string'
},
from: {
email: 'user@example.com',
name: 'string'
},
subject: 'string',
previewTitle: 'string',
idTemplateMailUser: number,
params: {
test: 'string',
test1: 'string',
test2: 'string'
}
}
};
const headers = {
'Content-Type': 'application/json',
'X-Api-Key': 'YOUR_API_KEY'
};
axios.post(url, data, { headers })
.then(response => {
// Обработка ответа API
})
.catch(error => {
// Обработка ошибки
});
JavaScript
const url = 'https://api.rusender.ru/api/v1/external-mails/send-by-template';
const data = {
idempotencyKey: 'unique-key-string',
mail: {
to: {
email: 'user@example.com',
name: 'string'
},
from: {
email: 'user@example.com',
name: 'string'
},
subject: 'string',
previewTitle: 'string',
idTemplateMailUser: number,
params: {
test: 'string',
test1: 'string',
test2: 'string'
}
}
};
const headers = {
'Content-Type': 'application/json',
'X-Api-Key': 'YOUR_API_KEY'
};
fetch(url, {
method: 'POST',
headers: headers,
body: JSON.stringify(data)
})
.then(response => response.json())
.then(data => {
// Обработка ответа API
})
.catch(error => {
// Обработка ошибки
});
Если запрос возвращает ошибку: «Неверный ключ API», замените код передачи API-ключа на:
$headers = array( 'Content-Type: application/json', 'X-Api-Key: YOUR_API_KEY');
