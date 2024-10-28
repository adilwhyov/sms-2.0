function sendMessage() {
    const messageText = document.getElementById('message-input').value;
    if (messageText.trim()) {
        const messagesRef = collection(db, 'messages');
        addDoc(messagesRef, {
            user: auth.currentUser.email,
            text: messageText,
            timestamp: new Date()
        });
        document.getElementById('message-input').value = '';
    }
}
