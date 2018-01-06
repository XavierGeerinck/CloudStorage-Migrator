import PopupWindow from "./PopupWindow";

export const authenticate = (providerConfiguration, onRequest = () => {}) => {
  const providerName = providerConfiguration.auth.name;
  console.log(`[${providerName}] Authenticating to provider`);

  const { authUrl, successUrl, errorUrl } = providerConfiguration.auth;
  const popup = (this.popup = PopupWindow.open(`Authenticate to ${providerName}`, authUrl, successUrl, errorUrl, { height: 1000, width: 600 }));

  onRequest();

  // Return popup, we can do .then(data => {}, error => {})
  return popup;
};
 
export async function getAccessToken(providerConfiguration, refreshToken) {
  let res = await fetch(`${providerConfiguration.auth.refreshUrl}?refreshToken=${refreshToken}`);
  return res.json();
}

/**
 * When we successfully authenticated, we receive access and refresh tokens, save them
 * @param {*} providerConfiguration 
 * @param {*} response 
 */
export const handleAuthSuccess = (providerConfiguration, response) => {
  const providerName = providerConfiguration.auth.name;
  console.log(`[${providerName}] Successfully authenticated `);
  console.log(`[${providerName}] Token:` + localStorage.getItem(providerConfiguration.localStorageKeys.token));
  console.log(`[${providerName}] Refresh:` + localStorage.getItem(providerConfiguration.localStorageKeys.refresh));
  localStorage.setItem(providerConfiguration.localStorageKeys.token, response.token.replace(/#/, ""));
  localStorage.setItem(providerConfiguration.localStorageKeys.refresh, response.refresh.replace(/#/, ""));
};

/**
 * Something happened during authentication
 * @param {*} providerConfiguration 
 * @param {*} response 
 */
export const handleAuthError = (providerConfiguration, response) => {
  console.error(response);
};

/**
 * We need to refresh the access_token since it expired, handle that here!
 * 
 * This method will call the refresh url for the given provider
 * @param {*} providerConfiguration 
 */
export async function handleRefresh(providerConfiguration) {
  const providerName = providerConfiguration.auth.name;

  console.log(`[${providerName}] Auth error, removing accessToken!`);
  localStorage.removeItem(providerConfiguration.localStorageKeys.token);

  console.log(`[${providerName}] Trying to re-authenticate`);
  const refreshToken = localStorage.getItem(providerConfiguration.localStorageKeys.refresh);

  if (!refreshToken) {
    console.log(`[${providerName}] refreshToken is invalid, need to re-authenticate completely`);
    return authenticate(providerConfiguration).then(data => handleAuthSuccess(providerConfiguration, data), error => handleAuthError(providerConfiguration, error));
  }

  console.log(`[${providerName}] Has refreshToken, trying this first!`);

  let data;

  try {
    data = await getAccessToken(providerConfiguration, localStorage.getItem(providerConfiguration.localStorageKeys.refresh));

    console.log(`[${providerName}] Got new accessToken ${data.access_token}`);
  } catch (err) {
    console.error(err);
    console.log(`[${providerName}] Could not refresh accessToken with refreshToken, deeming the refreshToken invalid`);
    //return authenticate(details).then(data => handleAuthSuccess(details, data), error => handleAuthError(details, error));
  }
  
  if (data.error) {
    return Promise.reject({
      message: data.error,
      description: data.error_description
    });
  }

  localStorage.setItem(providerConfiguration.localStorageKeys.token, data.access_token.replace(/#/, ""));
}

/**
 * When a refresh token is invalid, handle it by re-authenticating completely
 * @param {*} providerConfiguration 
 */
export const handleRefreshTokenInvalid = (providerConfiguration) =>
  authenticate(providerConfiguration).then(data => handleAuthSuccess(providerConfiguration, data), error => handleAuthError(providerConfiguration, error));
