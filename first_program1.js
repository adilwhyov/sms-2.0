// Настройка reCAPTCHA
let appVerifier; // Переменная для хранения экземпляра reCAPTCHA
document.getElementById('phone-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const phoneNumber = document.getElementById('phone-number').value;

    // Проверяем, инициализирована ли reCAPTCHA
    if (!appVerifier) {
        appVerifier = new RecaptchaVerifier('recaptcha-container', {
            'size': 'invisible', // или 'normal' для видимой reCAPTCHA
        }, auth);
    }

    // Запрос на отправку SMS кода
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
        .then((confirmationResult) => {
            window.confirmationResult = confirmationResult;
            document.getElementById('verification-code-form').style.display = 'block';
            document.getElementById('phone-form').style.display = 'none';
        }).catch((error) => {
            alert("Ошибка при отправке кода: " + error.message);
        });
});
