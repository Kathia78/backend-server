var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require("jsonwebtoken");

var SEED = require('../config/config').SEED;

var app = express();

var Usuario = require('../models/usuario');

app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al buscar Usuario',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }


        //CREAR UN TOKEN !!!

        usuarioDB.password = ':)';
        var toket = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 144000 }); // Son 4 horas de expiracion

        res.status(200).json({
            ok: true,
            toket: toket,
            id: usuarioDB._id
        });

    });
});



module.exports = app;