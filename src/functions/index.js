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

const notification = {
  content: function(mode, config) {
    const mainColor = mode === 'success' ? '#3ec500b3' : mode === 'error' ? 'red' : '#ccc';
    const {
      delay,
      title,
      text,
    } = config;
    const wrap = document.createElement('div');
    const titleElem = document.createElement('div');
    const descriptionText = document.createElement('div');
    titleElem.textContent = title ? title : mode;
    titleElem.style.color = mainColor;
    descriptionText.textContent = text;

    wrap.appendChild(titleElem);
    wrap.appendChild(descriptionText);

    wrap.style =
                 `position: fixed; 
                  top: 5px; right: 5px;
                  border-radius: 3px; 
                  background: #fff;
                  transition: all 500ms ease 0s;
                  color: #000000cf;
                  padding: 5px 15px;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.15);`

    document.body.appendChild(wrap);
    setTimeout(() => {
      wrap.style.opacity = '0';
    }, delay || 3000);

    setTimeout(() => {
      document.body.removeChild(wrap)
    }, (delay || 3000) + 300)

    return wrap;
  },
  success: function(config) {
    this.content('success', config)
  },
  error: function(config) {
    this.content('error', config)
  }
}

function windowSize () {
  const { innerWidth  } = window;
  return innerWidth > 778
    ? 'D'
    : ( innerWidth > 592 && innerWidth <= 778 )
      ? 'T'
      : innerWidth <= 592
      ? 'M' : 'D';
}
export default {
  generateToken,
  validateEmail,
  notification,
  windowSize,
}