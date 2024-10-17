const express = require("express")
const socket = require("socket.io")
const http =  require("http")

const app = express();
const PORT = 3000
const server = http.createServer(app)

app.use(express.static(`${__dirname}/../frontend`)); 

const io = socket(server)

server.on('error', (err) => console.error(err))
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))

backendPlayers = {}
gameRoom = {}

const apiUrl = 'http://localhost/restapi/api.php'

const roundCountdown = () => {
  return new Promise((resolve) => {
    let roundCountdown = 5
    const roundCountdownInterval = setInterval(() => {
      io.emit('roundCountdown', roundCountdown); 
      roundCountdown--;
      
      if (roundCountdown < 0) {
        clearInterval(roundCountdownInterval);
        resolve()
      }
    }, 1000)

  })
}

const startGame = async (data) => {
  let round = 1
  while (round < 5) {
    await roundCountdown()
    io.emit('gameLoop', data[round]);  
    round++
  }
}

const getBrands = async () => {
  await fetch(apiUrl, { method: 'GetRandomBrands' }) 
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    // console.log(response.json())
    return response.json();
  })
  .then(data => {
    
    io.emit('gameLoop', data[0]); 
    startGame(data)
    // console.log(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
} 

io.on("connection", (socket) => {

  socket.on('newUser', (username) => {
    backendPlayers[socket.id] = {
      username: username,
      score: 0,
    }
    socket.emit('user', backendPlayers[socket.id])
    // console.log(backendPlayers)
  })

  socket.on('newGame', (id) => {
    if (!gameRoom[id]) {
      gameRoom[id] = { players: [] }
    }
    gameRoom[id].players.push(backendPlayers[socket.id])
    // console.log(gameRoom)
  })

  socket.on('joinGame', (id) => {
    gameRoom[id].players.push(backendPlayers[socket.id])
    let countdown = 5; 
    const countdownInterval = setInterval(() => {
      io.emit('countdown', countdown); 
      countdown--;

      if (countdown < 0) {
        clearInterval(countdownInterval);
        getBrands()
      }
    }, 1000); 
  })
  
  socket.on('disconnect', () => {
    io.emit('user-disconnected', `${socket.id} has disconnected.`)
    delete backendPlayers[socket.id]
  })
})