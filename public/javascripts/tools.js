let itemGlobal = '';
let userLikesGlobal = {};
let listGlobal = [];

function getUser(user) {

  return axios.post('/profile/getprofile', { user })
    .then(response => {
      return response;
    })
    .catch((err) => {
      console.log(err)
    })
}



function printCard(userLikes, list) {
  console.log(list);
  list = list.filter(element => {
    return !userLikes.likes.includes(element) && !userLikes.dislikes.includes(element);
  })
  console.log(list);
  item = Math.floor(Math.random() * list.length);
  item = list[item];
  if (list.length > 0) {
    itemGlobal = item;
    getUser(item)
      .then((response) => {
        userLikesGlobal = userLikes;
        listGlobal = list;
        response = response.data.profile;
        avatar_img = `https://ca.slack-edge.com/${response.team_id}-${item}-${response.avatar_hash}-1024`;
        document.getElementById('display-image').src = avatar_img;
        document.getElementById('display-name').textContent = response.first_name + ' ' + response.last_name;
        if (response.display_name) {
          document.getElementById('display_displayname').textContent = (`@${response.display_name}`);
        }
        return response;
      });
  } else {
    avatar_img = '/images/not-profile.jpg';
    document.getElementById('display-image').src = avatar_img;
    document.getElementById('display-name').textContent = 'No hay mas usuarios disponibles';
    document.getElementById('display_displayname').textContent = '';
  }
}

document.getElementById('like-botton').onclick = bottonLike;
document.getElementById('dislike-botton').onclick = bottonDislike;

function bottonLike() {
  let likes = '';
  axios.post('/profile/like', { itemGlobal, userLikesGlobal })
    .then((message) => {
       likes = message.data.response
      axios.post('/profile/match',{ itemGlobal, userLikesGlobal })
      .then(()=>{

        printCard(likes, listGlobal)
      })

    }).catch((err) => console.log(err))
}

function bottonDislike() {
  axios.post('/profile/dislike', { itemGlobal, userLikesGlobal })
    .then((message) => {
      let dislikes = message.data.response;
      printCard(dislikes, listGlobal);
    }).catch((err) => console.log(err))
}