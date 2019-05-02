// var createError = require('http-errors');
// var express = require('express');
// var http = require('http').Server(app);
// var io = require('socket.io')(http);
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// var indexRouter = require('./routes/index');

// var app = express();

// // view engine setup

// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');
// app.set('views', path.join(__dirname, 'views'));

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// io.on('connection', function(socket){
//   console.log('an user connected');
// });

// app.use('/', indexRouter);
// //app.use('/users', usersRouter);


// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// module.exports = app;

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

// view engine setup
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});


var players = {playerPoints:0};
var numPlayers = 0;
var lowest_score = 35;

let playerWinning;
let playersPlayed = 0;
let prevLowScore;


//socket.io

io.on('connection', function(socket){

  console.log("user connected")

  socket.on('chat_message', function(msg){
    io.emit('chat_message', msg);
  });

  //set username
  socket.on('set_username', function(username) {
    if (Object.values(players).includes(username)) {
		socket.emit("username_set", "usernameTaken"); //username success
		console.log("Username taken " + username);
    }
    else {

	numPlayers++;
	    
    	players[socket.id] = username;
	    socket.emit("username_set", "success"); //username success
	    io.emit("log", username + " connected");
	    console.log("Username has set name = " + username);

	    //
	   // io.emit("update_list", );
		
// checking for 4 players	    
	if (numPlayers == 4) {
   	  io.emit('begin_Game');
   	 }
   	 else{
  	    io.emit('waiting_for_players', numPlayers);
  	  }

	    
	    
    }
  });
	
// setting each individual score to corresponding player
    socket.on('player_Points',function(playerPoints){
        players["playerPoints"] = playerPoints;
    });
	
	
// setting the score to beat 
   socket.on('disp_scoreToBeat',function(scoreToBeat){
      playersPlayed++;
      console.log("players played: "+ playersPlayed);

      if(lowest_score >= scoreToBeat){
        prevLowScore = lowest_score;
        lowest_score = scoreToBeat;
      }
      
      // console.log("prev: "+ prevLowScore);
      console.log("beat: "+ lowest_score);
  });
	
	
// checking for winner and sending it over server
   socket.on('check_Winner',function(){
     if(players["playerPoints"] == lowest_score && players["playerPoints"] != prevLowScore){

        playerWinning = players[socket.id];
        
     }
     console.log(playerWinning + " wins");

     if(playersPlayed == 4){
        io.emit('winner', playerWinning);
     }
   });
	
	
	

  //disconnect
  socket.on("disconnect", function(){
	io.emit("log", players[socket.id] + " has quit.");
	delete players[socket.id];
	  numPlayers--;
  });	

});

//end of socket.io

http.listen(3000, function(){
  console.log('listening on *:3000');
});


module.exports = app;
