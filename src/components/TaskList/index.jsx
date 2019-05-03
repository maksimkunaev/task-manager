import React, { Component } from 'react';
import './TaskList.styl';
import { bind } from 'decko';
import Table from "../Table";

class TaskList extends Component {
    @bind
    columns() {
        return [
            {
                key: 'email',
                title:  'Email',
                width: 100,
            },
            {
                key: 'username',
                title:  'Name',
                width: 100,
            },
            {
                key: 'text',
                width: 100,
                title:  'Description',
            },
            {
                key: 'status',
                width: 50,
                title: 'Status',
                render: data => {
                    return data.status === 0 ?
                      <div style={{color: 'red'}}>new</div>
                        : data.status === 10 ?  <div style={{color: 'green'}}>completed</div> : <div style={{color: 'red'}}>new</div>
                      }
            },
        ];
    }

    render() {
        const {tasks, loadingStatus} = this.props;

        const columns = this.columns();

        return (
            <main className='tasks'>
                {loadingStatus === 'success' && !tasks.length && <div className='tasks__nodata'>Add Some Task</div>}
                {loadingStatus === 'fetching' && <div className='tasks__nodata'>Loading...</div>}
                {loadingStatus === 'error' && <div className='tasks__nodata'>Error fetching data.</div>}

                <Table { ...this.props} columns={columns} data={tasks}/>
            </main>
        )
    }
}

export default TaskList;
