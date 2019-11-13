var token,
    currenturl,
    lasturl,
    i = 0,
    countIds,
    temparray,
    debug_setting,
	  color_info,
    online_setting,
    lastHrefCount = 0,
    currentHrefCount = 0,
    chunk = 900
	  vkApiVersion = "5.103";


init()

function init(){
  chrome.runtime.sendMessage("get debug setting", function(response) {
    debug_setting = response
  })
  chrome.runtime.sendMessage("get color info", function(response) {
    color_info = response
  })

  chrome.runtime.sendMessage("get online setting", function(response) {
    online_setting = response
  })

  chrome.storage.local.get({'vkaccess_token': {}}, function(response) {
    token = response.vkaccess_token

    setInterval(checkLinksCount, 100);
  })
}

function showfriends() {
  if (token.length === undefined) {
    sendInfoToUser("Авторизуйтесь! Для авторизации зайдите в параметры и нажмите кнопку Авторизации.")
  } else {
      var docLinks = document.links
  		var correct_links = filterLinks(docLinks)
      coloringAllUsers(correct_links);
  }
}

function filterLinks(Links){
  var regex = /vk.com\/([|.|_|\w]+)/;
  var correct_href = [];
  for (var i = 0; i < Links.length; i++) {
    var href = Links[i].href
    var match = regex.exec(href);
    if (match !== null && match.length > 1) {
      correct_href.push(match[1]);
    }
  }
  return correct_href
}

function sendInfoToUser(Message) {
  if (debug_setting.PopUpNotify == "true") showPopUp(Message)
  if (debug_setting.ConsoleLog == "true") console.log(Message);
}

function showPopUp(Message) {
  var element = document.createElement('div');
  element.innerHTML = '<style type="text/css">#msg_pop{color: white;background-color: rgba(0, 0, 0, 0.7);display: none;position: fixed;z-index: 99999;bottom: 30px;left:30px;width: 250px;padding: 10px;font-size:13px;-webkit-box-shadow: 0px 0px 10px #999;-moz-box-shadow: 0px 0px 10px #999;box-shadow: 0px 0px 10px #999;-webkit-border-radius: 5px;-moz-border-radius: 5px;border-radius: 5px;}#msg_pop h4{margin:0;text-align:center;font-size:15px;}#msg_close{display:block;position:absolute;top:5px;right:10px;line-height:15px;width:16px;height:16px;text-align:center;color:#fff;cursor:pointer;-webkit-border-radius: 10px;-moz-border-radius: 10px;-ms-border-radius: 10px;-o-border-radius: 10px;border-radius: 10px;}#msg_close:hover {background-color:#fff;color:#000;}.fadeIn{animation-name: fadeIn;-webkit-animation-name: fadeIn; animation-duration: 0.4s; -webkit-animation-duration: 0.4s;animation-timing-function: ease-in-out; -webkit-animation-timing-function: ease-in-out;     visibility: visible !important; }@keyframes fadeIn {0% {transform: scale(0.7);opacity: 0.5;}80% {transform: scale(1.1);}       100% {transform: scale(1);opacity: 1;}       }@-webkit-keyframes fadeIn {0% {-webkit-transform: scale(0.7);opacity: 0.5;}80% {-webkit-transform: scale(1.1);}       100% {-webkit-transform: scale(1);opacity: 1;}       }</style><div id="msg_pop"><h4>ВКОРЕШАХ</h4>' + Message + '</div>';
  document.body.appendChild(element);

  var msg_pop = document.getElementById('msg_pop');
  document.getElementById('msg_pop').style.display='block';document.getElementById('msg_pop').className += 'fadeIn';
  setTimeout(function() {
      element.parentNode.removeChild(element);
    }, 2000);
}

