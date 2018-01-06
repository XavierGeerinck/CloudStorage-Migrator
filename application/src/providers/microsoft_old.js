import * as SocialUtils from "../components/smart/SocialLogin/SocialUtils";

export const configuration = {
  localStorageKeys: {
    token: "auth.onedrive.token",
    refresh: "auth.onedrive.refresh"
  },
  details: {
    key: "onedrive",
    title: "OneDrive",
    description:
      "Connect your OneDrive Account and migrate everything including Word, PowerPoint, ...",
    logo: require("../images/onedrive.svg")
  },
  auth: {
    name: "Microsoft",
    authUrl: "https://api.m18x.com/auth/office365",
    refreshUrl: "https://api.m18x.com/auth/office365/refresh",
    successUrl: "https://api.m18x.com/auth/success",
    errorUrl: "https://api.m18x.com/auth/error"
  }
};

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
