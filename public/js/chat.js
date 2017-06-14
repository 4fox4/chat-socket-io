var socket = io.connect('http://localhost:3000');

var imUser = 'user' + Math.floor((Math.random() * 1000) + 1);

var appUserTitle = document.getElementById('app-title-user');
appUserTitle.innerHTML = imUser;

function handleFiles(files) {
  console.log(files);
  for (var i = 0, file; ((i < files.length) && (file = files[i])); i++) {
    console.log(escape(file.name));
    console.log(file.type);
    if (!file.type.match('image/')) {
      continue;
    }
    var dFile = file.lastModifiedDate;
    var d = new Date();

    var fDate = dFile.getDate();
    var fMonth = dFile.getMonth();
    var fYear = dFile.getFullYear();

    var dDate = d.getDate();
    var dMonth = d.getMonth();
    var dYear = d.getFullYear();

    console.log(fDate, fMonth, fYear);
    console.log(dDate, dMonth, dYear);
    console.log(fDate === dDate);

    if (!(fDate === dDate && fMonth === dMonth && fYear === dYear)) {
      continue;
    }

    var reader = new FileReader();
    reader.onload = (function(theFile) {
      return function(e) {
        console.log(e.target.result);
        console.log(escape(theFile.name));
        socket.emit('clientsendimage', { user: imUser, name: theFile.name + '.base64', data: e.target.result });
      };
    })(file);
    reader.readAsDataURL(file);
  }
}

socket.emit('userconnect', { user: imUser });

socket.on('userconnect', function (data) {
  console.log(data);
});

socket.on('serversend', function (data) {
  var fit;
  var fitContent;
  if (data.user === imUser) {
    fit = 'fitend';
    fitContent = 'fitright';
  } else {
    fit = 'fitstart';
    fitContent = 'fitleft';
  }
  var chat = document.getElementById('app-chat');
  var messageContainer = document.createElement('div');
  var userMessage = document.createElement('div');
  var message = document.createElement('div');
  var divFullUser = document.createElement('div');
  var divFullMessage = document.createElement('div');

  messageContainer.classList.add('message-container', fitContent);

  userMessage.classList.add('user-message', fit);
  userMessage.innerHTML = data.user;

  divFullUser.classList.add('div-full', fit);
  divFullUser.appendChild(userMessage);

  message.classList.add('message', fit);
  message.innerHTML = data.message;

  divFullMessage.classList.add('div-full', fit);
  divFullMessage.appendChild(message);

  messageContainer.appendChild(divFullUser);
  messageContainer.appendChild(divFullMessage);

  chat.appendChild(messageContainer);

  console.log(data);
});

socket.on('serveredit', function (data) {
  console.log(data);
});

socket.on('serversendimage', function (data) {
  var fit;
  var fitContent;
  if (data.user === imUser) {
    fit = 'fitend';
    fitContent = 'fitright';
  } else {
    fit = 'fitstart';
    fitContent = 'fitleft';
  }
  var chat = document.getElementById('app-chat');
  var messageContainer = document.createElement('div');
  var userMessage = document.createElement('div');
  var message = document.createElement('div');
  var image = document.createElement('img');
  var divFullUser = document.createElement('div');
  var divFullMessage = document.createElement('div');

  messageContainer.classList.add('message-container', fitContent);

  userMessage.classList.add('user-message', fit);
  userMessage.innerHTML = data.user;

  divFullUser.classList.add('div-full', fit);
  divFullUser.appendChild(userMessage);

  image.setAttribute('src', data.data);
  image.classList.add('message-image');

  var aDiv = document.createElement('div');
  aDiv.appendChild(image);

  message.classList.add('message', fit);
  message.appendChild(aDiv);

  divFullMessage.classList.add('div-full', fit);
  divFullMessage.appendChild(message);

  messageContainer.appendChild(divFullUser);
  messageContainer.appendChild(divFullMessage);

  chat.appendChild(messageContainer);

  console.log(data);
});

function key(e) {
  console.log(e);
  var message = e.target.value;
  if (e.charCode === 13 && message.length > 0) {
    socket.emit('clientsend', { user: imUser, message: message });
    var input = document.getElementById('input-chat');
    input.value = '';
  } else {
    socket.emit('clientedit', { user: imUser });
  }
}

function sendMessage() {
  var inputChat = document.getElementById('input-chat');
  var message = inputChat.value;
  if (message.length > 0) {
    socket.emit('clientsend', { user: imUser, message: message });
    inputChat.value = '';
  }
}
