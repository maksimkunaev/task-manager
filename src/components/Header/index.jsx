import React, { Component } from 'react';
import styles from './Header.styl';
import { bind } from 'decko';
import cn from 'classnames';
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

        const data = {
            login,
            password,
        }

        this.props.signIn(data);
    }

    @bind
    renderFormAuth() {
        this.login && this.login.focus();

        return (
          <form className={styles.authForm}>
              <input
                autoFocus={true}
                className={styles.field}
                type="text"
                value={this.state.login}
                placeholder={'login'}
                onChange={this.onChange.bind(this, 'login')}/>

              <input
                className={styles.field}
                type="text"
                value={this.state.password}
                placeholder={'password'}
                onChange={this.onChange.bind(this, 'password')}/>
              <button type="submit" className={cn(styles.field, styles.button)} onClick={this.onSignIn}>Sign In</button>
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

        this.setState({
            [`${field}`]: e.target.value,
        })
    }

    render() {
        const { isFormAuthVisible } = this.state;
        const { isAdmin } = this.props;

        return (
          <div className={styles.header}>
              <h1 className={styles.title}>Task Manager</h1>

              <button type="submit" className={cn(styles.button, styles.field, styles.login)} onClick={this.onLoginClick}>{isAdmin ? 'Admin' : 'Login'}</button>

              {isFormAuthVisible && !isAdmin &&  this.renderFormAuth()}
          </div>
        )
    }
}

export default Header;