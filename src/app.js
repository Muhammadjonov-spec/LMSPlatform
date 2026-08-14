const express = require('express');
const app = express();

app.use(express.json())

// Swagger UI configuration
const { swaggerUi, specs } = require('./config/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get("/api")

module.exports=app
