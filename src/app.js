import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import view from './view.js';
import resources from './locales/resources.js';

export default function app() {
  const state = {
    form: {
      status: null,
      validUrl: false,
      errors: null,
    },
    fids: [],
  };

  const defaultLang = 'ru';
  const i18n = i18next.createInstance();
  i18n.init({
    debug: false,
    lng: defaultLang,
    resources,
  });

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    errorFields: {},
  };

  yup.setLocale({
    mixed: {
      required: i18n.t('errors.required'),
      notOneOf: i18n.t('errors.exists'),
    },
    string: {
      url: i18n.t('errors.invalidUrl'),
    },
  });

  function validate(fields, fids) {
    const schema = yup.object({
      url: yup.string().required().url().notOneOf(fids),
    });
    return schema.validate(fields);
  }

  const watchedState = onChange(state, (path, value) => {
    view(path, value);
  });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const link = formData.get('url');

    validate({ url: link }, state.fids)
      .then(() => {
        console.log('good');
        watchedState.fids.push(link);
        watchedState.form.validUrl = false;
        watchedState.form.errors = null;
        elements.input.focus();
        elements.form.reset();
      })
      .catch((err) => {
        console.log('bad');
        console.log(err.message);
        watchedState.form.validUrl = true;
        watchedState.form.errors = err.message;
      });
  });
}
