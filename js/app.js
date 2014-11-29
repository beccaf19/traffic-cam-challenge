// List of Seattle Traffic Cameras
// http://data.seattle.gov/resource/65fc-btcc.json

"use strict";

//put your code here to create the map, fetch the list of traffic cameras
//and add them as markers on the map
//when a user clicks on a marker, you should pan the map so that the marker
//is at the center, and open an InfoWindow that displays the latest camera
//image
//you should also write the code to filter the set of markers when the user
//types a search phrase into the search box


$(document).ready(function(){
	var coords = {
		lat: 47.6,
		lng: -122.3
	};

	var mapElem = document.getElementById('map');
	var map = new google.maps.Map(mapElem, {
		center: coords,
		zoom: 12
	});

	var InfoWindow = new google.maps.InfoWindow();
	var cameras;	
	var markers = [];

	$.getJSON('https://data.seattle.gov/resource/65fc-btcc.json')
		.done(function(data) {
			cameras = data;
			var icon = 'img/cameraicon.png';
			data.forEach(function(camera) {
				var marker = new google.maps.Marker({
					position: {
						lat: Number(camera.location.latitude),
						lng: Number(camera.location.longitude)
					},
					map: map,
					icon: icon
				});
				markers.push(marker);

				google.maps.event.addListener (marker, 'click', function() {
					map.panTo(marker.getPosition());

					var html = '<p>' + camera.cameralabel + '</p>';
					html += '<img src=' + camera.imageurl.url+ '>';
					InfoWindow.setContent(html);
					InfoWindow.open(map, this);
				});
			});
		})
		.fail (function(error) {
			console.log(error);
		})
		.always(function(){
			$('#ajax-loader').fadeOut();
		}); // end of getJSON

	$("#search").bind('search keyup', function() {
		var searchString = document.getElementById('search');
		var idx;
		//while search is being inputted...for each camera
		for (idx = 0; idx < cameras.length; idx++) {
			var cameraLabel = cameras[idx].cameralabel.toLowerCase();
			//check to see if search matches any camera name
			if (cameraLabel.indexOf(searchString.value.toLowerCase()) == -1) {	
				//delete the markers that don't match
				markers[idx].setMap(null);
			} 
			//if user backspaces
			if (event.keyCode == 8 || event.keyCode == 46) {
				//get new searchstring
				searchString = document.getElementById('search');
				var i;
				//for each camera
				for (i=0; i < cameras.length;i++) {
					//check to see if camera now contains shortened search
					if (cameraLabel.indexOf(searchString.value.toLowerCase()) != -1) {	
						//if yes, add it back
						markers[idx].setMap(map);
					} 
				}
			}
		}
	}); // end of camera filter

	google.maps.event.addListener(map, 'click', function(){
		InfoWindow.close();
	}); // end of close infowindow
	
}); // end of document ready








