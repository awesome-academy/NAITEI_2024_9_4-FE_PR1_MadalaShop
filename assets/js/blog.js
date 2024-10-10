const itemType = 'blog'

async function fetchBlogPageData(lang) {
    const blogs = await fetchData(`${lang}/blogs`);
    displayGridListContent(blogs, 1, currentView, itemType);
}

function createGridViewBlogHTML(blog) {
    return `
        <img src="${blog.image}" alt="Tin tức" class="object-cover mb-2">
        <h3 class="text-lg font-bold mb-2 pb-2 border-b">${blog.title}</h3>
        <p class="text-gray-500 mb-2 line-clamp-6 content">${blog.content}</p>
        <div class="mt-auto">
            <p class="text-gray-400 mb-2 italic">
                <span data-i18n="blog.author"></span>  ${blog.author} ${blog.date}
            </p>
            <div class="flex justify-between pt-2 border-t text-gray-400">
                <a class="hover:text-primary-color cursor-pointer read-more-btn" href="./blog_detail.html?id=${blog.id}">
                    <span data-i18n="blog.read_more">${t('blog.read_more')}</span>
                    <i class="fa fa-angle-right"></i>
                </a>
                <p>${blog.comments} <span data-i18n="blog.comments">${t('blog.comments')}</span></p>
            </div>
        </div>
    `;
}

function createListViewBlogHTML(blog) {
    return `
        <img src="${blog.image}" alt="Tin tức" class="w-2/5 object-cover">
        <div class="w-3/5 pl-4 flex flex-col justify-between">
            <div>
                <h3 class="text-lg font-bold mb-2 pb-2 border-b">${blog.title}</h3>
                <p class="text-gray-500 mb-2 line-clamp-6 content">${blog.content}</p>
            </div>
            <div>
                <p class="text-gray-400 mb-4 italic">
                    <span data-i18n="blog.author"></span>  ${blog.author} ${blog.date}
                </p>
                <div class="flex justify-between pt-2 border-t text-gray-400">
                    <a class="hover:text-primary-color cursor-pointer read-more-btn" href="./blog_detail.html?id=${blog.id}">
                        <span data-i18n="blog.read_more">${t('blog.read_more')}</span>
                        <i class="fa fa-angle-right"></i>
                    </a>
                    <p>${blog.comments} <span data-i18n="blog.comments">${t('blog.comments')}</span></p>
                </div>
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', function() {
    document.body.addEventListener('mouseover', function(event) {
        if (event.target.classList.contains('content')) {
            hoverTooltip(event.target, 'blog.content');
        }
    });
});
