class WebSocketService {

    static instance = null;
    callbacks = {};

    static getInstance() {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService()
        }
        return WebSocketService.instance;
    }

    constructor() {
        this.socketRef = null;
    }

    connect(chat_id) {
        console.log('connecting...')
        this.chat_id = chat_id
        const path = 'ws://127.0.0.1:8000/ws/chat/' + chat_id + '/';
        this.socketRef = new WebSocket(path);
        this.socketRef.onopen = () => {
            console.log('websocket open');
        };
        this.socketNewMessage(JSON.stringify({
          command: 'fetch_messages'
        }));
        this.socketRef.onmessage = event => {
            this.socketNewMessage(event.data);
        }
        this.socketRef.onerror = error => {
            console.log(error.message);
        }
        this.socketRef.onclose = () => {
            console.log('websocket is closed');
            this.connect();
        }
    }

    socketNewMessage(data) {
        const parsedData = JSON.parse(data);
        const command = parsedData.command;
        if (Object.keys(this.callbacks).length === 0) {
            return;
        }
        if (command === 'messages') {
            this.callbacks[command](parsedData.messages);
        }
        if (command === 'new_message') {
            this.callbacks[command](parsedData.message);
        }
    }

    fetchMessages(username) {
        this.sendMessage({
            command: 'fetch_messages', 
            username: username,
            chat_id: this.chat_id
        })
    }

    newChatMessage(message) {
        this.sendMessage({ command: 'new_message', from: message.from, message: message.content })
    }

    addCallbacks(messagesCallback, newMessageCallback) {

        this.callbacks['messages'] = messagesCallback;
        this.callbacks['new_message'] = newMessageCallback;
    }

    sendMessage(data) {
        try {
            this.socketRef.send(JSON.stringify({ ...data }))
        } catch (error) {
            console.log(error.message);
        }
    }

    state() {
        return this.socketRef.readyState;
    }
}

const WebSocketInstance = WebSocketService.getInstance();

export default WebSocketInstance;