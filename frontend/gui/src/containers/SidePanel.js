import React, { Component } from 'react';
import axios from 'axios';
import { Menu } from 'antd';

class SidePanel extends Component {

    constructor(props) {
        super(props);
        this.state = {}
        this.grabFromAPI = this.grabFromAPI.bind(this);
    }

    componentDidMount() {
        this.grabFromAPI();
    }

    grabFromAPI() {
        if (this.props.token) {
            axios.get('/api/chat/', {
                headers: {
                    Authorization: `Token ${this.props.token}`
                }
            })
                .then(response => {
                    this.setState({
                        // 'contact': response.data.filter(user => user.user.username === this.props.username)[0]
                        'chats': response.data.filter(chat => chat.participants_usernames.includes('wegman7'))
                    });
                })
                .catch(error => {
                    console.log(error);
                })
        }
    }

    render() {

        let listChats = ' ';
        if (this.state.chats !== undefined) {
            listChats = this.state.chats.map(chat => 
                <Menu.Item key={chat.id} onClick={() => this.props.initializeChat(chat.id)}>
                    {chat.participants_usernames.filter(
                        participant_username => (participant_username !== this.props.username))
                        .map(
                            username => <span>{username} </span>
                        )}
                </Menu.Item>
            );
        }

        return (
            <div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                    {listChats}
                </Menu>
            </div>
        )
    }
}

export default SidePanel;