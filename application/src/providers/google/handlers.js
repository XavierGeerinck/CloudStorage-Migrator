import * as SocialUtils from "../../components/smart/SocialLogin/SocialUtils";
import configuration from "./configuration";

// When something happens, try to reauthenticate! 
// This returns a promise stating if we successfully reauthenticated or not (.then and .catch)
// This is separate since every provider has different error codes if the access token expires
export function handleAuthError(err) {
  console.log(`[Google] Handling auth error: ${err}`);

  if (err === "Invalid Credentials") {
    return SocialUtils.handleRefresh(configuration);
  }

  return Promise.resolve();
}

export function getAccessToken() {
  return localStorage.getItem(configuration.localStorageKeys.token);
}

export function getRefreshToken() {
  return localStorage.getItem(configuration.localStorageKeys.refresh);
}