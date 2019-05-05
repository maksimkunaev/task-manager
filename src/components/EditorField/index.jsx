import React, { Component } from 'react';
import styles from './EditorField.styl';
import { bind } from 'decko';
import cn from 'classnames';
import { Select } from 'antd';
import functions from '../../functions';

const Option = Select.Option;
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
    onChangeStatus(field) {
        const status = field === 'new' ? 0 : 10;
        this.setState({
            status: status,
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
        const { inValid, status } = this.state;
        const  defaultStatus = status === 10 ? 'completed' : 'new'

        return (
          <div className={styles.editor}>
              <form className={styles.fields}>
                  <input
                    className={cn(styles.field, inValid.email && styles.invalid)}
                    type="email"
                    value={this.state.email}
                    placeholder={'email'}
                    onChange={this.onChange.bind(this, 'email')}/>
                  <input
                    className={cn(styles.field, inValid.username && styles.invalid)}
                    type="text"
                    value={this.state.username}
                    placeholder={'username'}
                    onChange={this.onChange.bind(this, 'username')}/>
                  <input
                    className={cn(styles.field, inValid.text && styles.invalid)}
                    type="text"
                    value={this.state.text}
                    placeholder={'text'}
                    onChange={this.onChange.bind(this, 'text')}/>

                  <Select
                    className={cn(styles.field, inValid.status && styles.invalid)}
                    showSearch
                    style={{ width: 200 }}
                    placeholder="status"
                    defaultValue={defaultStatus}
                    optionFilterProp="children"
                    onChange={this.onChangeStatus}
                  >
                      <Option value="new">New</Option>
                      <Option value="completed">Completed</Option>
                  </Select>
              </form>
              <button type="submit" className={cn(styles.button, styles.field)} onClick={this.addTask}>{mode === 'add' ? 'Add' : 'Save'}</button>
          </div>
        )
    }
}

export default EditorField;