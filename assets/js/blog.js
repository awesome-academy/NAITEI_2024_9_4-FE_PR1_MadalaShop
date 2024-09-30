document.addEventListener('DOMContentLoaded', function() {
    const contents = document.querySelectorAll('.content');
    contents.forEach(content => {
        hoverTooltip(content, 'blog.content');
    });
});
