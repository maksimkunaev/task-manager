import React from 'react';
import {connect} from 'react-redux';
import config from '../config';

const mapStateToProps = state => ({
    tasks: state.tasks,
    loadingStatus: state.loadingStatus,
    isAdmin: state.isAdmin,
    total:state.total,
})

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
        // const { message } = data;
        // resolve(message);
      })
      .catch(error => {
        // reject(error)
        console.log(`error`, error)

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
       addTaskRemote(options.data);
       // dispatch(options)
       getAllRemote()
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
        // editRemote(id)
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
