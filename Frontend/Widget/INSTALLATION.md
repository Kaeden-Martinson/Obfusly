# Obfusly Widget - Installation Guide

## Quick Start

Add one line of code to your website to embed the Obfusly widget:

```html
<script src="https://obfusly.com/widget/embed.js"></script>
```

That's it! The widget will appear in the bottom right corner of your page.

---

## Customization

### Position
Choose where the widget appears:
- **Right (Default)**: `?position=right`
- **Left**: `?position=left`

### Color
Customize the background color with hex codes (URL encoded):
- **Black (Default)**: `?bgColor=%23000000`
- **Blue**: `?bgColor=%232e6bff`
- **Cyan**: `?bgColor=%2388ddff`

---

## Examples

### Basic Installation
```html
<script src="https://obfusly.com/widget/embed.js"></script>
```

### Left Position
```html
<script src="https://obfusly.com/widget/embed.js?position=left"></script>
```

### Blue Background (Right)
```html
<script src="https://obfusly.com/widget/embed.js?bgColor=%232e6bff"></script>
```

### Left Position with Custom Color
```html
<script src="https://obfusly.com/widget/embed.js?position=left&bgColor=%2388ddff"></script>
```

---

## How It Works

1. The widget displays as a fixed icon in the corner of your page
2. On hover, it expands to show the Obfusly branding
3. Clicking the widget opens Obfusly in a new tab
4. The widget is fully responsive and works on all devices

---

## Support

- **Documentation**: `https://obfusly.com/widget`
- **Configuration API**: `https://obfusly.com/api/widget/config`

For issues or questions, please contact support.

---

## Security & Performance

- **CORS-enabled**: Works on any domain
- **Lightweight**: < 5KB uncompressed
- **No dependencies**: Pure JavaScript
- **Cached**: 24-hour browser cache for performance
- **Non-blocking**: Asynchronous script loading recommended

```html
<!-- Recommended: Non-blocking script -->
<script async src="https://obfusly.com/widget/embed.js"></script>
```

---

## Advanced Configuration

For programmatic configuration, fetch the API:

```javascript
fetch('https://obfusly.com/api/widget/config')
    .then(r => r.json())
    .then(data => console.log(data));
```

Returns all available options and examples.
