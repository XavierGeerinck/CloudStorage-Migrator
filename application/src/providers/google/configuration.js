export default {
  localStorageKeys: {
    token: "auth.google.token",
    refresh: "auth.google.refresh"
  },
  details: {
    key: 'google',
    title: "Google Drive",
    description: "Connect your Google Account and migrate everything including GDocs, GSheets, ...",
    logo: require("../../images/gdrive.svg")
  },
  auth: {
    name: "Google",
    authUrl: "https://api.m18x.com/auth/google",
    refreshUrl: "https://api.m18x.com/auth/google/refresh",
    successUrl: "https://api.m18x.com/auth/success",
    errorUrl: "https://api.m18x.com/auth/error"
  }
};
