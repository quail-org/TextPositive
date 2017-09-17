var createServer = require("auto-sni");

var server = createServer({
  email: 'no@nopls.com',
  agreeTos: true, // Required for letsencrypt.
  debug: true, // Add console messages and uses staging LetsEncrypt serv
  domains: ["localhost"],
  ports: {
    https: 443 // // Optionally override the default https port.
  }
});

// Server is a "https.createServer" instance.
server.once("listening", ()=> {
  console.log("We are ready to go.");
});
