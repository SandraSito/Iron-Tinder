window.onload = function () {

  let url = window.location.href;
  let indexUrl = "http://localhost:3000/";
  let herokuUrl = "https://ironhacktinder.herokuapp.com/";

  if(url===indexUrl || url===herokuUrl ){
    document.getElementById('layout-container').classList.add('layout-background');
  }
};
  document.getElementById('register-open').onclick = modalShow;
  document.querySelector('.close-button').onclick = modalHide;

  function modalShow() {
    document.querySelector('.login-modal').style.visibility = 'visible';
    document.querySelector('.login-modal').style.opacity = '1';

  }

  function modalHide() {
    document.querySelector('.login-modal').style.visibility = 'hidden';
    document.querySelector('.login-modal').style.opacity = '0';
  }

