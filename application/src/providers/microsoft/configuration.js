export default {
  localStorageKeys: {
    token: "auth.onedrive.token",
    refresh: "auth.onedrive.refresh"
  },
  details: {
    key: "onedrive",
    title: "OneDrive",
    description:
      "Connect your OneDrive Account and migrate everything including Word, PowerPoint, ...",
    logo: require("../../images/onedrive.svg")
  },
  auth: {
    name: "Microsoft",
    authUrl: "https://api.m18x.com/auth/office365",
    refreshUrl: "https://api.m18x.com/auth/office365/refresh",
    successUrl: "https://api.m18x.com/auth/success",
    errorUrl: "https://api.m18x.com/auth/error"
  }
};
