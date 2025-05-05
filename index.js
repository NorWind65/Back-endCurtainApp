import express from 'express';
//const mongoose = require('mongoose');

const app = express();

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});