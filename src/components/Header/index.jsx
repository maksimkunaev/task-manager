import React, { Component } from 'react';
import './Header.styl';
import { bind } from 'decko';
import functions from '../../functions';
const { notification } = functions;

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: '',
            login: '',
            password: '',
            isFormAuthVisible: false,
        }
    }

    @bind
    onLoginClick() {
        this.setState({
            isFormAuthVisible: !this.state.isFormAuthVisible,
        })
    }

    @bind
    onSignIn(e) {
        e.preventDefault();


        const {
                login,
                password,
        } = this.state;

        if (!login || !password) {
            notification.error({
                title: 'Error',
                text: 'Login or password is empty!'
            })
            return;
        }

        const data = {
            login,
            password,
        }

        this.props.signIn(data);

    }

    @bind
    renderFormAuth() {
        this.login && this.login.focus()
        return (
          <form className="authForm">
              <input
                autoFocus="true"
                className="field"
                type="text"
                value={this.state.login}
                placeholder={'login'}
                onChange={this.onChange.bind(this, 'login')}/>

              <input
                className="field"
                type="text"
                value={this.state.password}
                placeholder={'password'}
                onChange={this.onChange.bind(this, 'password')}/>
              <button type="submit" className="field button" onClick={this.onSignIn}>Sign In</button>
          </form>
        )
    }

    @bind
    onChange(field, e) {

        this.setState({
            inValid: {
                [`${field}`]: false
            }
        })

        this.props.changeInputData();
        this.setState({
            [`${field}`]: e.target.value,
        })
    }

    render() {
        const { error } = this.props;

        const { isFormAuthVisible } = this.state;
        const { isAdmin } = this.props;
        if (error) {
            notification.error({
                title: 'Error',
                text: error
            })
        }
        
        return (
          <div className="header">
              <h1 className="title">Task Manager</h1>

              <button type="submit" className="button field login" onClick={this.onLoginClick}>{isAdmin ? 'Admin' : 'Login'}</button>

              {isFormAuthVisible && !isAdmin &&  this.renderFormAuth()}
          </div>
        )
    }
}

export default Header;