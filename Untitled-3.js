// Импортируйте функции, необходимые из SDK
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set, onValue } from "firebase/database"; // Импортируем необходимые функции для работы с базой данных
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth"; // Импортируем функции аутентификации

// Конфигурация Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCC3RzyblsZTeFM1Qy_60FZ6ZjdasfD2yQ",
    authDomain: "adilwhyov.firebaseapp.com",
    databaseURL: "https://adilwhyov-default-rtdb.firebaseio.com",
    projectId: "adilwhyov",
    storageBucket: "adilwhyov.appspot.com",
    messagingSenderId: "780959026674",
    appId: "1:780959026674:web:26c947984611ecde68af6b",
    measurementId: "G-HZE48K1GBC"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app); // Инициализация базы данных
const auth = getAuth(app); // Инициализация аутентификации

// Элементы интерфейса
const loginForm = document.getElementById('login-form');
const friendList = document.getElementById('friend-list');
const chatContainer = document.getElementById('chat-container');
const messagesList = document.getElementById('messages-list');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message');

// Функция для отображения списка друзей
function loadFriends() {
    const friendsRef = ref(database, 'friends/');
    onValue(friendsRef, (snapshot) => {
        friendList.innerHTML = '';
        snapshot.forEach((childSnapshot) => {
            const friendEmail = childSnapshot.val();
            const li = document.createElement('li');
            li.textContent = friendEmail;
            li.addEventListener('click', () => loadChatMessages(friendEmail));
            friendList.appendChild(li);
        });
    });
}

// Функция для загрузки сообщений чата
function loadChatMessages(friendEmail) {
    chatContainer.style.display = 'block';
    messagesList.innerHTML = ''; // Очистить предыдущее содержимое сообщений

    const messagesRef = ref(database, `messages/${friendEmail}`);
    onValue(messagesRef, (snapshot) => {
        messagesList.innerHTML = ''; // Очистить предыдущие сообщения
        snapshot.forEach((childSnapshot) => {
            const message = childSnapshot.val();
            const li = document.createElement('li');
            li.textContent = message;
            messagesList.appendChild(li);
        });
    });
}

// Обработчик отправки сообщения
messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    const friendEmail = document.querySelector('#friend-list li.active').textContent; // Получение активного друга
    const messagesRef = ref(database, `messages/${friendEmail}`);

    // Сохранение сообщения в базу данных
    set(ref(messagesRef, Date.now()), message)
        .then(() => {
            messageInput.value = ''; // Очистка поля ввода сообщения
        })
        .catch((error) => {
            console.error("Ошибка при отправке сообщения:", error);
        });
});

// Обработчик формы входа
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Вход выполнен успешно
            const user = userCredential.user;
            console.log("Вход выполнен:", user);
            loadFriends(); // Загрузка списка друзей после входа
            loginForm.reset(); // Очистка формы входа
        })
        .catch((error) => {
            console.error("Ошибка при входе:", error.message);
        });
});

// Инициализация интерфейса
function initApp() {
    // Показать/скрыть элементы интерфейса в зависимости от состояния аутентификации
    auth.onAuthStateChanged((user) => {
        if (user) {
            // Пользователь вошел
            loginForm.style.display = 'none'; // Скрыть форму входа
            chatContainer.style.display = 'block'; // Показать контейнер чата
            loadFriends(); // Загрузить друзей
        } else {
            // Пользователь вышел
            loginForm.style.display = 'block'; // Показать форму входа
            chatContainer.style.display = 'none'; // Скрыть контейнер чата
        }
    });
}

initApp(); // Вызов функции инициализации
