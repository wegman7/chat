import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { connect } from 'react-redux';
import { Layout } from 'antd';

import BaseRouter from './routes';
import * as actions from './store/actions/auth';
import Chat from './containers/Chat';
import WebSocketInstance from './websocket';
import Navbar from './components/Navbar';
import SidePanel from './containers/SidePanel';

import 'antd/dist/antd.css';
import './App.css';

const { Header, Content, Sider, Footer } = Layout;

class App extends Component {

  componentDidMount() {
    console.log('inside componentDidMount (App.js)')
    WebSocketInstance.connect();
    this.props.onTryAutoSignup();
  }

  componentDidUpdate() {
    console.log('inside componentDidUpdate (App.js)')
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
                  <SidePanel {...this.props}/>
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
            this.props.isAuthenticated
            ?
            <Chat {...this.props} />
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