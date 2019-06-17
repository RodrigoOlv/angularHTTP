const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const Product = require('./product.js');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

mongoose.connect(
    'mongodb://localhost:27017/http-client',
    {useNewUrlParser: true}
);

var myLogger = function (req, res, next) {
    console.log(req.body);
    next();
}

app.use(myLogger);

app.get('/products', function (req, res) {
    Product.find().lean().exec(
        (err, prods) => {
            if (err)
                res.status(500).send(err);
            else
                res.status(200).send(prods);
        }
    );
});

app.get('/productserr', function (req, res) {
    setTimeout(() => {
            res.status(500).send({
                msg: 'Error message from the server'
            });
        }, 2000);
});

app.get('/productsdelay', function (req, res) {
    setTimeout(() => {
        Product.find().lean().exec(
            (err, prods) => {
                if (err)
                    res.status(500).send(err);
                else
                    res.status(200).send(prods);
            }
        );
    }, 2000);    
});

app.listen(3000);