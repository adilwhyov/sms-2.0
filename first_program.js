            // Очистка списка друзей перед загрузкой
            friendList.innerHTML = '';

            onChildAdded(friendsRef, (data) => {
                const friend = data.val();
                const friendItem = document.createElement('li');
                friendItem.className = 'list-group-item friend-item';
                friendItem.textContent = friend.email;
                friendItem.onclick = () => openChat(friend.email);
                friendList.appendChild(friendItem);
            });
        }

        function openChat(friendEmail) {
            const messages = document.getElementById('messages');
            messages.innerHTML = ''; // Очистка сообщений при открытии чата

            const friendMessagesRef = ref(database, 'messages/' + friendEmail);

            onChildAdded(friendMessagesRef, (data) => {
                const message = data.val();
                const messageItem = document.createElement('li');
                messageItem.textContent = message.text;
                messages.appendChild(messageItem);
            });

            messageForm.onsubmit = (e) => {
                e.preventDefault();
                const messageText = document.getElementById('message').value;
                push(friendMessagesRef, { text: messageText });
                document.getElementById('message').value = ''; // Очистка поля ввода
            };
        }

    </script>
</body>
</html>
