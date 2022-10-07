var express = require('express');
var router = express.Router();

const Mensaje = require('../models/mensaje.model');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/chat', async (req, res) => {


  const mensajes = await Mensaje.aggregate([
    { $sort: { createdAt: -1 } },
    { $limit: 5 }
  ]);
  console.log(mensajes);
  res.render('chat', { mensajes: mensajes.reverse() });
});

module.exports = router;
