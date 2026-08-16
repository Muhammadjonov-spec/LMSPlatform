const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const { swaggerUi, specs } = require('./config/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


const routes = require('./routes/index');
app.use('/api', routes);

module.exports = app;
