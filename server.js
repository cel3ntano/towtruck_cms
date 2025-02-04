const { createStrapi } = require('@strapi/strapi');
const path = require('path');
const strapiConfig = {
  appDir: process.cwd(),
  distDir: path.join(__dirname, 'dist'),
  serveAdminPanel: true,
};
createStrapi(strapiConfig)
  .load()
  .then(app => app.start())
  .catch(error => {
    console.error('Strapi startup error:', error);
    process.exit(1);
  });
