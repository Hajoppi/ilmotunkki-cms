export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'set-this-from-env'),
  },
  apiToken: { 
    salt: env('API_TOKEN_SALT','123'),
  },
});
