import React, { Component } from 'react';
import './TaskList.styl';
import { bind } from 'decko';
import EditorField from "../EditorField";
import cn from 'classnames'
class TaskList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isEdit: false,
            editTaskId: null,
            currentPage: 1,
            taskPerPage: 3,
        }
    }

    componentWillMount () {
        console.log(`this.props`, this.props)
    }

    @bind
    onTaskClick(editTaskId){
        this.setState({
            isEdit: true,
            editTaskId,
        })
    }

    @bind
    editTask(id, data) {
        this.props.editTask(id, data);

        this.setState({
            isEdit: false,
            editTaskId: null,
        })
    }

    @bind
    renderTask(data){
        const { email, username, text, status, id} = data;
        const { isEdit, editTaskId} = this.state;
        const { isAdmin } = this.props;
        const isCurrentTaskEditable = isEdit && editTaskId === id;

        if (isCurrentTaskEditable) {
            return <li className="block_wrap" key={id}>
                <div className="block">
                    <EditorField {...this.props} onChange={this.editTask.bind(this, id)} mode='edit' currentTaskId={id}/>
                </div>
            </li>
        }

        return (
          <li className="block_wrap" key={id}>
              <div className="block">
                  <div className="blockItems">
                      <div className="blockItem">{email}</div>
                      <div className="blockItem">{username}</div>
                      <div className="blockItem">{text}</div>
                      <div className="blockItem">{status}</div>
                  </div>
                  {isAdmin && <button className="button" onClick={this.onTaskClick.bind(this, id)}>edit</button>}
              </div>

          </li>
        )
    }

    @bind
    goToPage(i) {
        this.setState({ currentPage: i});
        this.props.getAllTasks({
            sort_field: 'id',
            sort_direction: 'asc',
            page: i,
        })
    }

    @bind
    renderPagination() {
        const { currentPage, taskPerPage } = this.state;

        const { total } = this.props;
        const pages = Math.ceil(Number(total)/taskPerPage);
        const delta = 1;
        const left = currentPage - delta;
        const right = currentPage + delta + 1;
        const range = [];
        const rangeWithDots = [];

        let l;

        for (let i = 1; i <= pages; i++) {
            if (i === 1 || i === pages || i >= left && i < right) {
                range.push(i);
            }
        }


        const button = (index, style) => {
            return index ? <div className={style} key={index} onClick={this.goToPage.bind(this, index)}>{index}</div> :
              <div className={cn(style, 'navigation_button_dots')} key={index} >...</div>
        }
        for (let i of range) {
            const classes = cn({
                navigation_button: true,
                navigation_button_active: currentPage === i
            });

            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(button(l + 1, classes));
                } else if (i - l !== 1) {
                    rangeWithDots.push(button(null, classes));
                }
            }

            rangeWithDots.push(button(i, classes));
            l = i;
        }

        return rangeWithDots;
    }

    render() {
        const {tasks, loadingStatus} = this.props;
console.log(`loadingStatus`,loadingStatus)
        return (
            <main className='tasks'>
                {loadingStatus === 'success' && !tasks.length && <div className='tasks__nodata'>Add Some Task</div>}
                {loadingStatus === 'fetching' && <div className='tasks__nodata'>Loading...</div>}
                {loadingStatus === 'error' && <div className='tasks__nodata'>Error fetching data.</div>}

                <ul className="tasks__list">
                    {tasks.map(taskData => {
                        return this.renderTask(taskData)
                    })}
                </ul>

                {tasks.length > 0 && <div className="block__pagination">
                    {this.renderPagination()}
                </div>
                }

            </main>
        )
    }
}

export default TaskList;
