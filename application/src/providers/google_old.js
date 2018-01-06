import * as SocialUtils from "../components/smart/SocialLogin/SocialUtils";

export const configuration = {
  localStorageKeys: {
    token: "auth.google.token",
    refresh: "auth.google.refresh"
  },
  details: {
    key: 'google',
    title: "Google Drive",
    description: "Connect your Google Account and migrate everything including GDocs, GSheets, ...",
    logo: require("../images/gdrive.svg")
  },
  auth: {
    name: "Google",
    authUrl: "https://api.m18x.com/auth/google",
    refreshUrl: "https://api.m18x.com/auth/google/refresh",
    successUrl: "https://api.m18x.com/auth/success",
    errorUrl: "https://api.m18x.com/auth/error"
  }
};

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
