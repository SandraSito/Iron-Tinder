
function getUser(user){
  return new Promise(function(resolve, reject){
    resolve(axios.get(`https://slack.com/api/users.info?token=xoxp-2432150752-348396915687-490239067874-df2e76273b19f9ee063d88c9744479de&user=${user}&pretty=1`)
    .then(response =>{
      return response.data.user.profile;
    }).catch((err)=>{
      console.log(err)
      console.log(user)
    }))
    reject("tu puta madre")
  })
}


function printCard(userLikes, list){
  var ok = 0;
  while(ok === 0){
    item = Math.floor(Math.random()*list.length);
    item = list[item]
    console.log(item)
    if(userLikes.likes.includes(item)||userLikes.dislikes.includes(item)){
      printCard(userLikes, list)
    }
    else{
      ok = 1;
      return getUser(item)
      .then((response) => { 
        avatar_img = `https://ca.slack-edge.com/${response.team}-${item}-${response.avatar_hash}-1024`;
        document.getElementById('display-image').src=avatar_img;
        document.getElementById('display-name').textContent=response.name;
        document.getElementById('display_displayname').textContent=(`@${response.display_name}`);

        document.getElementById('like-botton').onclick=bottonLike();
        document.getElementById('dislike-botton').onclick=bottonDislike()
        return response;
        });
    }
  }
}

function bottonLike(){

}

function bottonDislike(){

}