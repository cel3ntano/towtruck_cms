module.exports = ({ env }) => {
  const isProduction = env('NODE_ENV') === 'production';

  return {
    upload: {
      config: {
        provider: 'local',
        providerOptions: {
          sizeLimit: env.int('STRAPI_ADMIN_PUBLIC_MAX_SIZE', 10000000), // 10MB by default
          ...(isProduction && {
            path: env('STRAPI_UPLOADS_PATH', './public/uploads'), // Default to local path if not set
          }),
        },
        breakpoints: {
          xlarge: 1920,
          large: 1000,
          medium: 750,
          small: 500,
          thumbnail: 100,
        },
      },
    },
  };
};
