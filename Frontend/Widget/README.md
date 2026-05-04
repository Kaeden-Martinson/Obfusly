# Obfusly Widget

A lightweight, embeddable widget that brings Obfusly to your website.

## Features

✨ **Lightweight** - < 5KB uncompressed  
🎯 **Easy Integration** - One line of code  
🎨 **Customizable** - Position and color options  
📱 **Responsive** - Works on all devices  
⚡ **Non-blocking** - Async script loading  
🔒 **Secure** - CORS-enabled, no sensitive data  

## Installation

### Basic Usage

Add this script to your HTML:

```html
<script src="https://obfusly.com/widget/embed.js"></script>
```

### With Options

```html
<!-- Left position with blue background -->
<script src="https://obfusly.com/widget/embed.js?position=left&bgColor=%232e6bff"></script>
```

## Configuration

### Options

| Option | Values | Default | Example |
|--------|--------|---------|---------|
| `position` | `left`, `right` | `right` | `?position=left` |
| `bgColor` | Hex (URL encoded) | `%23000000` | `?bgColor=%232e6bff` |

### Color Reference

| Color | Hex Code | URL Encoded |
|-------|----------|------------|
| Black | #000000 | %23000000 |
| Blue | #2e6bff | %232e6bff |
| Cyan | #88ddff | %2388ddff |
| Dark Blue | #0b1627 | %230b1627 |

## Examples

### Right Position (Default)
```html
<script src="https://obfusly.com/widget/embed.js"></script>
```

### Left Position
```html
<script src="https://obfusly.com/widget/embed.js?position=left"></script>
```

### Blue Theme
```html
<script src="https://obfusly.com/widget/embed.js?bgColor=%232e6bff"></script>
```

### Combined Options
```html
<script src="https://obfusly.com/widget/embed.js?position=left&bgColor=%2388ddff"></script>
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 10.1+
- Edge 79+
- Mobile browsers

## How It Works

1. **Icon State**: Shows a small Obfusly icon in the corner
2. **Hover Expansion**: On hover, expands to show the Obfusly branding
3. **Click Action**: Clicking opens Obfusly in a new tab
4. **Mobile Friendly**: Touch-enabled for mobile devices

## Programmatic Control

Fetch widget configuration via API:

```javascript
fetch('https://obfusly.com/api/widget/config')
    .then(response => response.json())
    .then(data => console.log(data));
```

Response includes all available options and examples.

## Performance

- **Script Size**: ~4.5 KB uncompressed
- **Load Time**: < 100ms
- **Runtime Impact**: Minimal (fixed positioning only)
- **Browser Cache**: 24 hours

## Best Practices

### Async Loading (Recommended)
```html
<script async src="https://obfusly.com/widget/embed.js"></script>
```

### Deferred Loading
```html
<script defer src="https://obfusly.com/widget/embed.js"></script>
```

### Dynamic Injection
```javascript
const script = document.createElement('script');
script.src = 'https://obfusly.com/widget/embed.js?position=left';
script.async = true;
document.head.appendChild(script);
```

## Security & Privacy

- ✅ No personal data collected
- ✅ No cookies set
- ✅ CORS-compliant
- ✅ No external API calls
- ✅ Open source compatible

## Troubleshooting

### Widget not showing
- Check browser console for errors
- Verify script URL is correct
- Ensure images are accessible
- Check z-index conflicts with your CSS

### Images not loading
- Verify domain in .env is correct
- Check image files exist in `/Frontend/Images/`
- Ensure CORS headers are set

### Styling conflicts
- Widget uses `z-index: 9999`
- Check for conflicting CSS
- Test in incognito/private mode

## Files

- `widget.js` - Main widget script
- `widget.html` - Standalone test page
- `INSTALLATION.md` - Installation guide
- `README.md` - This file

## Support

For issues or questions:
- 📧 Email: support@obfusly.com
- 🐛 Report bugs: [GitHub Issues]
- 💬 Chat: [Support Portal]

## License

© 2026 Obfusly. All rights reserved.
