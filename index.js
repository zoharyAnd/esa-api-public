const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

app.use(express.urlencoded({ limit: '50mb', parameterLimit: 100000, extended: true }));
app.use(express.json({limit: '50mb'}));

const fileUpload = require("express-fileupload");
app.use(fileUpload());

require("dotenv").config();
require("./services/db");

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello from API");
});

app.use('/', require('./routes/upload'));
app.use('/', require('./routes/users'));
app.use('/', require('./routes/timetable'));
app.use('/', require('./routes/mail'));
app.use('/', require('./routes/attendance'));
app.use('/', require('./routes/term'));
app.use('/', require('./routes/subject'));
app.use('/', require('./routes/level'));
app.use('/', require('./routes/invoice'));
app.use('/', require('./routes/grade'));
app.use('/', require('./routes/price'));
app.use('/', require('./routes/prices_v2'));
app.use('/', require('./routes/news'));

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({'message': err.message});
  return;
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});