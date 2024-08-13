import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
// import axios from 'axios';
// import parseRss from './parserRSS.js';
import view from './view.js';
import resources from './locales/resources.js';

export default function app() {
  // состояние Model
  const state = {
    form: {
      valid: null,
      status: '', // 'success', 'failed', ''
      errors: null,
    },
    feeds: {
      links: [],
      ids: [],
    },
    posts: [],
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    modal: document.querySelector('modal-footer'),
  };

  const i18n = i18next.createInstance();
  i18n.init({
    debug: false,
    lng: 'ru',
    resources,
  });
  yup.setLocale({
    mixed: {
      required: i18n.t('errors.required'),
      notOneOf: i18n.t('errors.exists'),
    },
    string: {
      url: i18n.t('errors.invalid'),
    },
  });

  const validate = (field, links) => {
    const schema = yup.object().shape({
      url: yup.string().required().url().notOneOf(links),
    });
    return schema.validate(field);
  };

  const watchedState = onChange(state, (path, value) => view(watchedState, path, value, i18n));

  /* const fetchRss = (url) => {
    const promise = new Promise((resolve, reject) => {
      axios
        .get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error('Ошибка при запросе:', error);
          reject(error);
        });
    });
    return promise;
  }; */

  // Controller
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const link = formData.get('url');

    validate({ url: link }, watchedState.feeds.links)
      .then(() => {
        console.log('good');
        watchedState.form.valid = true;
        watchedState.feeds.links.push(link);
        elements.input.focus();
        elements.form.reset();
      })
      .catch((err) => {
        console.log('bad');
        watchedState.form.valid = false;
        watchedState.form.errors = err.message;
      });
  });
}
