(() => {
  const socket = io();
  // socket.on('user-connected', (text) => alert(text))
  // socket.on('welcome', (text) => alert(text))

  window.onload = () => {
    document.querySelector('#btn-createUsername').addEventListener('click', (e) => {
      e.preventDefault()
      if (document.querySelector('#input-username').value == null || document.querySelector('#input-username').value == '') {
        alert("Enter a name")
      }
      else {
        socket.emit('newUser', document.querySelector('#input-username').value)
        document.querySelector('#username-container').style.display = 'none'
        document.querySelector('#menu-container').style.display = 'flex'
      }
      
    })
    
    document.querySelector('#btn-createGame').addEventListener('click', (e) => {
      e.preventDefault()
      var id = Math.random().toString(16).slice(2);
      socket.emit('newGame', id)
      document.querySelector('#menu-container').style.display = 'none'
      lobby = document.createElement('div')
      lobby.id = 'lobby'
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

  socket.on('countdown', (seconds) => {

    let lobby = document.querySelector('#lobby');
    if (lobby) {
      lobby.remove(); 
    }

    let countdownDisplay = document.querySelector('#countdown');
    if (!countdownDisplay) {
      countdownDisplay = document.createElement('h2');
      countdownDisplay.id = 'countdown';
      countdownDisplay.style.position = 'absolute'
      countdownDisplay.style.left = '40%'
      countdownDisplay.style.top = '40%'
      document.body.appendChild(countdownDisplay);
    }
    countdownDisplay.textContent = `Game starts in: ${seconds}`;
  })
  
  socket.on('startGame', (gameRoom) => {
    let countdownDisplay = document.querySelector('#countdown');
    if (countdownDisplay) countdownDisplay.remove();

    let startMessage = document.createElement('div');
    startMessage.style.display = 'flex'
    startMessage.style.justifyContent = 'center'
    let carImage = document.createElement('img')
    carImage.setAttribute('src', '/public/download.png')
    startMessage.appendChild(carImage)
    // startMessage.style.left = '40%'
    // startMessage.style.top = '40%'
    document.body.appendChild(startMessage);
    
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