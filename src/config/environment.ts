const IS_PRODUCTION = import.meta.env.PROD;
export const AUTH_REDIRECT_URI = import.meta.env.VITE_AUTH0_REDIRECT_URI;
const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;

const environment = {
  CLIENT_ID: import.meta.env.VITE_AUTH0_CLIENT_ID,
  CLIENT_SECRET: import.meta.env.VITE_AUTH0_CLIENT_SECRET,
  REDIRECT_URI: !IS_PRODUCTION ? window.location.origin : AUTH_REDIRECT_URI,
  GOOGLE_REDIRECT_URI: !IS_PRODUCTION
    ? window.location.origin
    : GOOGLE_REDIRECT_URI,
  AUTH0_DOMAIN: import.meta.env.VITE_AUTH0_DOMAIN,
  TEMP_BUSINESS_UNIT: "public",

  ICOREBANKING_API_URL_QUERY: import.meta.env.VITE_ICOREBANKING_API_URL_QUERY,
  ICOREBANKING_API_URL_PERSISTENCE: import.meta.env
    .VITE_ICOREBANKING_API_URL_PERSISTENCE,
  IVITE_IPORTAL_STAFF_QUERY_PROCESS_SERVICE: import.meta.env
    .VITE_IPORTAL_STAFF_QUERY_PROCESS_SERVICE,
  IVITE_ISAAS_QUERY_PROCESS_SERVICE: import.meta.env
    .VITE_ISAAS_QUERY_PROCESS_SERVICE,
  VITE_SECRET_KEY_PORTAL_NAME: import.meta.env.VITE_SECRET_KEY_PORTAL_NAME,
  VITE_SECRET_KEY_PORTAL_ID: import.meta.env.VITE_SECRET_KEY_PORTAL_ID,
  VITE_ICLIENT_QUERY_PROCESS_SERVICE: import.meta.env
    .VITE_ICLIENT_QUERY_PROCESS_SERVICE,
  VITE_IPROSPECT_QUERY_PROCESS_SERVICE: import.meta.env
    .VITE_IPROSPECT_QUERY_PROCESS_SERVICE,
};

const maxRetriesServices = 5;
const fetchTimeoutServices = 3000;

export { environment, fetchTimeoutServices, maxRetriesServices };
