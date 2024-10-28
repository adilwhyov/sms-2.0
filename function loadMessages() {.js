function loadMessages() {
    const messagesRef = collection(db, 'messages');
    const messagesQuery = query(messagesRef, orderBy('timestamp'));

    onSnapshot(messagesQuery, snapshot => {
        const messagesContainer = document.getElementById('messages');
        messagesContainer.innerHTML = ''; // Очистить область сообщений

        snapshot.forEach(doc => {
            const message = doc.data();
            const messageElement = document.createElement('div');
            messageElement.textContent = `${message.user}: ${message.text}`;
            messagesContainer.appendChild(messageElement);
        });
    });
}
