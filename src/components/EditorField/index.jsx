import React, { Component } from 'react';
import './EditorField.styl';
import { bind } from 'decko';
import cn from 'classnames';
import functions from '../../functions';
const { validateEmail } = functions;

class EditorField extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            email: "",
            text: "",
            status: 0,
            inValid: {
                username: false,
                email: false,
                text: false,
            },
        }
    }

    componentWillMount () {
        if (this.props.mode === 'edit') {
            this.setInitState();
        }
    }

    @bind
    setInitState() {
        const { currentTaskId } = this.props;
        const tasks = [ ...this.props.tasks ]
        const currentTaskData = tasks.find(task => task.id === currentTaskId);
        this.setState(currentTaskData)
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

    @bind
    addTask(e) {
        e.preventDefault();

        const { username, email, text, status } = this.state;

        let inValidEmail = false;
        if (!validateEmail(email)) {
            inValidEmail = true;
        }

        if (!username || !text || inValidEmail) {
            this.setState({
                inValid: {
                    email: inValidEmail,
                    username: !username,
                    text: !text,
                }
            })
            return;
        }

        this.props.onChange({
              username,
              email,
              text,
              status
          }
        )

        this.setState({
            username: "",
            email: "",
            text: "",
            status: 0,
        })
    }

    render() {
        const { mode } = this.props;
        const { inValid } = this.state;

        return (
          <div className="editor">
              <form className="fields">
                  <input
                    className={cn('field', inValid.email && 'invalid')}
                    type="email"
                    value={this.state.email}
                    placeholder={'email'}
                    onChange={this.onChange.bind(this, 'email')}/>
                  <input
                    className={cn('field', inValid.username && 'invalid')}
                    type="text"
                    value={this.state.username}
                    placeholder={'username'}
                    onChange={this.onChange.bind(this, 'username')}/>
                  <input
                    className={cn('field', inValid.text && 'invalid')}
                    type="text"
                    value={this.state.text}
                    placeholder={'text'}
                    onChange={this.onChange.bind(this, 'text')}/>
                  <input
                    className={cn('field', inValid.status && 'invalid')}
                    type="number"
                    min={0}
                    step={10}
                    max={10}
                    value={this.state.status}
                    placeholder={'status'}
                    onChange={this.onChange.bind(this, 'status')}/>

              </form>
              <button type="submit" className="button field" onClick={this.addTask}>{mode === 'add' ? 'Add' : 'Save'}</button>
              {/*<div className="field status" style={{visibility: 'visible'}}>Success!</div>*/}
          </div>
        )
    }
}

export default EditorField;