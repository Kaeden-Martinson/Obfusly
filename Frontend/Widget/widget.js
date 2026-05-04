/**
 * Obfusly Embeddable Widget
 * 
 * Installation:
 *   <script src="https://obfusly.com/widget/embed.js"></script>
 * 
 * With Options:
 *   <script src="https://obfusly.com/widget/embed.js?position=left&bgColor=%232e6bff"></script>
 * 
 * Options:
 *   - position: 'left' or 'right' (default: 'right')
 *   - bgColor: hex color URL encoded (default: '%23000000')
 */

(function() {
    // Parse URL parameters
    function getQueryParam(param) {
        const url = new URL(document.currentScript.src);
        return url.searchParams.get(param);
    }

    const domain = 'https://obfusly.com';
    const position = getQueryParam('position') || 'right';
    const bgColor = decodeURIComponent(getQueryParam('bgColor') || '%23000000');
    
    const collapsedWidth = 62;
    const expandedWidth = 156;
    const widgetHeight = 62;
    const logoHeight = 58;
    const iconSize = 25;

    // Create main container
    const widgetContainer = document.createElement('div');
    widgetContainer.style.position = 'fixed';
    widgetContainer.style.bottom = '20px';
    widgetContainer.style[position === 'left' ? 'left' : 'right'] = '20px';
    widgetContainer.style.width = collapsedWidth + 'px';
    widgetContainer.style.fontFamily = "'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    widgetContainer.style.height = widgetHeight + 'px';
    widgetContainer.style.borderRadius = '18px';
    widgetContainer.style.backgroundColor = bgColor;
    widgetContainer.style.display = 'flex';
    widgetContainer.style.alignItems = 'center';
    widgetContainer.style.cursor = 'pointer';
    widgetContainer.style.boxShadow = 'rgba(0, 0, 0, 0.5) 2px 2px 10px';
    widgetContainer.style.transition = 'width 0.42s ease, box-shadow 0.22s ease';
    widgetContainer.style.overflow = 'hidden';
    widgetContainer.style.zIndex = '9999';
    widgetContainer.style.border = '1px solid rgba(255, 255, 255, 0.1)';

    // Create link button
    const button = document.createElement('a');
    button.href = domain;
    button.target = '_blank';
    button.rel = 'noopener noreferrer';
    button.style.display = 'flex';
    button.style.width = '100%';
    button.style.height = '100%';
    button.style.position = 'relative';
    button.style.textDecoration = 'none';
    button.style.color = '#f0f4f8';
    button.style.overflow = 'hidden';

    // Create icon element
    const iconMark = document.createElement('img');
    iconMark.alt = 'Obfusly Icon';
    iconMark.style.position = 'absolute';
    iconMark.style.left = '16px';
    iconMark.style.top = '18px';
    iconMark.style.width = iconSize + 'px';
    iconMark.style.height = iconSize + 'px';
    iconMark.style.objectFit = 'contain';
    iconMark.style.transition = 'opacity 0.18s ease';
    iconMark.style.opacity = '1';
    iconMark.src = domain + '/Images/obfusly_icon.png';

    // Create logo element
    const logoStrip = document.createElement('img');
    logoStrip.alt = 'Obfusly';
    logoStrip.style.position = 'absolute';
    logoStrip.style.left = '0';
    logoStrip.style.top = '2px';
    logoStrip.style.height = logoHeight + 'px';
    logoStrip.style.width = '155px';
    logoStrip.style.display = 'block';
    logoStrip.style.flexShrink = '0';
    logoStrip.style.opacity = '0';
    logoStrip.style.transform = 'translateX(-10px)';
    logoStrip.style.transition = 'transform 0.42s ease, opacity 0.18s ease';
    logoStrip.src = domain + '/Images/obfusly_name.png';

    // Assemble elements
    button.appendChild(iconMark);
    button.appendChild(logoStrip);
    widgetContainer.appendChild(button);

    // Add to page when DOM is ready
    if (document.body) {
        document.body.appendChild(widgetContainer);
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            document.body.appendChild(widgetContainer);
        });
    }

    // Hover expand animation
    widgetContainer.addEventListener('mouseover', function() {
        widgetContainer.style.width = expandedWidth + 'px';
        widgetContainer.style.boxShadow = 'rgba(0, 0, 0, 0.6) 6px 10px 24px';
        iconMark.style.opacity = '0';
        logoStrip.style.opacity = '1';
        logoStrip.style.transform = 'translateX(0)';
    });

    // Hover collapse animation
    widgetContainer.addEventListener('mouseout', function() {
        widgetContainer.style.width = collapsedWidth + 'px';
        widgetContainer.style.boxShadow = 'rgba(0, 0, 0, 0.5) 2px 2px 10px';
        iconMark.style.opacity = '1';
        logoStrip.style.opacity = '0';
        logoStrip.style.transform = 'translateX(-10px)';
    });

    // Mobile touch support
    widgetContainer.addEventListener('touchstart', function() {
        widgetContainer.style.width = expandedWidth + 'px';
        widgetContainer.style.boxShadow = 'rgba(0, 0, 0, 0.6) 6px 10px 24px';
        iconMark.style.opacity = '0';
        logoStrip.style.opacity = '1';
        logoStrip.style.transform = 'translateX(0)';
    });

    widgetContainer.addEventListener('touchend', function() {
        setTimeout(function() {
            widgetContainer.style.width = collapsedWidth + 'px';
            widgetContainer.style.boxShadow = 'rgba(0, 0, 0, 0.5) 2px 2px 10px';
            iconMark.style.opacity = '1';
            logoStrip.style.opacity = '0';
            logoStrip.style.transform = 'translateX(-10px)';
        }, 300);
    });

})();
