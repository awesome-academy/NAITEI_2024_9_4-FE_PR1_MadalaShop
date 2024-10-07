const validationSetUp = {
  email: {
    validator: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    errorMessageI18n: 'contact_us.error_email',
    idErrorElement: 'email-error'
  }
};
const successAlert = ['blog_detail.success_message', 'success']
const form = document.getElementById('email-form');

function reloadHomeMessage() {
  const successAlert = document.getElementById('alert-message-success');
  const { errorMessageI18n, idErrorElement } = validationSetUp['email'];
  const errorElement = document.getElementById(idErrorElement);
  errorElement.textContent = t(errorMessageI18n);

  successAlert.textContent = t('contact_us.success_message');
  document.getElementById('email').setAttribute('placeholder', t('home.email_placeholder'));
}

form.addEventListener('submit', function (event) {
  event.preventDefault();
  document.getElementById('email-error').classList.add('hidden');
  validateForm(validationSetUp, successAlert);
});

document.getElementById('email').addEventListener('input', function (event) {
  const inputElement = event.target;
  validateInput(inputElement, validationSetUp);
});

document.addEventListener('DOMContentLoaded', function () {
  const blog_content = document.querySelector('.blog_content');
  hoverTooltip(blog_content, 'blog.content');

  const about_us_content = document.querySelector('.about_us_content');
  hoverTooltip(about_us_content, 'about_us.content');
});

document.querySelectorAll('span[data-category]').forEach(tab => {
  tab.addEventListener('click', function () {
    const allCards = document.querySelectorAll('.cards');

    allCards.forEach(cardSection => {
      cardSection.classList.add('opacity-0');
      setTimeout(() => {
        cardSection.classList.add('hidden');
      }, 300);
    });

    document.querySelectorAll('span[data-category]').forEach(tab => {
      tab.classList.remove('text-primary-color');
    });

    const category = this.getAttribute('data-category');
    const selectedCards = document.getElementById(category);

    selectedCards.classList.remove('opacity-0');
    setTimeout(() => {
      selectedCards.classList.remove('hidden');
    }, 300);

    this.classList.add('text-primary-color');
  });
});
