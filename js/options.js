window.addEventListener('load', function() {
   waitingAnimation(1);
});


function waitingAnimation(state, callback = null) {
  var $preloader = $('#p_prldr'),
      $svg_anm   = $preloader.find('.svg_eye');
  if (state){
      $svg_anm.fadeOut();
      $preloader.fadeOut('slow', callback);
  }else{
      $svg_anm.fadeIn();
      $preloader.fadeIn('slow', callback);
  }
};

chrome.storage.local.get(["ColorOn1"], (result) => {
  if (result["ColorOn1"] == undefined){
    clear_options();
  }
});

// if (localStorage["ColorOn1"] == undefined) {
// 	clear_options();
// }

function clear_options() {
  data = {}

  for(let i=1;i<=7;i++)
  {
    data["color"+i] = ""
    data["mode"+i] = ""
  }

	data["online_on"] = ""
	data["mobile_online_on"] = ""

	data["popup_notify"] = "true"
	data["console_log"] = "true"

  chrome.storage.local.set(data, () => {})

  restore_options()
}

function restore_options() {
  chrome.storage.local.get(
    ['ColorOn1', 'ColorOn2', 'ColorOn3','ColorOn4','ColorOn5','ColorOn6','ColorOn7',
    'color1','color2','color3','color4','color5','color6','color7',
    'mode1','mode2','mode3','mode4','mode5','mode6','mode7',
    'online_on', 'mobile_online_on', 'popup_notify', 'console_log'], (result) => {


    for(let i=1;i<=7;i++)
      {
        document.getElementById("ColorOn"+i).checked = checkBool(result["ColorOn"+i])
    
        if(!checkBool(result["ColorOn"+i])){
          document.getElementById("menu"+i).style.display = "none";
        }
    
        document.getElementById("textcolor"+i).style.color = result["color"+i]
    
        document.getElementById("textcolor"+i).style.textDecoration = result["mode"+i]
      }
    
      document.getElementById("PopUpNotify").checked = checkBool(result["popup_notify"])
      document.getElementById("ConsoleLog").checked = checkBool(result["console_log"])
    
      if(checkBool(result["online_on"])){
        document.getElementById("OnlineOn").checked = true
        document.getElementsByClassName("vk_online")[0].style.display = "inline-block";
        document.getElementById("MobileOnlineOn_Container").style.display = "block";
      }else{
        document.getElementById("OnlineOn").checked = false
        document.getElementsByClassName("vk_online")[0].style.display = "none";
        document.getElementById("MobileOnlineOn_Container").style.display = "none";
      }
    
      if(checkBool(result["mobile_online_on"])){
        document.getElementById("MobileOnlineOn").checked = true
        document.getElementsByClassName("vk_mobile_online")[0].style.display = "inline-block";
      }else{
        document.getElementById("MobileOnlineOn").checked = false
        document.getElementsByClassName("vk_mobile_online")[0].style.display = "none";
      }
    
      for(let i=1;i<=7;i++)
      {
        switch (result["mode"+i]) {
          case "none":
            document.getElementById("none"+i).checked = true
            break;
          case "underline":
            document.getElementById("under_line"+i).checked = true
            break;
          case "line-through":
            document.getElementById("through_line"+i).checked = true
            break;
          default:
            document.getElementById("none"+i).checked = true
          }
      } 
    
      consolem("Настройки загружены!")
  })

  
}

function change_color(num) {
  current_color = document.getElementById("out_html_color").innerText
  // localStorage["color" + num] = current_color
  document.getElementById("textcolor" + num).style.color = current_color

  data = {}
  data["color" + num] = current_color

  chrome.storage.local.set(data);
}

function change_mode(num, mode) {
  data = {}

  switch (mode) {
	case 0:
		data["mode" + num] = "none"
		document.getElementById("textcolor" + num).style.textDecoration = "none"
		break;
	case 1:
		data["mode" + num] = "underline"
		document.getElementById("textcolor" + num).style.textDecoration = "underline"
		break;
	case 2:
		data["mode" + num] = "line-through"
		document.getElementById("textcolor" + num).style.textDecoration = "line-through"
		break;
	default:
		data["mode" + num] = "none"
		document.getElementById("textcolor" + num).style.textDecoration = "none"
  }

  chrome.storage.local.set(data);
}


function checkBool(x) { if(x == "true" || x == true || x == 1) {return true;} else {return false;} }

function consolem(text_in){
  document.getElementById("console").innerText = text_in;
}

document.addEventListener("DOMContentLoaded", restore_options)

document.getElementById("clear").addEventListener("click", clear_options)

for(let i=1;i<=7;i++)
{
  document.getElementById("color"+i).addEventListener("click", function() {change_color(i); consolem("Цвет "+i+" изменен!")}, false)
  document.getElementById("none"+i).addEventListener("click", function() {change_mode(i, 0); consolem("Модификатор "+i+" убран!")}, false)
  document.getElementById("under_line"+i).addEventListener("click", function() {change_mode(i, 1); consolem("Модификатор "+i+" изменен на подчеркивание!")}, false)
  document.getElementById("through_line"+i).addEventListener("click", function() {change_mode(i, 2); consolem("Модификатор "+i+" изменен на зачеркивание!")}, false)

  document.getElementById("ColorOn"+i).addEventListener("change", function() {
    data = {}
    data["ColorOn"+i] = document.getElementById("ColorOn"+i).checked;
    chrome.storage.local.set(data);
    // localStorage["ColorOn"+i] = document.getElementById("ColorOn"+i).checked;
    if(document.getElementById("ColorOn"+i).checked){
      document.getElementById("menu"+i).style.display = "block";
    }else{
      document.getElementById("menu"+i).style.display = "none";
    }
    consolem("Выделение "+i+" изменено!")}, false)
}

