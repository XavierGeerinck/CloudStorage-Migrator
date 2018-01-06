module.exports = {
  providers: {
    github: {
      provider: "github",
      password: "<a_random_26_char_password>",
      clientId: "<your_client_id>",
      clientSecret: "<your_client_secret>",
      isSecure: false, // Terrible idea but required if not using HTTPS especially if developing locally
      forceHttps: true,
      skipProfile: true
    },
    google: {
      provider: "google",
      password: "<a_random_26_char_password>",
      clientId: "<your_client_id>",
      clientSecret: "<your_client_secret>",
      scope: ["https://www.googleapis.com/auth/drive"],
      isSecure: false, // Terrible idea but required if not using HTTPS especially if developing locally
      forceHttps: true,
      skipProfile: true,
      // Add custom provider params to always get a refresh token
      providerParams: {
        access_type: "offline",
        prompt: "consent"
      }
    },
    office365: {
      provider: "office365",
      password: "<a_random_26_char_password>",
      clientId: "<your_client_id>",
      clientSecret: "<your_client_secret>",
      scope: ["openid", "profile", "offline_access", "User.Read", "Files.ReadWrite.All"],
      isSecure: false, // Terrible idea but required if not using HTTPS especially if developing locally
      forceHttps: true,
      skipProfile: true
    }
  }
}