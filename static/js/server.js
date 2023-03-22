'use strict';

const express = require('express');
const path = require('path');

const app = express();

app.use(
  '/static',
  express.static(path.resolve('static'), { extensions: ['js'] })
);

app.get('/*', (_, res) => {
  res.sendFile(path.resolve('index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
