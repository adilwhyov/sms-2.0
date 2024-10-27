// Настройка Firebase
const firebaseConfig = {
    apiKey: "ВАШ_API_KEY",
    authDomain: "ВАШ_AUTH_DOMAIN",
    databaseURL: "ВАШ_DATABASE_URL",
    projectId: "ВАШ_PROJECT_ID",
    storageBucket: "ВАШ_STORAGE_BUCKET",
    messagingSenderId: "ВАШ_MESSAGING_SENDER_ID",
    appId: "ВАШ_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const friendsRef = ref(database, 'friends/' + auth.currentUser?.uid);

// Регистрация пользователя
document.getElementById('signup-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
            alert("Регистрация успешна!");
            document.getElementById('signup-form').reset();
        })
        .catch((error) => {
            alert("Ошибка регистрации: " + error.message);
        });
});

// Вход пользователя
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            alert("Вход успешен!");
            document.getElementById('auth-container').style.display = 'none';
            document.getElementById('add-friend-container').style.display = 'block';
            document.getElementById('chat-container').style.display = 'block';
            loadFriends();
        })
        .catch((error) => {
            alert("Ошибка входа: " + error.message);
        });
});

// Добавление друга
document.getElementById('add-friend-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const friendEmail = document.getElementById('friend-email').value;

    push(friendsRef, { email: friendEmail })
        .then(() => {
            alert("Друг добавлен!");
            document.getElementById('friend-email').value = '';
            loadFriends();
        })
        .catch((error) => alert("Ошибка при добавлении друга: " + error.message));
});

// Загрузка списка друзей
function loadFriends() {
    const friendList = document.getElementById('friend-list');
    friendList.innerHTML = '';

    onChildAdded(friendsRef, (data) => {
        const friend = data.val();
        const friendItem = document.createElement('li');
        friendItem.classList.add('friend-item');
        friendItem.textContent = friend.email;
        friendItem.setAttribute('data-email', friend.email);
        
        friendItem.addEventListener('click', () => {
            loadChatMessages(friend.email);
            document.getElementById('chat-container').style.display = 'block';
        });

        friendList.appendChild(friendItem);
    });
}

// Отправка сообщения
document.getElementById('message-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const message = document.getElementById('message').value;
    const friendEmail = document.querySelector('.friend-item.active')?.getAttribute('data-email');

    if (friendEmail) {
        push(ref(database, `messages/${friendEmail}`), {
            sender: auth.currentUser.email,
            text: message,
            timestamp: Date.now()
        }).then(() => {
            document.getElementById('message').value = '';
            loadChatMessages(friendEmail);
        }).catch((error) => alert("Ошибка при отправке сообщения: " + error.message));
    } else {
        alert("Выберите друга для отправки сообщения.");
    }
});

// Загрузка сообщений из чата
function loadChatMessages(friendEmail) {
    const messagesList = document.getElementById('messages');
    messagesList.innerHTML = '';

    onChildAdded(ref(database, `messages/${friendEmail}`), (data) => {
        const message = data.val();
        const messageItem = document.createElement('li');
        messageItem.textContent = `${message.sender}: ${message.text}`;
        messagesList.appendChild(messageItem);
    });
}
