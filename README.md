# The Guardian API

## Быстрый старт

### 1. Получение API ключа The Guardian

Для работы необходим API ключ The Guardian:

1. Перейдите на сайт [The Guardian Open Platform](https://open-platform.theguardian.com/access/)
2. Нажмите на кнопку "Register for a key"
3. Заполните форму регистрации и подтвердите email
4. Получите API ключ в письме или в личном кабинете

### 2. Установка API ключа в проект

Откройте файл `js/config.js` и замените значение `test` на ваш API ключ:

```javascript
const Config = {
    api: {
        guardianApi: {
            key: 'ВАШ_API_КЛЮЧ', // Замените 'test' на ваш ключ
            baseUrl: '[https://content.guardianapis.com](https://content.guardianapis.com)',
            // ...
        }
    }
};