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
    io.emit('startGame', gameRoom)
  })
  
  socket.on('disconnect', () => {
    io.emit('user-disconnected', `${socket.id} has disconnected.`)
    delete backendPlayers[socket.id]
  })
})