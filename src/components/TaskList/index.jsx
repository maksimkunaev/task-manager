import React, { Component } from 'react';
import styles from './TaskList.styl';
import { bind } from 'decko';
import Table from "../Table";
import functions from '../../functions';
const { windowSize } = functions;

class TaskList extends Component {
    @bind
    columns() {
        const size = windowSize();
        const isMobile = size === 'M';

        return [
            {
                key: 'email',
                title:  'Email',
                width: isMobile ? 100 : 200,
            },
            {
                key: 'username',
                title:  'Name',
                width: isMobile ? 100 : 200,
            },
            {
                key: 'text',
                width: isMobile ? 100 : 200,
                title:  'Description',
            },
            {
                key: 'status',
                width: isMobile ? 50 : 150,
                title: 'Status',
                render: data => {
                    return data.status === 0 ?
                      <div style={{color: 'red'}}>New</div>
                        : data.status === 10 ?  <div style={{color: 'green'}}>Completed</div> : <div style={{color: 'red'}}>New</div>
                      }
            },
        ];
    }

    render() {
        const {tasks, loadingStatus} = this.props;
        const columns = this.columns();

        return (
            <main className={styles.tasks}>
                {loadingStatus === 'success' && !tasks.length && <div className={styles.tasks__nodata}>Add Some Task</div>}
                {loadingStatus === 'fetching' && <div className={styles.tasks__nodata}>Loading...</div>}
                {loadingStatus === 'error' && <div className={styles.tasks__nodata}>Error fetching data.</div>}

                <Table { ...this.props} columns={columns} data={tasks}/>
            </main>
        )
    }
}

export default TaskList;
