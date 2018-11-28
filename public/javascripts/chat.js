let myId;
let otherId;

document.querySelector('.open-chat').onclick = openChat;
function openChat() {
  document.querySelector('.chat-window').style.display = 'block';
  myId = document.querySelector('#miId').innerHTML;
  otherId = document.querySelector('#otroId').innerHTML;
  llamada(myId,otherId).then((res) => {
  //  console.log(res);
  }); 
}


function llamada(myId,otherId) {
  // console.log('hola')
  return axios.post('/chat',{mainUser:myId,invitedUser:otherId})
    .then((response) => {
      console.log(response)
      return response;
    })
}







