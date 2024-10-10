const validationSetUp = {
    username: {
        validator: value => value.length >= 3,
        errorMessageI18n: 'blog_detail.error_name',
        idErrorElement: 'username-error'
    },
    email: {
        validator: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        errorMessageI18n: 'blog_detail.error_email',
        idErrorElement: 'email-error'
    },
    message: {
        validator: value => value.length >= 10,
        errorMessageI18n: 'blog_detail.error_message',
        idErrorElement: 'message-error'
    }
};
const successAlert = ['blog_detail.success_message', 'success']
const form = document.getElementById('blog-form');

function reloadBlogDetailMessage() {
    const successAlert = document.getElementById('alert-message-success');
    successAlert.textContent = t('blog_detail.success_message');

    Object.keys(validationSetUp).forEach(field => {
        const { errorMessageI18n, idErrorElement } = validationSetUp[field];
        const errorElement = document.getElementById(idErrorElement);
        errorElement.textContent = t(errorMessageI18n);
    });
}

async function fetchBlogDetailData(lang) {
    const blogs = await fetchData(`${lang}/blogs`);

    loadBlogDetail(blogs);
}

form.addEventListener('submit', function (event) {
    event.preventDefault();
    document.querySelectorAll('.error-message').forEach(error => error.classList.add('hidden'));
    validateForm(validationSetUp, successAlert);
});

Object.keys(validationSetUp).forEach(field => {
    document.getElementById(field).addEventListener('input', function(event) {
        const inputElement = event.target;
        validateInput(inputElement, validationSetUp);
    });
});

function loadBlogDetail(blogs) {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const blogId = params.get('id');

    blogElement = document.getElementById('blog')
    if (blogId) {
        const blog = blogs.find(b => b.id == blogId);

        if (blog) {
            document.getElementById('blog-title').textContent = blog.title;
            document.getElementById('blog-content').textContent = blog.content;
            document.getElementById('blog-author').textContent = `${blog.author} (${blog.date})` ;
            document.getElementById('blog-image').src = blog.image;
            document.getElementById('blog-comments').textContent = blog.comments;
        } else {
            blogElement.innerHTML = `<h1 class="text-lg mt-5">${t('blog_detail.404_message')}</h1>`;
        }
    } else {
        blogElement.innerHTML = `<h1 class="text-lg mt-5">${t('blog_detail.404_message')}</h1>`;
    }
}
