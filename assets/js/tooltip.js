function showTooltip(event, text) {
    const tooltip = document.getElementById('tooltip');
    const tooltipText = document.getElementById('tooltip-text');
    tooltip.style.display = 'block';

    const tooltipWidth = tooltip.offsetWidth;
    const tooltipHeight = tooltip.offsetHeight;
    let left = event.pageX;
    let top = event.pageY; 
    
    tooltipText.textContent = text;

    if (left + tooltipWidth > window.innerWidth) {
        left = event.pageX - tooltipWidth;
    }

    if (top + tooltipHeight > window.innerHeight) {
        top = event.pageY - tooltipHeight;
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    tooltip.classList.remove('hidden');
    tooltip.style.display = '';
}

function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    tooltip.classList.add('hidden');
}

function hoverTooltip(element, i18n) {
    element.addEventListener('mouseover', function(event) {
        showTooltip(event, t(i18n));
    });
    element.addEventListener('mouseout', hideTooltip);
}
