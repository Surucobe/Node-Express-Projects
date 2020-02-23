const express = require('express');
const cors = require('cors');
const app = express();
require('express-debug')

const { config } = require('./config/index');
const moviesApi = require('./routes/movies.js')

const notFoundHandler = require('./utils/middleware/notFoundHandler')

const {
  logErrors,
  wrapErrors,
  errorHandler
} = require('./utils/middleware/errorHandlers')

//body parser
app.use(express.json());

app.use(cors())

//rutas
moviesApi(app);
//catch 404
app.use(notFoundHandler);

//error middlewares
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

app.listen(config.port, function () {
  console.log(`Listening http://localhost:${config.port}`);
});
