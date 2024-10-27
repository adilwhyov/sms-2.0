// Импортируем необходимые функции из Firebase
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onChildAdded, push, child, get, onValue } from "firebase/database";
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier, onAuthStateChanged } from "firebase/auth";

// Настройка Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Функция для очистки email от запрещенных символов
function sanitizeEmail(email) {
    return email.replace(/\./g, '_'); // Заменяем '.' на '_'
}

// Загрузка списка друзей
function loadFriends() {
    const friendList = document.getElementById('friend-list');
    friendList.innerHTML = ''; // Очищаем список перед добавлением

    const friendsRef = ref(database, 'friends/' + auth.currentUser.uid);
    onChildAdded(friendsRef, (data) => {
        const friend = data.val();
        const li = document.createElement('li');
        li.className = 'list-group-item friend-item';
        li.textContent = friend.email;

        li.addEventListener('click', () => {
            currentFriendEmail = sanitizeEmail(friend.email); // Применяем преобразование
            document.getElementById('chat-container').style.display = 'block';
            loadChatMessages();
        });

        friendList.appendChild(li);
    });
}

// Загрузка сообщений
function loadChatMessages() {
    const messagesList = document.getElementById('messages-list');
    messagesList.innerHTML = ''; // Очищаем список сообщений

    const chatId = getChatId(auth.currentUser.email, currentFriendEmail);
    const messagesRef = ref(database, `messages/${chatId}`);

    onValue(messagesRef, (snapshot) => {
        messagesList.innerHTML = ''; // Очищаем перед добавлением новых сообщений
        snapshot.forEach((childSnapshot) => {
            const message = childSnapshot.val();
            const li = document.createElement('li');
            li.textContent = `${message.sender}: ${message.text}`;
            messagesList.appendChild(li);
        });
    });
}

// Получение уникального идентификатора чата
function getChatId(email1, email2) {
    const sanitizedEmail1 = sanitizeEmail(email1); // Применяем преобразование
    const sanitizedEmail2 = sanitizeEmail(email2); // Применяем преобразование
    const sortedEmails = [sanitizedEmail1, sanitizedEmail2].sort();
    return `${sortedEmails[0]}_${sortedEmails[1]}`; // Формируем уникальный идентификатор
}

// Обработка отправки сообщения
const messageForm = document.getElementById('message-form');
messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const messageInput = document.getElementById('message');
    const message = messageInput.value;

    if (currentFriendEmail) {
        const chatId = getChatId(auth.currentUser.email, currentFriendEmail);
        const messagesRef = ref(database, `messages/${chatId}`);

        push(messagesRef, { text: message, sender: auth.currentUser.email });
        messageInput.value = ''; // Очищаем поле ввода
        console.log("Сообщение отправлено:", message);
    } else {
        alert("Сначала выберите друга для чата.");
    }
});

// Проверка состояния аутентификации
onAuthStateChanged(auth, (user) => {
    if (user) {
        loadFriends(); // Загружаем друзей после входа
    } else {
        // Пользователь не аутентифицирован
        console.log("Пользователь не аутентифицирован");
    }
});
