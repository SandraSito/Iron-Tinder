let itemGlobal = '';
let userLikesGlobal = {};
let listGlobal = [];

function getUser(user){
  return new Promise(function(resolve, reject){
    resolve(axios.get(`https://slack.com/api/users.info?token=xoxp-2432150752-348396915687-489548355984-1f8f34eda5cc91cf5888cdb8106a5a6b&user=${user}&pretty=1`)
    .then(response =>{
      return response.data.user.profile;
    }).catch((err)=>{
      console.log(err)
    }))
    reject("error")
  })
}


function printCard(userLikes, list){
    list = list.filter(element=>{
      return !userLikes.likes.includes(element) && !userLikes.dislikes.includes(element);
    })
    item = Math.floor(Math.random()*list.length);
    item = list[item];
    if(list.length > 0){
      itemGlobal = item;
      return getUser(item)
      .then((response) => { 
        userLikesGlobal = userLikes;
        listGlobal = list;
        avatar_img = `https://ca.slack-edge.com/${response.team}-${item}-${response.avatar_hash}-1024`;
        document.getElementById('display-image').src=avatar_img;
        document.getElementById('display-name').textContent=response.name;
        document.getElementById('display_displayname').textContent=(`@${response.display_name}`);
        document.getElementById('like-botton').onclick=bottonLike;
        document.getElementById('dislike-botton').onclick=bottonDislike;


        return response;
        });
    }
}


function bottonLike(){
  axios.post('/profile/like',{itemGlobal, userLikesGlobal})
    .then((res)=>{
    printCard(userLikesGlobal, listGlobal)
   })
}

function bottonDislike(){
  axios.post('/profile/dislike',{itemGlobal, userLikesGlobal})
    .then((res)=>{
    printCard(userLikesGlobal, listGlobal);
    return res;
   }).catch((err)=>console.log(err))
}