function register() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
            alert("Регистрация успешна!");
        })
        .catch(error => {
            console.error("Ошибка регистрации:", error);
        });
}

function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            document.getElementById('login-container').style.display = 'none';
            document.getElementById('chat-container').style.display = 'block';
            loadMessages();
        })
        .catch(error => {
            console.error("Ошибка входа:", error);
        });
}
