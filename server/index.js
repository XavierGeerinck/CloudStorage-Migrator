const Hapi = require("hapi");
const Wreck = require("wreck");
const querystring = require('querystring');
const server = new Hapi.Server({ debug: { request: ["error"] } });
const config = require('./config');

server.connection({ 
    port: 8000,
    routes: {
        cors: {
            origin: [ "*" ],
            headers: [ "Accept", "Authorization", "Content-Type", "If-None-Match", "Bearer", "x-http-method-override" ],
            credentials: true,
            additionalHeaders: [
                "Origin"
            ]
        }
    }
});

// Register bell with the server
server.register(require("bell"), function(err) {
  // Declare an authentication strategy using the bell scheme
  // with the name of the provider, cookie encryption password,
  // and the OAuth client credentials.
  server.auth.strategy("github", "bell", config.providers.github);
  server.auth.strategy("office365", "bell", config.providers.office365);
  server.auth.strategy("google", "bell", config.providers.google);

  server.route({
    method: ["GET", "POST"], // Must handle both GET and POST
    path: "/auth/github", // The callback endpoint registered with the provider
    config: {
      auth: "github",
      handler: (request, reply) => {
        if (!request.auth.isAuthenticated) {
          return reply.redirect(`/auth/error?message=${request.auth.error.message}`);
        }

        // Perform any account lookup or registration, setup local session,
        // and redirect to the application. The third-party credentials are
        // stored in request.auth.credentials. Any query parameters from
        // the initial request are passed back via request.auth.credentials.query.
        // return reply(request.auth.credentials);
        return reply.redirect(`/auth/success?token=${request.auth.credentials.token}&refresh=${request.auth.credentials.refreshToken}`);
      }
    }
  });

  server.route({
    method: ["GET"], // Must handle both GET and POST
    path: "/auth/office365/refresh", // The callback endpoint registered with the provider
    config: {
      handler: (request, reply) => {
        Wreck.post(
          "https://login.microsoftonline.com/common/oauth2/v2.0/token",
          {
            payload: querystring.stringify({
              refresh_token: request.query.refreshToken,
              client_id: config.providers.office365.clientId,
              client_secret: config.providers.office365.clientSecret,
              grant_type: "refresh_token"
            }),
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          },
          (err, res, payload) => {
            if (err) {
                return reply(err);
            }

            return reply(payload);
          }
        );
      }
    }
  });

  server.route({
    method: ["GET", "POST"], // Must handle both GET and POST
    path: "/auth/office365", // The callback endpoint registered with the provider
    config: {
      auth: "office365",
      handler: (request, reply) => {
        console.log(request.auth);
        if (!request.auth.isAuthenticated) {
          return reply.redirect(`/auth/error?message=${request.auth.error.message}`);
        }

        // Perform any account lookup or registration, setup local session,
        // and redirect to the application. The third-party credentials are
        // stored in request.auth.credentials. Any query parameters from
        // the initial request are passed back via request.auth.credentials.query.
        // return reply(request.auth.credentials);
        return reply.redirect(`/auth/success?token=${request.auth.credentials.token}&refresh=${request.auth.credentials.refreshToken}`);
      }
    }
  });

  server.route({
    method: ["GET"], // Must handle both GET and POST
    path: "/auth/google/refresh", // The callback endpoint registered with the provider
    config: {
      handler: (request, reply) => {
        Wreck.post(
          "https://www.googleapis.com/oauth2/v4/token",
          {
            payload: querystring.stringify({
              refresh_token: request.query.refreshToken,
              client_id: config.providers.google.clientId,
              client_secret: config.providers.google.clientSecret,
              grant_type: "refresh_token"
            }),
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          },
          (err, res, payload) => {
            if (err) {
                return reply(err);
            }

            return reply(payload);
          }
        );
      }
    }
  });

  server.route({
    method: ["GET", "POST"], // Must handle both GET and POST
    path: "/auth/google", // The callback endpoint registered with the provider
    config: {
      auth: "google",
      handler: (request, reply) => {
        // If we passed a refresh token, try to get a new access token

        console.log(request.auth);
        if (!request.auth.isAuthenticated) {
          return reply.redirect(`/auth/error?message=${request.auth.error.message}`);
        }

        // Perform any account lookup or registration, setup local session,
        // and redirect to the application. The third-party credentials are
        // stored in request.auth.credentials. Any query parameters from
        // the initial request are passed back via request.auth.credentials.query.
        // return reply(request.auth.credentials);
        return reply.redirect(`/auth/success?token=${request.auth.credentials.token}&refresh=${request.auth.credentials.refreshToken}`);
      }
    }
  });

  server.route({
    method: "GET",
    path: "/auth/error",
    handler: (request, reply) => reply("")
  });

  server.route({
    method: "GET",
    path: "/auth/success",
    handler: (request, reply) => reply("")
  });

  console.log(`Server started on 127.0.0.1:8000`);

  server.start();
});