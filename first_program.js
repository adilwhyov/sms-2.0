            confirmationResult.confirm(code).then((result) => {
                const user = result.user;
                alert("Аутентификация успешна: " + user.phoneNumber);
                chatContainer.style.display = 'block';
            }).catch((error) => {
                alert("Ошибка при подтверждении кода: " + error.message);
            });
        });

        logoutButton.addEventListener('click', () => {
            signOut(auth)
                .then(() => {
                    alert("Вы вышли из учетной записи.");
                    chatContainer.style.display = 'none';
                });
        });

        // Добавление друга
        document.getElementById('add-friend-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const friendEmail = document.getElementById('friend-email').value;
            push(friendsRef, { email: friendEmail });
            document.getElementById('friend-email').value = '';
            loadFriends();
        });

        // Загрузка друзей
        function loadFriends() {
            const friendList = document.getElementById('friend-list');
            friendList.innerHTML = ''; // Очистить список друзей
            onChildAdded(friendsRef, (data) => {
                const friend = data.val();
                const li = document.createElement('li');
                li.classList.add('list-group-item', 'friend-item');
                li.textContent = friend.email;
                li.onclick = () => startChat(friend.email);
                friendList.appendChild(li);
            });
        }

        // Начать чат с другом
        function startChat(friendEmail) {
            document.getElementById('friend-name').textContent = friendEmail;
            chatContainer.style.display = 'block';
            loadMessages(friendEmail);
        }

        // Загрузка сообщений
        function loadMessages(friendEmail) {
            const messagesList = document.getElementById('messages');
            messagesList.innerHTML = ''; // Очистить старые сообщения
            onChildAdded(ref(database, 'messages/' + friendEmail), (data) => {
                const message = data.val();
                const li = document.createElement('li');
                li.textContent = message;
                messagesList.appendChild(li);
            });

            // Отправка сообщения
            messageForm.onsubmit = (e) => {
                e.preventDefault();
                const messageInput = document.getElementById('message');
                const message = messageInput.value;
                const user = auth.currentUser;
                if (user) {
                    push(ref(database, 'messages/' + friendEmail), `${user.email || user.phoneNumber}: ${message}`);
                    messageInput.value = '';
                }
            };
        }
    </script>
</body>
</html>
