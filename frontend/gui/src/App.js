import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { connect } from 'react-redux';
import { Layout } from 'antd';

import BaseRouter from './routes';
import * as actions from './store/actions/auth';
import Chat from './containers/Chat';
import Navbar from './components/Navbar';
import SidePanel from './containers/SidePanel';
import WebSocketInstance from './websocket';

import 'antd/dist/antd.css';
import './App.css';

const { Header, Content, Sider, Footer } = Layout;

class App extends Component {

  state = {};

  componentDidMount() {
    console.log('inside componentDidMount (App.js)')
    this.props.onTryAutoSignup();
    this.setState({ renderChat: false })
  }

  componentDidUpdate() {
    console.log('inside componentDidUpdate (App.js)')
  }

  initializeChat = (chat_id) => {
    let socket = new WebSocketInstance(chat_id);
    this.setState({
      'socket': socket,
      'renderChat': true
    });
  }

  render() {

    return (
      <div>
        <Router>
          <Layout className="layout">
            <Header>
              <Navbar {...this.props} />
            </Header>
            <Layout>
              {
                this.props.isAuthenticated
                ?
                <Sider>
                  <SidePanel {...this.props} initializeChat={this.initializeChat}/>
                </Sider>
                :
                <div></div>
              }
              <Content style={{ padding: '30px 30px' }}>
                <div className="site-layout-content">
                  <BaseRouter />
                </div>
              </Content>
            </Layout>
            <Footer>footer</Footer>
          </Layout>
          {
            this.state.renderChat
            ?
            <Chat {...this.props} socket={this.state.socket} />
            :
            <div></div>
          }
        </Router>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    token: state.token,
    isAuthenticated: state.token !== null,
    username: state.username
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
    logout: () => dispatch(actions.logout())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);