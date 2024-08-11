export default function view(path, value) {
  const input = document.querySelector('#url-input');
  const feedback = document.querySelector('.feedback');

  /* const render = (watchedState, i18n) => {

  }; */

  switch (path) {
    case 'form.status':
      if (value === 'invalid') {
        input.classList.add('is-invalid');
      } else {
        input.classList.remove('is-invalid');
      }
      break;
    case 'form.errors':
      feedback.textContent = value;
      break;
    default:
      throw new Error('error view');
  }
}
