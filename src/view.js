export default function view(path, value) {
  const input = document.querySelector('#url-input');
  const feedback = document.querySelector('.feedback');

  switch (path) {
    case 'form.validUrl':
      if (value) {
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
