# MAANG Interview Preparation Roadmap - UI

## Quick Start

1. **Open `index.html`** directly in your web browser
   - No server needed! All content is embedded in the HTML file
   - Works offline

2. **Navigate the roadmap:**
   - Click on any **Month** to expand/collapse weeks
   - Click on any **Week** to see categories
   - Click on any **Category** (Behavioral, DSA, System_Design, Revision) to view content

3. **View content:**
   - Content opens in a side panel
   - All markdown is rendered with beautiful formatting
   - Click the X button or press Escape to close

## Rebuilding After Changes

If you update any markdown files, run the build script to regenerate the HTML:

```bash
node build.js
```

This will:
- Read all markdown files from Month_1 through Month_6
- Embed them in the HTML file
- Update the content viewer to use embedded data

## Features

✅ **No Server Required** - All content embedded, works offline  
✅ **Beautiful UI** - Modern, responsive design  
✅ **Tree Navigation** - Easy to see the full roadmap structure  
✅ **Formatted Content** - Markdown rendered with proper styling  
✅ **Fast Loading** - No network requests needed  

## File Structure

```
MAANG_Interview_Prep_6_Months/
├── index.html          # Main UI file (open this in browser)
├── build.js            # Build script to embed markdown files
├── ROADMAP.md          # Full roadmap document
├── Month_1/
│   ├── Week_1/
│   │   ├── Behavioral.md
│   │   ├── DSA.md
│   │   ├── System_Design.md
│   │   └── Revision.md
│   └── ...
└── ...
```

## Requirements

- Modern web browser (Chrome, Firefox, Edge, Safari)
- Node.js (only needed for rebuilding after markdown changes)

Enjoy your interview preparation! 🚀
