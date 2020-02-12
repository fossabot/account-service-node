import app from "./app";

app.start(service => {
  console.log("Enviroment:", process.env.NODE_ENV);
  console.log("Service started:", service);
});

// module.exports = app.fwInstance;
