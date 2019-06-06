// Declare the base end-point for all APIs
const API_BASE = process.env.REACT_APP_API_BASE;
// Declare the API end-point for public APIs
export const API_AUTH = API_BASE + '/Token';
export const API_SIGN_IN = API_BASE + '/SignIn';
export const API_SIGN_UP = API_BASE + '/SignUp';
export const API_PREFERRED_LANGS = API_BASE + '/Languages';
// Declare the whole site routes base, included public and private
export const ROUTE_INDEX = '/';
// export const ROUTE_LOGIN = '/login';
export const ROUTE_SIGNUP = '/signup';
// private routes only expose the entry point
export const ROUTE_PRIVATE = '/private';
// 
export const TOKEN_NAME = 'access_token';
export const LANG_ID = 'lang';