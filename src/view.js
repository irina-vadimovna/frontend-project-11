import onChange from 'on-change';
import render from './render.js';

export default (elements, i18n, state) => {
  const { input, message, submitBtn } = elements;

  const [postsTr, feedsTr, viewButton] = [i18n.t('posts'), i18n.t('feeds'), i18n.t('viewButton')];
  return onChange(state, () => {
    const {
      form: { error, field, status },
    } = state;
    const invalidMessage = () => {
      message.classList.remove('text-success');
      message.classList.add('text-danger');
      input.classList.add('is-invalid');
      message.textContent = i18n.t(`errors.${error}`);
    };
    submitBtn.disabled = false;
    if (status === 'fail') {
      invalidMessage();
    }
    if (status === 'loading Rss') {
      input.classList.remove('is-invalid');
      message.textContent = '';
      submitBtn.disabled = true;
    }
    if (status === 'success') {
      render(state, [postsTr, feedsTr, viewButton]);

      message.classList.add('text-success');
      message.classList.remove('text-danger');
      input.classList.remove('is-invalid');
      message.textContent = i18n.t('success');
    }
    input.value = field.input;
  });
};
