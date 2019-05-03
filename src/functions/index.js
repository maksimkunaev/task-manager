import config from '../config';
import md5 from "crypto-js/md5";

function generateToken(id, params) {
  const { editableFields, token } = config;
  let query = ``;

  let newParams = { ...params, token };

  let queryFields = editableFields;
  queryFields = queryFields.sort();
  queryFields = queryFields.concat('token');

  function fixedEncodeURIComponent (str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
      return '%' + c.charCodeAt(0).toString(16);
    });
  }

  let newResult = {};
  queryFields.map(field => {

    const key = fixedEncodeURIComponent(field);
    const value = fixedEncodeURIComponent(newParams[field]);
    newResult[key] = value;

    query = `${query}&${key}=${value}`

  })

  query = query.slice(1)
  return md5(query).toString();
}

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function isNotEmpty(value) {
  return value;
}

export default {
  generateToken,
  validateEmail,
  isNotEmpty,
}