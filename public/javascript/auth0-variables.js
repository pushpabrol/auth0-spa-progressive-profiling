
const AUTH0_CLIENT_ID = 'your client_id';
const AUTH0_DOMAIN = 'domain.auth0.com';
const AUDIENCE = 'organise';
const SCOPE = 'openid profile email read:contacts read:calendar';
const AUTH0_CALLBACK_URL = 'http://app1.com:3000';
const AUTH0_CONNECTION = 'Username-Password-Authentication';
const CONTACTS_API_PORT = '3005';
const CALENDAR_API_PORT = '3002';
const APIS_HOST='http://app1.com';
const APP_BASE_URL='http://app1.com:3000';

const auth0WebAuth = new auth0.WebAuth({
  domain: AUTH0_DOMAIN,
  clientID: AUTH0_CLIENT_ID,
  redirectUri: AUTH0_CALLBACK_URL,
  responseType: 'id_token token',
  audience: AUDIENCE,
  scope: SCOPE
});

const auth0Authentication = new auth0.Authentication(auth0WebAuth, {
  domain: AUTH0_DOMAIN,
  clientID: AUTH0_CLIENT_ID
});
