(() => {
  const socket = io();
  // socket.on('user-connected', (text) => alert(text))
  // socket.on('welcome', (text) => alert(text))

  window.onload = () => {
    document.querySelector('#btn-createUsername').addEventListener('click', (e) => {
      e.preventDefault()
      socket.emit('newUser', document.querySelector('#input-username').value)
      document.querySelector('#username-container').style.display = 'none'
      document.querySelector('#menu-container').style.display = 'flex'
      
    })
    
    document.querySelector('#btn-createGame').addEventListener('click', (e) => {
      e.preventDefault()
      var id = Math.random().toString(16).slice(2);
      socket.emit('newGame', id)
      document.querySelector('#menu-container').style.display = 'none'
      lobby = document.createElement('div')
      heading = document.createElement('h1')
      text = document.createTextNode("Game ID: " + id);
      heading2 = document.createElement('h2')
      text2 = document.createTextNode("Waiting for a user to join...");
      
      lobby.style.display = 'flex'
      lobby.style.flexDirection = 'column'
      lobby.style.justifyContent = 'center'
      lobby.style.alignItems = 'center'
      lobby.style.height = '100vh'
      heading.appendChild(text)
      heading2.appendChild(text2)
      lobby.appendChild(heading)
      lobby.appendChild(heading2)
      
      document.body.appendChild(lobby)
    })
    
    document.querySelector('#btn-joinGame').addEventListener('click', (e) => {
      e.preventDefault()
      socket.emit('joinGame', document.querySelector('#input-gameId').value)
      document.querySelector('#menu-container').style.display = 'none'
    })
  }
  
  socket.on('startGame', (gameRoom) => {
    //countdown for players until game start
    
  })
  
  socket.on('user', (player) => {
    heading = document.createElement('h1')
    heading.style.position = 'absolute'
    heading.style.top = '0'
    username = document.createTextNode("Username: " + player.username)
    heading.appendChild(username)

    document.body.appendChild(heading)
  })
  
  socket.on('user-disconnected', (text) => alert(text))
})();