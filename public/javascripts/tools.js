
function getUser(user){
  return new Promise(function(resolve, reject){
    resolve(axios.get(`https://slack.com/api/users.info?token=xoxp-2432150752-348396915687-488368224677-bae207798455aeda1f56ae86de9c94b3&user=${user}&pretty=1`)
    .then(response =>{
      return response.data.user.profile;
    }).catch((err)=>console.log(err))
    )
    reject("tu puta madre")
  }
  )}

 



    
    
  





function printCard(userLikes, list){
  var ok = 0;
  while(ok === 0){
    item = Math.round(Math.random()*list.length-1);
    item = list[item]
    
    if(userLikes.likes.includes(item)||userLikes.dislikes.includes(item)){
      return
    }
    else{
      ok = 1;
      getUser(item)
      .then((response) => { 
        console.log(response)
        avatar_img = `https://ca.slack-edge.com/${response.team}-${
              item
            }-${response.avatar_hash}-1024`;
            console.log(avatar_img)
        document.getElementById('display-image').src=avatar_img;
        document.getElementById('display-name').textContent=response.display_name;

        return response;
        });
      
    }
  }
  
}