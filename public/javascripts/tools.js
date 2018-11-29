let itemGlobal = '';
let userLikesGlobal = {};
let listGlobal = [];

function getUser(user){
 
  return axios.post('/profile/getprofile',{user})
  .then(response =>{
    return response;
    })
  .catch((err)=>{
    console.log(err)
  })
  }



function printCard(userLikes, list){

    console.log(window.info);

    list = list.filter(element=>{
      return !userLikes.likes.includes(element) && !userLikes.dislikes.includes(element);
    })
    item = Math.floor(Math.random()*list.length);
    item = list[item];
    if(list.length > 0){
      itemGlobal = item;
      console.log(item);
      getUser(item)
      .then((response) => { 
        console.log(response.data.profile);
        userLikesGlobal = userLikes;
        listGlobal = list;
        response=response.data.profile;
        
        avatar_img = `https://ca.slack-edge.com/${response.team_id}-${item}-${response.avatar_hash}-1024`;
        console.log(avatar_img);
        document.getElementById('display-image').src=avatar_img;
        document.getElementById('display-name').textContent=response.first_name+' '+response.last_name;
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