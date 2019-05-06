import config from '../config';
import functions from '../functions';
const { notification } = functions;

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
        body: form,
      })
        .then(response => {
            return response.json();
        })
        .then(data => {
          const { message, status } = data;

           if (status  === 'ok') {
             notification.success({
               title: 'Success',
               text: 'Saved!'
             })
           } else if (status  === 'error'){
             notification.error({
               title: 'Error',
               text: "Saving error"
             })
           }
            resolve(message);
        })
        .catch(error => {
          notification.error({
            title: 'Error',
            text: error
          })
            reject(error)
        })
  })
}

function getAllRemote(params) {
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

function signIn(data) {
  const {
    login,
    password,
  } = config

  return new Promise((resolve, reject) => {
    if (data.password === password && data.login === login) {
      return resolve();
    } else {
      return reject('Password or login is not correct!');
    }
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
      body: form,
    })
      .then(response => {
        return response.json();
      })
      .then((data) => {
        const { status } = data;

        if (status  === 'ok') {
          notification.success({
            title: 'Success',
            text: 'Added!'
          })
        } else {
          notification.error({
            title: 'Error',
            text: 'Adding task error'
          })
        }
        resolve();
      })
      .catch(error => {
        notification.error({
          title: 'Error',
          text: 'Adding task error'
        })
        reject(error)
      })
  })
}

export default {
  editRemote,
  getAllRemote,
  signIn,
  addTaskRemote
}
