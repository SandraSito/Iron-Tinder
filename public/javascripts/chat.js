let mainUser;
let invitedUser;
let messagesInterval;
let idChat;

document.querySelector('.open-chat').onclick = openChat;
document.getElementById('close-chat').onclick = closeChat;
document.getElementById('send-message').onclick = sendChat;




function openChat() {

  document.querySelector('.chat-window').style.display = 'block';
  mainUser = document.querySelector('#miId').innerHTML;
  invitedUser = document.querySelector('#otroId').innerHTML;

  llamada(mainUser, invitedUser).then((res) => {
    idChat = res.data.chat[0]._id;
    pintarMensajes(idChat)

  });

}


function llamada(mainUser, invitedUser) {
  return axios.post('/chat', { mainUser, invitedUser })
    .then((response) => {
      return response;
    })
}

function pintarMensajes(idChat) {
  let write = document.getElementById('messages-container');
  
  messagesInterval = setInterval(function () {
    axios.post('/chat/print', { idChat })
      .then((response) => {
        let msnArray = response.data.respuesta;
        write.innerHTML = '';
        msnArray.forEach(element => {
          write.innerHTML += `<div>${element.message}</div>`;

        });
        return response;
      })


  }.bind(this), 500)

}

function sendChat() {
  let message = document.getElementById('input-message').value;
  document.getElementById('input-message').value=" ";
  return axios.post('/chat/send', { mainUser, idChat, message })
    .then((response) => {
      return response.message;
    })
}

function closeChat() {
  clearInterval(messagesInterval);
  document.querySelector('.chat-window').style.display = 'none';
}





