datos = window.info


  //USER
  document.getElementById('user-panel-name').textContent=datos.user.display_name;
  document.getElementById('user-panel-image').src=datos.user.avatar_img;

  //CARTAS
  printCard(datos.userLikes,datos.list);

  