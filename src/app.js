import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import view from './view.js';
import resources from './locales/resources.js';

export default function app() {
  // состояние Model
  const state = {
    form: {
      status: 'valid',
      errors: null,
    },
    feeds: [],
    posts: [],
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
  };

  const defaultLang = 'ru';
  const i18n = i18next.createInstance();
  i18n.init({
    debug: false,
    lng: defaultLang,
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

  // слой отображения View, render функция, которая принимает состояние.
  // реализовать во view.js. Вынести валидацию и i18next?
  // здесь хранятся все html элементы, которые мы отрисовываем. Для фидов и постов.
  const validate = (field, feeds) => {
    const schema = yup.object({
      url: yup.string().required().url().notOneOf(feeds),
    });
    return schema.validate(field);
  };

  const watchedState = onChange(state, (path, value) => {
    view(path, value);
  });

  // Controller
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const link = formData.get('url');

    validate({ url: link }, state.feeds)
      .then(() => {
        console.log('good');
        watchedState.feeds.push(link);
        elements.input.focus();
        elements.form.reset();
      })
      .catch((err) => {
        console.log('bad');
        console.log(err.message);
        watchedState.form.status = 'invalid';
        watchedState.form.errors = err.message;
      });
  });
}
