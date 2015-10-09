var recognition;
var isListening = false;
var listenButton = document.getElementById("listen-button");
var statusText = document.getElementById("status-text");
var imageContainer = document.getElementById("image-container");

function init() {
	if(!window.webkitSpeechRecognition){
		alert("Webkit Speech Recognition not supported! Are you using the latest version of Chrome?");
	}else{
		recognition = new webkitSpeechRecognition();
		recognition.continuous = true;
		recognition.onstart = function(event){
			statusText.innerHTML = "Listening..."
		}
		recognition.onresult = function(event){
			if(event.results.length > 0){			
					for(var i=event.resultIndex; i<event.results.length; i++){
					
					var phrase = event.results[i][0].transcript;

					statusText.innerHTML = "Searching "+"\""+phrase+"\""+" ...";
					
					var imgurRequest = new XMLHttpRequest();
					
					imgurRequest.onreadystatechange = function(){
						if(imgurRequest.readyState == 4 && imgurRequest.status == 200){
							var imgurResponse = imgurRequest.response.data;
							if(imgurResponse.length > 0){
								statusText.innerHTML = "Showing results for: "+phrase
								successHandler(imgurResponse);
							}else{
								statusText.innerHTML = "No results found for: "+phrase
							}
						}
					}

					imgurRequest.open("GET","https://api.imgur.com/3/gallery/search?q="+phrase);
					imgurRequest.setRequestHeader("Authorization", "Client-ID a672a0e950c3b87");
					imgurRequest.responseType = 'json';
					imgurRequest.send();
				}
			}
		}
	}
}

function successHandler(data){
	imageContainer.innerHTML = "";
	for(var i=0; i<data.length; i++){
		if(data[i].type && !data[i].nsfw){

			var image = new Image()
			image.setAttribute("class","imgur-image col-md-3");
			image.src= data[i].link;

			imageContainer.appendChild(image);
		}
	}
}

function toggleListen(){
	if(isListening){
		recognition.stop();
		isListening = false;
		listenButton.innerHTML = "Start Listening";
	}else{
		recognition.start();
		isListening = true;
		listenButton.innerHTML = "Stop Listening";
	}
}

init();