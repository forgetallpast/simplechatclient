var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http,{pingTimeout:60000});
io.origins('*:*')
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
var sid = ''
io.on('connection', function(socket){
  sid = socket.id
  console.log('a user connected');
});
app.get('/xx', function(req,res){
  io.to(sid).emit('customeEmit', 'I just met you')
})
app.get('/send_message', function(req,res){
    console.log(req.query)
    let socketId = req.query.socket
    let content = req.query.content
    console.log(socketId)
    console.log(content)
    if(io.sockets.sockets[socketId]!=undefined){
        console.log('socketId=' + socketId)
        io.to(socketId).emit('customeEmit', content)
        res.json({ code: 0, msg: 'success' })
    }else{
        res.json({code:-1,msg:'socket not exitst'})
    }
})
http.listen(3001, '0.0.0.0',  function(){
  console.log('listening on *:3001');
});
