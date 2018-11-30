let mainUser;
let invitedUser;
let messagesInterval;
let idChat;


document.querySelector(".buttons-container").onclick=openChat;
//document.querySelectorAll('.open-chat').onclick = openChat;
document.getElementById('close-chat').onclick = closeChat;
document.getElementById('send-message').onclick = sendChat;




function openChat(e) {
  
  document.querySelector('.chat-window').style.display = 'flex';
  mainUser = document.querySelector('#miId').textContent;
  console.log('-------------------------------')
  console.log();
  document.getElementById('chat-img-invit').src=e.target.src;
  invitedUser = e.target.id;

  llamada(mainUser, invitedUser).then((res) => {
    idChat = res.data.chat[0]._id;
    console.log('entro chat creado ');
    pintarMensajes(idChat)

  });

}


function llamada(mainUser, invitedUser) {
  return axios.post('/chat', { mainUser, invitedUser })
    .then((response) => {
      return response;
    }).catch(err=>console.log(err))
}

function pintarMensajes(idChat) {
  let write = document.getElementById('messages-container');
  let classColocation = '';
  messagesInterval = setInterval(function () {
    axios.post('/chat/print', { idChat })
      .then((response) => {
        let msnArray = response.data.respuesta;
        write.innerHTML = '';
        let slack_id = response.data.slack_id;
        msnArray.forEach(element => {
          if (element.author_Id == slack_id) {
            classColocation = 'left';
          } else {
            classColocation = 'rigth';
          }
          
          write.innerHTML += `<div class='${classColocation}'>${element.message}</div>`;
          let scroll = document.getElementById('messages-container');
          scroll.scrollTop = scroll.scrollHeight;

        });
        return response;
      })


  }.bind(this), 500)

}

function sendChat() {
  let message = document.getElementById('input-message').value;
  document.getElementById('input-message').value = " ";
  console.log(idChat);
  return axios.post('/chat/send', { mainUser, idChat, message })
    .then((response) => {
      return response.message;
    })
}

function closeChat() {
  clearInterval(messagesInterval);
  document.querySelector('.chat-window').style.display = 'none';
}





