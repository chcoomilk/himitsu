const proxy = require("http-proxy-middleware");

module.exports = (app) => {
  app.use(proxy("/functions/", {
    target: "http://localhost:9999/",
    pathRewrite: {
      "^\\.netlify/functions": ""
    }
  }))
}
