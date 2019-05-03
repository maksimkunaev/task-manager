import React, { Component } from 'react';
import './EditorField.styl';
import { bind } from 'decko';
import cn from 'classnames';
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validate() {
    var $result = $("#result");
    var email = $("#email").val();
    $result.text("");

    if (validateEmail(email)) {
        $result.text(email + " is valid :)");
        $result.css("color", "green");
    } else {
        $result.text(email + " is not valid :(");
        $result.css("color", "red");
    }
    return false;
}
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
            console.log(`email`)

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
                    step={1}
                    max={10}
                    value={this.state.status}
                    placeholder={'status'}
                    onChange={this.onChange.bind(this, 'status')}/>

              </form>
              <button type="submit" className="button field" onClick={this.addTask}>{mode === 'add' ? 'Add' : 'Save'}</button>
          </div>
        )
    }
}

export default EditorField;