function coloringAllUsers(Links) {
    countIds = Links.length;

    if (i < countIds) {
        temparray = Links.slice(i, i + chunk);
        i += chunk;
        documentSaveRequest = new XMLHttpRequest();
        getAreFriendsUrl = 'user_ids=' + temparray + '&fields=online, domain, friend_status, blacklisted, blacklisted_by_me&v=' + vkApiVersion + '&access_token=' + token;
        documentSaveRequest.open('POST', 'https://api.vk.com/method/users.get', true);
        documentSaveRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        documentSaveRequest.onreadystatechange = function() {
          if (documentSaveRequest.readyState === 4) {
            var friendsList = JSON.parse(documentSaveRequest.responseText);

            if(typeof(friendsList.response) == "undefined"){
              sendInfoToUser("Произошла ошибка! Скорее всего мы не можем получить ответ от VK.COM")
            }else{
            	for (var i = 0; i < document.links.length; i++) {
                if(document.links[i].tagName == "A" && document.links[i].childElementCount == 0){


              		var href = document.links[i].href
              		href = href + '.'

              		for (var l = 0; l < friendsList.response.length; l++){
              			var friendID = 'vk.com\/id' + friendsList.response[l].uid + '.'
              			var friendDomain = 'vk.com\/' + friendsList.response[l].domain + '.'
              			if (href.includes(friendID) || href.includes(friendDomain)) {

                      if(online_setting.online_on == "true" && friendsList.response[l].online == 1){
                        if(online_setting.mobile_online_on == "true" && friendsList.response[l].online_mobile == 1){
                            document.links[i].insertAdjacentHTML('beforeend','<div style="display: inline-block;margin-left: 4px;border-radius: 3px;bottom: 0;width: 8px;height: 12px;background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgNyAxMSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICAgIDxnIGlkPSJTeW1ib2xzIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0iIzhBQzE3NiIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0ib25saW5lIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjAzLjAwMDAwMCwgLTQyMi4wMDAwMDApIj4KICAgICAgICAgICAgPHBhdGggZD0iTTIwMyw0MjMuNTA2NDM5IEMyMDMsNDIyLjY3NDQ1NiAyMDMuNjcxMTg5LDQyMiAyMDQuNTAxNjc2LDQyMiBMMjA4LjQ5ODMyNCw0MjIgQzIwOS4zMjc2NzcsNDIyIDIxMCw0MjIuNjcxNTQxIDIxMCw0MjMuNTA2NDM5IEwyMTAsNDMxLjQ5MzU2MSBDMjEwLDQzMi4zMjU1NDQgMjA5LjMyODgxMSw0MzMgMjA4LjQ5ODMyNCw0MzMgTDIwNC41MDE2NzYsNDMzIEMyMDMuNjcyMzIzLDQzMyAyMDMsNDMyLjMyODQ1OSAyMDMsNDMxLjQ5MzU2MSBMMjAzLDQyMy41MDY0MzkgWiBNMjA0LDQyNCBMMjA5LDQyNCBMMjA5LDQzMCBMMjA0LDQzMCBMMjA0LDQyNCBaIiBpZD0ibW9iaWxlX20iLz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==);"></div>')
                        }else{
                          document.links[i].insertAdjacentHTML('beforeend','<div style="background: #8ac176;display: inline-block;bottom: 0;width: 8px;margin-left: 4px;border-radius: 100%;height: 8px;"></div>')
                        }
                      }

              				switch(friendsList.response[l].friend_status) {
              				  case 0:  //когда не в друзьях
              					if (friendsList.response[l].blacklisted == 1 && friendsList.response[l].blacklisted_by_me == 0 && color_info.ColorOn6 == 'true'){ //вы в чс
              						document.links[i].style.color = color_info.color6;
              						document.links[i].style.textDecoration = color_info.mode6;
              					} else if (friendsList.response[l].blacklisted == 0 && friendsList.response[l].blacklisted_by_me == 1 && color_info.ColorOn5 == 'true'){ //он в чс
              						document.links[i].style.color = color_info.color5;
              						document.links[i].style.textDecoration = color_info.mode5;
              					} else if (friendsList.response[l].blacklisted == 1 && friendsList.response[l].blacklisted_by_me == 1 && color_info.ColorOn7 == 'true'){ //взаимный чс в чс
              						document.links[i].style.color = color_info.color7;
              						document.links[i].style.textDecoration = color_info.mode7;
              					} else if (color_info.ColorOn4 == 'true'){
              						document.links[i].style.color = color_info.color4;
              						document.links[i].style.textDecoration = color_info.mode4;
              					}
              					break

              				  case 1:  //когда вы подписаны
              						if (color_info.ColorOn2 == 'true'){
              							document.links[i].style.color = color_info.color2;
              							document.links[i].style.textDecoration = color_info.mode2;
              						}
              					break

              				  case 2:  //когда он на нас подписан
              						if (color_info.ColorOn3 == 'true'){
              							document.links[i].style.color = color_info.color3;
              							document.links[i].style.textDecoration = color_info.mode3;
              						}
              					break

              				  case 3:  // когда в друзьях
              						if (color_info.ColorOn1 == 'true'){
              						document.links[i].style.color = color_info.color1;
              						document.links[i].style.textDecoration = color_info.mode1;
              						}
              					break

              				  default:
              				}

              				if (href == "https://vk.com/kr3nd31." || href == "https://vk.com/id59234599.") {
              				document.links[i].style.color = "#FFC300";
              				document.links[i].style.fontWeight = "bold";
              				}
              			}
              		}
                }
            	}
            	if (temparray.length < chunk) {
                sendInfoToUser("Все друзья показаны!")
            	} else {
            		coloringAllUsers();
            	}

}
          }
        }
        documentSaveRequest.send(getAreFriendsUrl);
    }
}

function checkLinksCount() {
    currenturl = window.location.pathname;
    currentHrefCount = document.links.length;
    if (currentHrefCount != lastHrefCount){
        if (currenturl != lasturl){
            i = 0; // если перешли на новую страницу
        }else{
            i = lastHrefCount; //что бы каждый раз когда появлялись новые ссылки не чекало все заново, а чекало только новые ссылки
        }
        showfriends();
    }
    lasturl = window.location.pathname;
    lastHrefCount = document.links.length;
}
