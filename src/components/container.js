import React from 'react';
import {connect} from 'react-redux';
import functions from '../functions';
const { generateToken, notification } = functions;

import api from '../api';
const {
  editRemote,
  getAllRemote,
  signIn,
  addTaskRemote
} = api;

const mapStateToProps = state => ({
    tasks: state.tasks,
    loadingStatus: state.loadingStatus,
    isAdmin: state.isAdmin,
    total:state.total,
})

const mapDispatchToProps = dispatch => ({
  addTask: (data) => {
    const task = {
     ...data,
     id: Date.now() + Math.round(Math.random() * 1000),
    }

    const options = {
        type: 'create',
        data: task,
    };

    dispatch({
    type: 'loading',
    loadingStatus: 'fetching',
    })

    addTaskRemote(options.data)
     .then(getAllRemote)
      .then(data => {
        onSuccess(data, dispatch)
      })
      .catch(error => {
        onError(error, dispatch)
      })
  },
  editTask: (id, data) => {
    const signature = generateToken(id, data);
    editRemote(id, data, signature)
      .then(getAllRemote)
      .then(data => onSuccess(data, dispatch))
      .catch(error => onError(error, dispatch))
    },
  getAllTasks: (query) => {
    getAllRemote(query)
      .then(data => onSuccess(data, dispatch))
      .catch(error => onError(error, dispatch))
  },
  signIn: data => {
    signIn(data)
      .then(() => {
          dispatch({
              type: 'signIn',
          })
          notification.success({
            title: 'Success',
            text: 'Logged in!'
          })
        })
      .catch(error => {
        notification.error({
          title: 'Error',
          text: error
        })
      })

    }
})

function onSuccess(data, dispatch) {
  const { tasks, total_task_count } = data;
  dispatch({
    type: 'updateAll',
    list: tasks || [],
  })

  dispatch({
    type: 'updateTotal',
    total: total_task_count
  })

  dispatch({
    type: 'loading',
    loadingStatus: 'success',
  })
}

function onError(error, dispatch) {
  dispatch({
    type: 'loading',
    loadingStatus: 'error',
  })
}

export default component => connect(mapStateToProps, mapDispatchToProps)(component);
