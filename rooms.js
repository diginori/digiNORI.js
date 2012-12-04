var Chat = require('./chat');
var PlayCount = 1;

module.exports = function(app) {
  var io = require('socket.io').listen(app);
  
  io.configure(function(){
    io.set('log level', 3);
    io.set('transports', [
        'websocket'
      , 'flashsocket'
      , 'htmlfile'
      , 'xhr-polling'
      , 'jsonp-polling'
    ]);
  });

  var Room = io
    .of('/room')
    .on('connection', function(socket) {
      var joinedRoom = null;
      socket.on('join', function(data) {
        if (Chat.hasRoom(data.roomName)) {
          joinedRoom = data.roomName;
          socket.join(joinedRoom);
          socket.emit('joined', {
            isSuccess:true, nickName:data.nickName
          });
          socket.broadcast.to(joinedRoom).emit('joined', {
            isSuccess:true, nickName:data.nickName
          });
          Chat.joinRoom(joinedRoom, data.nickName);
        } else {
          socket.emit('joined', {isSuccess:false});
        }
      });

      socket.on('message', function(data) {
        
        console.log("data.msg:"+data.msg);

        //digiNORI Start
        var sys = require('sys')
        var exec = require('child_process').exec;
        function puts(error, stdout, stderr) { sys.puts(stdout) }
        
        if(data.msg == "c"){
          exec("afplay ./sound/chu04.aif &", puts);
        }

        if(data.msg == "j"){
          exec("afplay ./sound/j7.aif &", puts);
        }

        if(data.msg == "b"){
          exec("afplay ./sound/b1.aif &", puts);
        }

        if(data.msg == "k"){
          exec("afplay ./sound/kkM1.aif &", puts);
        }

        if(data.msg == "g"){
          exec("afplay ./sound/jgS3_80.aif &", puts);
        }
        
        PlayCount = PlayCount + 1;

        console.log("PlayCount:"+PlayCount);
        //digiNORI End

        if (joinedRoom) {
          socket.broadcast.to(joinedRoom).json.send(data);
        } 
      });

      socket.on('leave', function(data) {
        if (joinedRoom) {
          Chat.leaveRoom(joinedRoom, data.nickName);
          socket.broadcast.to(joinedRoom).emit('leaved', {
            nickName:data.nickName
          });
          socket.leave(joinedRoom);
        }
      });

    });
}
