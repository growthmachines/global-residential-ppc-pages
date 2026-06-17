# Global Residential — Landing Pages

This repository hosts landing pages for PPC campaigns at `lp.global-residential.com`.

## How to add a new landing page

1. Create a new folder for your campaign (e.g., `cyprus-properties/`)
2. Add your `index.html`, CSS files, images, and any other assets inside that folder
3. Push to the `main` branch
4. Your page will be live within ~30 seconds at: `https://lp.global-residential.com/your-folder-name/`

### Example

A folder called `cyprus-properties/` with an `index.html` inside will be live at:
**https://lp.global-residential.com/cyprus-properties/**

## Folder structure

```
/
├── cyprus-properties/
│   ├── index.html
│   ├── styles.css
│   └── images/
│       └── hero.jpg
├── another-campaign/
│   ├── index.html
│   └── styles.css
└── README.md
```

## Important notes

- Each campaign should be in its own folder
- The main entry point for each campaign should be named `index.html`
- All asset paths (CSS, images, JS) should be **relative** (e.g., `./styles.css`, `./images/hero.jpg`)
- Changes go live automatically when pushed to the `main` branch
