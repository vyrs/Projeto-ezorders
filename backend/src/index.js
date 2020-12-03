const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const routes = require('./routes');

// mongodb://balta:e296cd9f@localhost:27017/admin
mongoose.connect('mongodb://vitor:123456@localhost:27017/admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const app = express();
const server = http.Server(app);
const io = socketIo(server);

app.use((request, response, next) => {
  request.io = io; // isso é para poder acessar a instancia io do socket.io dentro das controllers
  return next();
});

app.use(cors()); // cors é para poder acessar a api de outro dominio por exemplo a api rodando na porta 3001 e o front rodando na 3000
app.use(express.json()); // isso pe para o node conseguir receber json tbm
app.use(routes);

server.listen(3001, () => console.log('> Server started at localhost:3001'));
