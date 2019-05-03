import React from 'react';
import {connect} from 'react-redux';
import config from '../config';
import md5 from "crypto-js/md5";

const mapStateToProps = state => ({
    tasks: state.tasks,
    loadingStatus: state.loadingStatus,
    isAdmin: state.isAdmin,
    total:state.total,
})


function generateToken(id, params) {
  const { editableFields, token } = config;
  let query = ``;

  let newParams = { ...params, token };

  let queryFields = editableFields;
  queryFields = queryFields.sort();
  queryFields = queryFields.concat('token');

  queryFields.map(field => {
    query = `${query}&${encodeURIComponent(field)}=${encodeURIComponent(newParams[field])}`
  })

  query = query.slice(1)
  return md5(query).toString();
}

function editRemote (id, params, signature) {
  const { baseUrl, developer } = config;
  let query = `?developer=${developer}`;

  const { text, status, username, email} = params;
  const form = new FormData();
  // form.append("email", email);
  // form.append("username", username);
  form.append("text", text);
  form.append("status", status);
  form.append("token", 'beejee');
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
      .then(data => {
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
         .then(data => {
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
         })
         .catch(() => {
           dispatch({
             type: 'loading',
             loadingStatus: 'error',
           })
         })
      },
    editTask: (id, data) => {
      const signature = generateToken(id, data);

      editRemote(id, data, signature)
        dispatch({
            type: 'edit',
            id: id,
            data,
        })
    },
      getAllTasks: (query) => {
        getAllRemote(query)
          .then(data => {
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
          })
          .catch(() => {
            dispatch({
                type: 'loading',
                loadingStatus: 'error',
              })
          })
      },
    signIn: data => {
        dispatch({
            type: 'signIn',
            data,
        })
    }
})

export default component => connect(mapStateToProps, mapDispatchToProps)(component);
