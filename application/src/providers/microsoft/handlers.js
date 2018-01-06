import * as SocialUtils from "../../components/smart/SocialLogin/SocialUtils";
import configuration from "./configuration";

// When something happens, try to reauthenticate!
// This returns a promise stating if we successfully reauthenticated or not (.then and .catch)
// This is separate since every provider has different error codes if the access token expires
export function handleAuthError(err) {
  console.log(`[Microsoft] Handling auth error: ${err}`);

  // InvalidAuthenticationToken:
  //     CompactToken validation failed with reason code: 80049228.
  if (
    err === "CompactToken parsing failed with error code: 80049217" ||
    err === "CompactToken validation failed with reason code: 80049228."
  ) {
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