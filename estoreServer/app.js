const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require("xss-clean");
const hpp = require('hpp');
const AppError = require('./utils/appError');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./Routes/index');
const globalErrorHandler = require('./controllers/errorController');
require('./server');

const app = express();
// GLOBAL MIDDLEWARES

// Set security HTTP headers
app.use(helmet());

// LIMIT REQUESTIONS FROM SAME API
const limiter = rateLimit({
  max: 3,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP,Olease try again in an hour!"
})
app.use("/product", limiter);

// Data sanitization against NoSQL
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
  whitelist: ['duration']
}));

const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
    'DELETE'
  ],

  allowedHeaders: [
    'Content-Type',
  ],
};
app.use(cors(corsOpts));

// BODY PARSER,READING DATA FROM req.body
app.use(bodyParser.json({ limit: '10kb' }), bodyParser.urlencoded({ extended: true }));

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/product', routes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

