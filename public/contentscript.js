var user_typed = ''
document.addEventListener('keypress', function(e){
  if(e.key=='Enter'){
    //get_from_user_typed(user_typed);
    user_typed='';
  }
  else if(e.key==" "){
    //get_from_user_typed(user_typed);
    user_typed += " ";
  }
  else{
    user_typed += e.key;
  }
  console.log("context",user_typed,e);
});
const parseWebPage = () => {
    var stripedHtml = document.body.innerText;
    console.log(stripedHtml);
    var sentence_list = stripedHtml.split(".");
    var sentiment_average=0;
    console.log(sentence_list);
    for (var i = 0; i < sentence_list.length; i++) {
      const handleResponse = (response) => {
        if (response.error) {
          console.log(response.error);
        } else {
          sentiment_average += parseFloat(response.sentiment_score);
        }
      };
      chrome.runtime.sendMessage({message: sentence_list[i]}, handleResponse);
  }
  sentiment_average = parseFloat(sentiment_average) / parseFloat(sentence_list.length);
  var op1='';
  if(sentiment_average>=0){
    op1="Hello The Site is Safe to Use";
  }
  else{
    op1="Hello The Site is Offensive";
  }
  alert(op1);

  console.log(op1);
}


parseWebPage();

