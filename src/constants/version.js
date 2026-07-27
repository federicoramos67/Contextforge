// La versión se inyecta en build desde package.json (ver `define` en
// vite.config.js), para que el badge del header no se desincronice del
// package.json como pasaba cuando estaba escrita a mano en App.jsx.
export const APP_VERSION = `v${__APP_VERSION__}`;