document.getElementById("OnlineOn").addEventListener("change", function() {
  chrome.storage.local.set({'online_on' : document.getElementById("OnlineOn").checked});
	// localStorage["online_on"] = document.getElementById("OnlineOn").checked;
	if(document.getElementById("OnlineOn").checked){
		document.getElementById("MobileOnlineOn_Container").style.display = "block";
		document.getElementsByClassName("vk_online")[0].style.display = "inline-block";
	}else{
		document.getElementsByClassName("vk_online")[0].style.display = "none";
		document.getElementById("MobileOnlineOn_Container").style.display = "none";
	}
	consolem("Показывать онлайн изменено!")
}, false)

document.getElementById("MobileOnlineOn").addEventListener("change", function() {
  chrome.storage.local.set({'mobile_online_on' : document.getElementById("MobileOnlineOn").checked});
	// localStorage["mobile_online_on"] = document.getElementById("MobileOnlineOn").checked;
	if(document.getElementById("MobileOnlineOn").checked){
		document.getElementsByClassName("vk_mobile_online")[0].style.display = "inline-block";
	}else{
		document.getElementsByClassName("vk_mobile_online")[0].style.display = "none";
	}
	consolem("Показывать мобильный онлайн отдельно изменено!")
}, false)

document.getElementById("PopUpNotify").addEventListener("change", function() {
  chrome.storage.local.set({'popup_notify' : document.getElementById("PopUpNotify").checked});
  // localStorage["popup_notify"] = document.getElementById("PopUpNotify").checked;
  consolem("Всплывающее окно изменено!")
}, false)

document.getElementById("ConsoleLog").addEventListener("change", function() {
  chrome.storage.local.set({'console_log' : document.getElementById("ConsoleLog").checked});
  // localStorage["console_log"] = document.getElementById("ConsoleLog").checked;
  consolem("Отображение в консоли изменено!")
}, false)

document.getElementById("deautorization").addEventListener("click", function() {
	chrome.storage.local.set({'vkaccess_token': 0});
	consolem("Деавторизация прошла успешно! Что бы авторизоваться нажмите кнопку Авторизации!")
})

document.getElementById("autorization").addEventListener("click", getClickHandler())


//Функция для проверки авторизации в ВКорешах
function getClickHandler() {
    "use strict";

    return function (info, tab) {

        var	vkCLientId           = '5956086',
            vkRequestedScopes    = 'friends,offline',
            vkAuthenticationUrl  = 'https://oauth.vk.com/authorize?client_id=' + vkCLientId + '&scope=' + vkRequestedScopes + '&redirect_uri=http%3A%2F%2Foauth.vk.com%2Fblank.html&display=page&response_type=token';

		chrome.storage.local.get({'vkaccess_token': {}}, function (items) {

            if (items.vkaccess_token.length === undefined) {
                chrome.tabs.create({url: vkAuthenticationUrl, selected: true}, function (tab) {
                    chrome.tabs.onUpdated.addListener(listenerHandler(tab.id));
                });

                return;
            }else{
				alert("Вы уже авторизированы!");
			}

        });
    };
}

//Функция для вытаскивания Access Token из URL строки и последующая запись в локальное хранилище
function listenerHandler(authenticationTabId) {
    "use strict";

    return function tabUpdateListener(tabId, changeInfo, tabInfo) {
        var vkAccessToken,
            vkAccessTokenExpiredFlag;

        if (tabId === authenticationTabId && changeInfo.url !== undefined && changeInfo.status === "loading") {

            if (changeInfo.url.indexOf('oauth.vk.com/blank.html#') > -1) {
                authenticationTabId = null;
                chrome.tabs.onUpdated.removeListener(tabUpdateListener);

                vkAccessToken = getUrlParameterValue(changeInfo.url, 'access_token');

                if (vkAccessToken === undefined || vkAccessToken.length === undefined) {
                    displayeAnError('vk auth response problem', 'access_token length = 0 or vkAccessToken == undefined');
                    return;
                }

                vkAccessTokenExpiredFlag = Number(getUrlParameterValue(changeInfo.url, 'expires_in'));

                if (vkAccessTokenExpiredFlag !== 0) {
                    displayeAnError('vk auth response problem', 'vkAccessTokenExpiredFlag != 0' + vkAccessToken);
                    return;
                }
                chrome.storage.local.set({'vkaccess_token': vkAccessToken});
								consolem("Авторизация прошла успешно! Что бы деавторизоваться нажмите кнопку Деавторизации!")
            }
        }
    };
}

//Функция для получения параметра из URL строки
function getUrlParameterValue(url, parameterName) {
    "use strict";

    var urlParameters  = url.substr(url.indexOf("#") + 1),
        parameterValue = "",
        index,
        temp;

    urlParameters = urlParameters.split("&");

    for (index = 0; index < urlParameters.length; index += 1) {
        temp = urlParameters[index].split("=");

        if (temp[0] === parameterName) {
            return temp[1];
        }
    }

    return parameterValue;
}
