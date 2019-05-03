import React from 'react';
import {connect} from 'react-redux';
import config from '../config';
import functions from '../functions';
const { generateToken } = functions;

const mapStateToProps = state => ({
    tasks: state.tasks,
    loadingStatus: state.loadingStatus,
    isAdmin: state.isAdmin,
    total:state.total,
})

function editRemote(id, params, signature) {
  const { baseUrl, developer, token } = config;
  let query = `?developer=${developer}`;

  const { text, status} = params;
  const form = new FormData();
  form.append("text", text);
  form.append("status", status);
  form.append("token", token);
  form.append("signature", signature);

  return new Promise((resolve, reject) => {
      fetch(`${baseUrl}/edit/${id}${query}`, {
        method: 'POST',
        crossDomain: true,
        mimeType: "multipart/form-data",
        contentType: false,
        processData: false,
        body: form,
        dataType: "json",
      })
        .then(response => {
            return response.json();
        })
        .then(data => {
            const { message } = data;
            resolve(message);
          console.log(data.message)

        })
        .catch(error => {
            reject(error)
          console.log(error.message)
        })
  })
}

function getAllRemote (params) {
  const { baseUrl, developer } = config;
  let query = `?developer=${developer}`;

  for (let key in params) {

    if (params.hasOwnProperty(key) && params[key]) {
      query = `${query}&${key}=${params[key]}`
    }
  }

  return new Promise((resolve, reject) => {
    fetch(`${baseUrl}/${query}`)
      .then(response => {
        return response.json();
      })
      .then(data => {
        const { message } = data;
        resolve(message);
      })
      .catch(error => {
        reject(error)
      })
  })
}

function addTaskRemote(options) {
  const { baseUrl, developer } = config;

  const query = `?developer=${developer}`;

  const { username, email, text } = options;
  const form = new FormData();
  form.append("username", username);
  form.append("email", email);
  form.append("text", text);

  return new Promise((resolve, reject) => {
    fetch(`${baseUrl}/create${query}`, {
      method: 'POST',
      crossDomain: true,
      mimeType: "multipart/form-data",
      contentType: false,
      processData: false,
      body: form,
      dataType: "json",
    })
      .then(response => {
        return response.json();
      })
      .then(() => {
        resolve();
      })
      .catch(error => {
        console.log(`error`, error)
        reject(error)
      })

  })
}

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
      .then(data => onSuccess(data, dispatch))
      .catch(error => onError(error, dispatch))
  },
  editTask: (id, data) => {
    const signature = generateToken(id, data);

    editRemote(id, data, signature)
      .then(getAllRemote)
      .then(data => onSuccess(data, dispatch))
      .then(data => onSuccess(data, dispatch))
      .catch(error => onError(error, dispatch))
    },
  getAllTasks: (query) => {
    getAllRemote(query)
      .then(data => onSuccess(data, dispatch))
      .catch(error => onError(error, dispatch))
  },
  signIn: data => {
        dispatch({
            type: 'signIn',
            data,
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
