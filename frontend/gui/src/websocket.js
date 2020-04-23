class WebSocketInstance {

    constructor(chat_id) {
        this.chat_id = chat_id
        const path = 'ws://127.0.0.1:8000/ws/chat/' + chat_id + '/';
        this.socket_ref = new WebSocket(path);

        this.socket_ref.onopen = this.onOpen.bind(this);
        this.socket_ref.onerror = this.onError.bind(this);
        this.socket_ref.onmessage = this.onMessage.bind(this);
        this.socket_ref.onclose = this.onClose.bind(this);
    }
    
    onOpen = (event) => {
        console.log('open', event);
        this.fetchMessages();
    }
    onError = (error) => {
        console.log('error', error);
    }
    onMessage = (event) => {
        console.log('message', event);
        let data = JSON.parse(event.data);
        this.types[data.type](data);

    }
    onClose = (event) => {
        console.log('close', event);
    }
    returnReadyState = () => {
        return this.socket_ref.readyState;
    }

    addCallbacks = (renderMessages, addResponseMessageHandler) => {
        this.callbacks = {
            renderMessages: renderMessages,
            addResponseMessageHandler: addResponseMessageHandler
        }
        this.addTypes();
    }

    addTypes = () => {
        this.types = {
            old_messages: this.callbacks.renderMessages,
            new_message: this.callbacks.addResponseMessageHandler
        }
    }

    newMessage = (newMessage) => {
        let message = {
            command: 'new_message',
            author: newMessage.from,
            content: newMessage.content
        }
        this.sendMessage(message);
    }

    fetchMessages = () => {
        let message = {
            command: 'fetch_messages',
            chat_id: this.chat_id
        }
        this.sendMessage(message);
    }

    sendMessage = (data) => {
        this.socket_ref.send(JSON.stringify(data));
    }
}

export default WebSocketInstance;