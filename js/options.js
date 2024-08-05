import Analytics from '../js/google-analytics.js';

var current_color = "#FFFFFF";

window.addEventListener('load', function() {
  Analytics.firePageViewEvent(document.title, document.location.href);
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

chrome.storage.local.get(["color_on_1"], (result) => {
  if (result["color_on_1"] == undefined){
    reset_options();
  }
});

function reset_options() {
  let data = {};

  for(let i=1;i<=7;i++)
  {
    data["color_on_"+i] = false;
    data["text_color_"+i] = "";
    data["mode_"+i] = "";
  }

	data["online_on"] = false;
	data["mobile_online_on"] = false;

	data["popup_notify"] = true;
	data["console_log"] = true;

  chrome.storage.local.set(data, () => {

    Analytics.fireEvent('reset_options');

    restore_options();
  });
}

function restore_options() {
  chrome.storage.local.get(
    ['color_on_1', 'color_on_2', 'color_on_3','color_on_4','color_on_5','color_on_6','color_on_7',
    'text_color_1','text_color_2','text_color_3','text_color_4','text_color_5','text_color_6','text_color_7',
    'mode_1','mode_2','mode_3','mode_4','mode_5','mode_6','mode_7',
    'online_on', 'mobile_online_on', 'popup_notify', 'console_log'], (result) => {


    for(let i=1;i<=7;i++)
      {
        document.getElementById("color_on_"+i).checked = checkBool(result["color_on_"+i])
    
        if(!checkBool(result["color_on_"+i])){
          document.getElementById("menu_"+i).style.display = "none";
        }
    
        document.getElementById("text_color_"+i).style.color = result["text_color_"+i];
    
        document.getElementById("text_color_"+i).style.textDecoration = result["mode_"+i];
      }
    
      document.getElementById("popup_notify").checked = checkBool(result["popup_notify"])
      document.getElementById("console_log").checked = checkBool(result["console_log"])
    
      if(checkBool(result["online_on"])){
        document.getElementById("online_on").checked = true;
        document.getElementsByClassName("vk_online")[0].style.display = "inline-block";
        document.getElementById("mobile_online_on_container").style.display = "block";
      }else{
        document.getElementById("online_on").checked = false;
        document.getElementsByClassName("vk_online")[0].style.display = "none";
        document.getElementById("mobile_online_on_container").style.display = "none";
      }
    
      if(checkBool(result["mobile_online_on"])){
        document.getElementById("mobile_online_on").checked = true;
        document.getElementsByClassName("vk_mobile_online")[0].style.display = "inline-block";
      }else{
        document.getElementById("mobile_online_on").checked = false;
        document.getElementsByClassName("vk_mobile_online")[0].style.display = "none";
      }
    
      for(let i=1;i<=7;i++)
      {
        switch (result["mode_"+i]) {
          case "none":
            document.getElementById("none_"+i).checked = true;
            break;
          case "underline":
            document.getElementById("under_line_"+i).checked = true;
            break;
          case "line-through":
            document.getElementById("through_line_"+i).checked = true;
            break;
          default:
            document.getElementById("none_"+i).checked = true;
          }
      } 
    
      consolem("Настройки загружены!");
  })

  
}

function change_color(num) {
  current_color = document.getElementById("out_html_color").innerText;

  document.getElementById("text_color_" + num).style.color = current_color;

  let data = {};
  data["text_color_" + num] = current_color;

  chrome.storage.local.set(data);

  Analytics.fireEvent('change_color', { id: num, color: current_color});
}

function change_mode(num, mode) {
  let data = {};

  switch (mode) {
	case 0:
		data["mode_" + num] = "none";
		document.getElementById("text_color_" + num).style.textDecoration = "none";
		break;
	case 1:
		data["mode_" + num] = "underline";
		document.getElementById("text_color_" + num).style.textDecoration = "underline";
		break;
	case 2:
		data["mode_" + num] = "line-through";
		document.getElementById("text_color_" + num).style.textDecoration = "line-through";
		break;
	default:
		data["mode_" + num] = "none";
		document.getElementById("text_color_" + num).style.textDecoration = "none";
  }

  chrome.storage.local.set(data);

  Analytics.fireEvent('change_mode', { id: num, mode: mode});
}


function checkBool(x) { if(x == "true" || x == true || x == 1) {return true;} else {return false;} }

function consolem(text_in){
  document.getElementById("console").innerText = text_in;
}

document.addEventListener("DOMContentLoaded", restore_options);

document.getElementById("reset").addEventListener("click", reset_options);

for(let i=1;i<=7;i++)
{
  document.getElementById("color_set_"+i).addEventListener("click", function() {change_color(i); consolem("Цвет "+i+" изменен!")}, false);
  document.getElementById("none_"+i).addEventListener("click", function() {change_mode(i, 0); consolem("Модификатор "+i+" убран!")}, false);
  document.getElementById("under_line_"+i).addEventListener("click", function() {change_mode(i, 1); consolem("Модификатор "+i+" изменен на подчеркивание!")}, false);
  document.getElementById("through_line_"+i).addEventListener("click", function() {change_mode(i, 2); consolem("Модификатор "+i+" изменен на зачеркивание!")}, false);

  document.getElementById("color_on_"+i).addEventListener("change", function() {
    let data = {}
    data["color_on_"+i] = document.getElementById("color_on_"+i).checked;
    chrome.storage.local.set(data);

    if(document.getElementById("color_on_"+i).checked){
      document.getElementById("menu_"+i).style.display = "block";
    }else{
      document.getElementById("menu_"+i).style.display = "none";
    }
    consolem("Выделение "+i+" изменено!")}, false);
}

document.getElementById("online_on").addEventListener("change", function() {
  let status = document.getElementById("online_on").checked;

  chrome.storage.local.set({'online_on' : status});

	if(status){
		document.getElementById("mobile_online_on_container").style.display = "block";
		document.getElementsByClassName("vk_online")[0].style.display = "inline-block";
	}else{
		document.getElementsByClassName("vk_online")[0].style.display = "none";
		document.getElementById("mobile_online_on_container").style.display = "none";
	}
	consolem("Показывать онлайн изменено!")

  Analytics.fireEvent('online_on', { status: status});
}, false)

document.getElementById("mobile_online_on").addEventListener("change", function() {
  let status = document.getElementById("mobile_online_on").checked;

  chrome.storage.local.set({'mobile_online_on' : status});

	if(status){
		document.getElementsByClassName("vk_mobile_online")[0].style.display = "inline-block";
	}else{
		document.getElementsByClassName("vk_mobile_online")[0].style.display = "none";
	}
	consolem("Показывать мобильный онлайн отдельно изменено!");

  Analytics.fireEvent('mobile_online_on', { status: status});
}, false)

document.getElementById("popup_notify").addEventListener("change", function() {
  chrome.storage.local.set({'popup_notify' : document.getElementById("popup_notify").checked});

  consolem("Всплывающее окно изменено!");

  Analytics.fireEvent('popup_notify', { status: document.getElementById("popup_notify").checked});
}, false)

document.getElementById("console_log").addEventListener("change", function() {
  chrome.storage.local.set({'console_log' : document.getElementById("console_log").checked});

  consolem("Отображение в консоли изменено!");

  Analytics.fireEvent('console_log', { status: document.getElementById("popup_notify").checked});
}, false)

document.getElementById("deautorization").addEventListener("click", function() {
	chrome.storage.local.set({'vkaccess_token': 0});
	consolem("Деавторизация прошла успешно! Что бы авторизоваться нажмите кнопку Авторизации!");

  Analytics.fireEvent('deautorization');
})

document.getElementById("autorization").addEventListener("click", getClickHandler());


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

            if (changeInfo.url.indexOf('oauth.vk.com/blank.html#access_token') > -1) {
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

                Analytics.fireEvent('autorization');

								consolem("Авторизация прошла успешно! Что бы деавторизоваться нажмите кнопку Деавторизации!");
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
