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
            axios.get('http://127.0.0.1:8000/api/users')
                .then(response => {
                    this.setState({
                        'users': response.data.filter(user => user.username !== this.props.username)
                    });
                })
                .catch(error => {
                    console.log(error);
                })
        }
    }

    render() {

        let listUsers = ' ';
        if (this.state.users !== undefined) {
            listUsers = this.state.users.map(user => 
                <Menu.Item key={user.id}>{user.username}</Menu.Item>
            );
        }

        return (
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                {listUsers}
            </Menu>
        )
    }
}

export default SidePanel;