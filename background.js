chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request == "get color info") {
			var color_info = {
				ColorOn1:localStorage["ColorOn1"],
				ColorOn2:localStorage["ColorOn2"],
				ColorOn3:localStorage["ColorOn3"],
				ColorOn4:localStorage["ColorOn4"],
				ColorOn5:localStorage["ColorOn5"],
				ColorOn6:localStorage["ColorOn6"],
				ColorOn7:localStorage["ColorOn7"],
				
				color1:localStorage["color1"],
				color2:localStorage["color2"],
				color3:localStorage["color3"],
				color4:localStorage["color4"],
				color5:localStorage["color5"],
				color6:localStorage["color6"],
				color7:localStorage["color7"],
				
				mode1:localStorage["mode1"],
				mode2:localStorage["mode2"],
				mode3:localStorage["mode3"],
				mode4:localStorage["mode4"],
				mode5:localStorage["mode5"],
				mode6:localStorage["mode6"],
				mode7:localStorage["mode7"],
			}
			sendResponse(color_info)
		}
})