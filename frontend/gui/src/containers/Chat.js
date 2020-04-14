import React, { Component } from 'react';
import { Widget, addResponseMessage, addUserMessage } from 'react-chat-widget';
import WebSocketInstance from '../websocket';

import 'react-chat-widget/lib/styles.css';

class Chat extends Component {

    constructor(props) {
        super(props)
        this.state = {}

        this.waitForSocketConnection(() => {
            WebSocketInstance.addCallbacks(
                this.setMessages.bind(this),
                this.addMessage.bind(this),
            )
            WebSocketInstance.fetchMessages(this.props.currentUser);
        });
        this.sendMessageHandler = this.sendMessageHandler.bind(this);
    }

    waitForSocketConnection(callback) {
        const component = this;
        setTimeout(
            function() {
                if (WebSocketInstance.state() === 1) {
                    console.log('connection is secure');
                    callback();
                    return;
                } else {
                    console.log('waiting for connection');
                    component.waitForSocketConnection(callback);
                }
        }, 100);
    }

    addMessage(message) {
        this.setState({
            messages: [...this.state.messages, message]
        });
    }

    setMessages(messages) {
        this.setState({ messages: messages.reverse() });
    }

    renderMessages = (messages) => {
        const currentUser = this.props.username;
        if (messages === undefined) { return; }
        for (let i = 0; i < messages.length; i++) {
            if (currentUser === messages[i]['author']) {
                addUserMessage(messages[i]['content']);
            } else {
                addResponseMessage(messages[i]['content']);
            }
        }
    }

    sendMessageHandler(message_text) {
        const author = this.props.username;
        const messageObject = {
            from: author,
            content: message_text
        }
        WebSocketInstance.newChatMessage(messageObject);
    }

    handleNewUserMessage = (newMessage) => {
        console.log(`New message incoming! ${newMessage}`);
        this.sendMessageHandler(newMessage);
        // Now send the message throught the backend API
    }

    i = 0;
    
    render() {
        // i have to put this.i in here or else it will load all the messages every time a new message is added
        this.i++;
        console.log(this.i);
        if (this.i < 3) {
            const messages = this.state.messages;
            this.renderMessages(messages);
        }

        return (
            <div className="App">
                <Widget
                    handleNewUserMessage={this.handleNewUserMessage}
                />
            </div>
        );
    }
}

export default Chat;