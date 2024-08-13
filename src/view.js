// слой отображения View, render функция, которая принимает состояние.
// реализовать во view.js. Вынести валидацию и i18next?
// здесь хранятся все html элементы, которые мы отрисовываем. Для фидов и постов.

const input = document.querySelector('#url-input');
const feedback = document.querySelector('.feedback');

export default function view(watchedState, path, value, i18n) {
  switch (path) {
    case 'form.valid':
      if (!value) {
        input.classList.add('is-invalid');
        feedback.classList.add('text-danger');
      } else {
        input.classList.remove('is-invalid');
        feedback.classList.remove('text-danger');
        feedback.classList.add('text-success');
        feedback.textContent = i18n.t('success');
      }
      break;
    case 'form.errors':
      feedback.textContent = value;
      break;
    case 'feeds.links':
      break;
    default:
      console.log('default value');
  }
}
