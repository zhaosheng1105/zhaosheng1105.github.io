# Sheng Zhao · 赵晟

Personal academic website: https://zhaosheng1105.github.io/

The published site is the reviewed, bilingual Academic Pages export in **homepage/**. Deployment copies those files unchanged to the gh-pages branch; it does not rebuild them through the previous al-folio theme or purge the approved styles.

- Chinese homepage: homepage/index.html
- English homepage: homepage/en/index.html
- Research: research.html (projects, publications, patents)
- Honors and awards: honors.html
- Avatar, styles, fonts and scripts: homepage/images and homepage/assets

The language selector preserves the current page. Common URLs from the previous homepage redirect to the corresponding new sections. Asset URLs include content versions to prevent old cached styles from changing the approved layout.

Run **node scripts/validate-homepage.cjs** before publishing. The earlier al-folio sources remain in the repository for reference and are not included in the active deployment.

Template: [Academic Pages](https://github.com/academicpages/academicpages.github.io), based on Minimal Mistakes. Its MIT license is retained in homepage/LICENSE.txt. The site contains the owner's supplied portrait and public academic information.
