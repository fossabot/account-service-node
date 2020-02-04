import app from "app";

app.start(service => {
  console.log("Service started:", service);
});
module.exports = app.fwInstance;
