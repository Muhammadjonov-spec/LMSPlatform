const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/public', express.static(path.join(__dirname, '..', 'public')));
app.use('/videos', express.static(path.join(__dirname, '..', 'public', 'videos')));

app.use('/api/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/api/public', express.static(path.join(__dirname, '..', 'public')));
app.use('/api/videos', express.static(path.join(__dirname, '..', 'public', 'videos')));

const { swaggerUi, specs } = require('./config/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


const routes = require('./routes/index');
const errorHandler = require('./middlewares/error-handler.middleware');

app.use('/api', routes);

app.use(errorHandler);

module.exports = app;
