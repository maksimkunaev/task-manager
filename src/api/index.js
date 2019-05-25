import config from '../config';

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

export default {
  getAllRemote,
}
