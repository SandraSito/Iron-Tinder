window.onload = function () {

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
};
