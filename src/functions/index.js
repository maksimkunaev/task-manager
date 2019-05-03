import config from '../config';
import md5 from "crypto-js/md5";

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

export default {
  generateToken
}