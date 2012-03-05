var app = require('express').createServer();
var fs  = require('fs');
var io = require('socket.io').listen(app);
var player = require('./player.js');
var spell = require("./spell.js");

app.listen(42002);

app.get('/:file.:ext', function (req, res){
    //console.log(req.url);
    var path = '/client/'
    fs.readFile(__dirname + path + req.params.file + '.' + req.params.ext,
                function (err, data) {
                    if (err) {
                        res.writeHead(500);
                        return res.end('Error loading ' + req.params.file+'.'+req.params.ext);
                    }
		    
                    var mimetype = '';
                    if (req.params.ext == 'html') mimetype = 'text/html';
                    if (req.params.ext == 'css') mimetype = 'text/css';
                    if (req.params.ext == 'js') mimetype = 'text/javascript';
                    if (req.params.ext == 'png') mimetype = 'image/png';
                    if (req.params.ext == 'json') mimetype = 'text/javascript';
                    res.writeHead(200, { 'Content-Type': mimetype });
                    res.end(data, 'utf-8');
                });
});

io.sockets.on('connection', function (socket) {
    var p = player.create({
        'socket': socket,
    });
    socket.on('get spell list', function () {
        socket.emit('spell list', spell.clientList);
    });
});
