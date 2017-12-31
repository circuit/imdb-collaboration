/* jslint node: true */
'use strict';

const express = require('express');
const app = express();
const server = require('http').createServer(app);

const port = process.env.PORT || 3200;

// Serve app and modules from simplicity
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));

server.listen(port, _ => console.log(`Server listening at port ${port}`));
