const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const { swaggerUi, specs } = require('./config/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


const routes = require('./routes/index');
const errorHandler = require('./middlewares/error-handler.middleware');

app.use('/api', routes);

app.use(errorHandler);

module.exports = app;
