var token,
    currenturl,
    lasturl,
    currentColor,
    i = 0,
    countIds,
    temparray,
	  color_info,
	  allhref = [],
    lastHrefCount,
    currentHrefCount,
    chunk = 900
	  vkApiVersion = "5.0";

setInterval(checkUrl, 500);
setInterval(checkLinksCount, 100);

function showfriends() {
  chrome.storage.local.get({
      'vkaccess_token': {}
  }, function(items) {
      // console.log(items.vkaccess_token)});
      if (items.vkaccess_token.length === undefined) {
		showPopUp("Авторизуйтесь! Для авторизации зайдите в параметры и нажмите кнопку Авторизации.")
		console.log("[ВКорешах]Авторизуйтесь! Для авторизации зайдите в параметры и нажмите кнопку Авторизации.");

      } else {
          token = items.vkaccess_token;
          chrome.storage.local.get({
              'currentColor': {}
          }, function(result) {
              if (typeof(result.currentColor) == "object" || result.currentColor == "#NANNANNAN") {
                  currentColor = "#008000";
              } else {
                  currentColor = result.currentColor;
              }
          });

    			chrome.runtime.sendMessage("get color info", function(response) {
    				color_info = response
    				// console.log(response)
    			})

    			var regex = /vk.com\/([|.|_|\w]+)/;
    			for (var i = 0; i < document.links.length; i++) {
    				var href = document.links[i].href
    				var match = regex.exec(href);
    				if (match !== null && match.length > 1) {
    					allhref.push(match[1]);
    				}
    			}

		      getAllUsers();
      }
  });
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

function getAllUsers() {
    countIds = allhref.length;

    if (i < countIds) {
        temparray = allhref.slice(i, i + chunk);
		// console.log(temparray);
        i += chunk;
        documentSaveRequest = new XMLHttpRequest();
        getAreFriendsUrl = 'user_ids=' + temparray + '&fields=online, domain, friend_status, blacklisted, blacklisted_by_me&v=' + vkApiVersion + '&access_token=' + token;
		// console.log(getAreFriendsUrl);
        documentSaveRequest.open('POST', 'https://api.vk.com/method/users.get', true);
        documentSaveRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        documentSaveRequest.onreadystatechange = function() {
            if (documentSaveRequest.readyState === 4) {
                var friendsList = JSON.parse(documentSaveRequest.responseText);

    				if(typeof(friendsList.response) == "undefined"){showPopUp("Произошла ошибка! Скорее всего мы не можем получить ответ от VK.COM")}else{

    					// console.log(friendsList);

    					for (var i = 0; i < document.links.length; i++) {
    						var href = document.links[i].href
    						href = href + '.'

    						for (var l = 0; l < friendsList.response.length; l++){
    							var friendID = 'vk.com\/id' + friendsList.response[l].uid + '.'
    							var friendDomain = 'vk.com\/' + friendsList.response[l].domain + '.'
    							// console.log(friendDomain + " " + friendID + " " + href);
    							if (href.includes(friendID) || href.includes(friendDomain)) {
    								// console.log(friendDomain + " " + friendID + " " + href)
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
    					if (temparray.length < chunk) {
    						//showPopUp("Все друзья показаны.")
    						console.log("[ВКорешах]Все друзья показаны!");
    					} else {
    						getAllUsers();
    					}

    				}
			    }
        }
        documentSaveRequest.send(getAreFriendsUrl);
    }
}

function checkUrl() {
    currenturl = window.location.href;
    // console.log("current url " + currenturl + "last url " + lasturl);
    if (currenturl != lasturl){
        i = 0;
        showfriends();
    }
    lasturl = window.location.href;
}

function checkLinksCount() {
    currentHrefCount = document.links.length;
    //console.log("current href " + currentHrefCount + "last href " + lastHrefCount);
    if (currentHrefCount != lastHrefCount){
        i = 0;
        showfriends();
    }
    lastHrefCount = document.links.length;
}
