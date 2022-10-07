#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('chat:server');
var http = require('http');
const socketIO = require('socket.io');

const Mensaje = require('../models/mensaje.model');


//Config .en
require('dotenv').config();

//Config db
require('../config/db');
/**
 * 
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

//Configuración servidor WS

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('Se ha conectado un nuevo cliente');
  //desde el server para el que este solo conectado
  socket.broadcast.emit('mensaje_chat', {
    nombre: 'INFO',
    mensaje: 'Se ha conectado un nuevo Usuario'
  });

  //desde el server para todos hasta los desconectados numero de usuarios conectados.
  io.emit('usuarios_chat', io.engine.clientsCount);


  //emitir desde el server para todo el mundo
  socket.on('mensaje_chat', async (body) => {
    //TODO guardar ese mensaje en la BD
    await Mensaje.create(body);

    io.emit('mensaje_chat', body);
  });

  socket.on('disconnect', () => {
    io.emit('mensaje_chat', {
      nombre: 'INFO',
      mensaje: 'Se ha desconectado un Usuario'
    });
    io.emit('usuarios_chat', io.engine.clientsCount);
  });
});


/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
