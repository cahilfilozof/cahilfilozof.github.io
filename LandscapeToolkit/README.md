# Landscape Architecture Toolkit

A static, browser-based toolkit designed to live inside the `cahilfilozof.github.io` GitHub Pages site.

## Recommended repository structure

```text
cahilfilozof.github.io/
├── index.html
├── ...your existing main-site files...
│
└── landscape-toolkit/
    ├── index.html
    ├── styles.css
    └── app.js
```

The toolkit will then be available at:

```text
https://cahilfilozof.github.io/landscape-toolkit/
```

## Link from your main `index.html`

Add a normal link or card to the root homepage:

```html
<a href="landscape-toolkit/">
  Landscape Architecture Toolkit
</a>
```

A more portfolio-style card example is included in `main-index-link-snippet.html`.

## Included tools

1. Slope calculator
2. Plant quantity calculator
3. Material quantity + waste
4. Soil volume calculator
5. Rainwater harvesting calculator
6. Green-area ratio
7. Tree spacing estimate
8. Rough parking capacity estimate

## No framework required

The site uses only:

- HTML
- CSS
- JavaScript

It can be hosted directly through GitHub Pages.

## Notes

The parking tool is intentionally labeled as a rough early-stage estimator. Final design should follow real site geometry and applicable standards/regulations.


## Language support

The toolkit now supports both:

- English
- Türkçe

Use the `TR / EN` button in the top-right corner. The selected language is remembered in `localStorage`.
