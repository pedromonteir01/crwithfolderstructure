require('dotenv').config();
const express = require('express');
const cardsRouter = require('./routes/cards.routes');

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use('/', cardsRouter);

app.listen(port, () => console.log('rodando'));