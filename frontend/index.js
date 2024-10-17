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
  
  socket.on('gameLoop', (brands) => {
    // console.log(brands)
    let countdownDisplay = document.querySelector('#countdown');
    if (countdownDisplay) countdownDisplay.remove();

    let startContainer = document.createElement('div');
    startContainer.style.display = 'flex'
    startContainer.style.flexDirection = 'column'
    startContainer.style.justifyContent = 'center'
    startContainer.style.alignItems = 'center'

    let carImage = document.createElement('img')
    carImage.style.height = '400px'
    carImage.style.width = '400px'
    carImage.setAttribute('src', brands[0].image)

    let brandForm = document.createElement('form')

    let brandAnswer = document.createElement('input')
    brandAnswer.placeholder = 'Guess the brand...'
    brandAnswer.id = 'input-brand'

    let brandButton = document.createElement('button')
    brandButton.className = 'btn'
    brandButton.id = 'btn-brand'
    brandButton.innerText = 'Submit'
    brandButton.type = 'button'
    
    brandForm.appendChild(brandAnswer)
    brandForm.appendChild(brandButton)

    startContainer.appendChild(carImage)
    startContainer.appendChild(brandForm)
    
    document.body.appendChild(startContainer);
    
    document.querySelector('#btn-brand').addEventListener('click', (e) => {
      e.preventDefault()
      if (document.querySelector('#input-brand').value != brands[0].brand) {
        alert("Wrong Guess!")
      }
      else {
        alert("Correct Guess!")
      }
      
    })
    
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