console.log(window.info)

datos = window.info


  //USER
  document.getElementById('user-panel-name').textContent=datos.user.display_name;
  document.getElementById('user-panel-image').src=datos.user.avatar_img;

  console.log(datos)

  //CARTAS
  printCard(datos.userLikes,datos.list);

  