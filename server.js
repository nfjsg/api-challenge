const express = require('express');
const databaseConnection = require('./config/connection');
const apiRoutes = require('./routes');

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(apiRoutes);

databaseConnection.once('open', () => {
  app.listen(PORT, () => console.log(`Server is now live on port ${PORT}`));
});
