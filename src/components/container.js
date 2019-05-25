import React from 'react';
import {connect} from 'react-redux';

import api from '../api';
const {
  getAllRemote,
} = api;

const mapStateToProps = state => ({
    tasks: state.tasks,
    loadingStatus: state.loadingStatus,
    isAdmin: state.isAdmin,
    total:state.total,
})

const mapDispatchToProps = dispatch => ({
  getAllTasks: (query) => {
    getAllRemote(query)
      .then(data => onSuccess(data, dispatch))
      .catch(error => onError(error, dispatch))
  },
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
