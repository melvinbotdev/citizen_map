(function(A) {

	if (!Array.prototype.forEach)
		A.forEach = A.forEach || function(action, that) {
			for (var i = 0, l = this.length; i < l; i++)
				if (i in this)
					action.call(that, this[i], i, this);
			};

		})(Array.prototype);

		var
		mapObject,
		markers = [],
		markersData = {};

		function initialize () {
			

			
			var mapOptions = {
				zoom: 12,
				minZoom:10,
				maxZoom:19,
				center: new google.maps.LatLng(50.853, 4.272),
				mapTypeId: google.maps.MapTypeId.ROADMAP,

				mapTypeControl: false,
				mapTypeControlOptions: {
					style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
					position: google.maps.ControlPosition.LEFT_CENTER
				},
				panControl: false,
				panControlOptions: {
					position: google.maps.ControlPosition.TOP_RIGHT
				},
				zoomControl: true,
				zoomControlOptions: {
					style: google.maps.ZoomControlStyle.LARGE,
					position: google.maps.ControlPosition.RIGHT_CENTER
				},
				scaleControl: false,
				scaleControlOptions: {
					position: google.maps.ControlPosition.LEFT_CENTER
				},
				streetViewControl: false,
				streetViewControlOptions: {
					position: google.maps.ControlPosition.LEFT_TOP
				},
				styles: [/*insert your map styles*/]
			};
			var
			marker;
			mapObject = new google.maps.Map(document.getElementById('map'), mapOptions);
			 var infoWindow = new google.maps.InfoWindow({map: mapObject});

			// Try HTML5 geolocation.
	        if (navigator.geolocation) {
	          navigator.geolocation.getCurrentPosition(function(position) {
	            var pos = {
	              lat: position.coords.latitude,
	              lng: position.coords.longitude
	            };

	            infoWindow.setPosition(pos);
	            infoWindow.setContent('Location found.');
	            mapObject.setCenter(pos);
	          }, function() {
	            handleLocationError(true, infoWindow, mapObject.getCenter());
	          });
	        } else {
	          // Browser doesn't support Geolocation
	          handleLocationError(false, infoWindow, mapObject.getCenter());
	        }
	      //  marker.addListener('click', toggleBounce);

			//add listeners
		    googleAddListener('dragend');
		    googleAddListener('idle');
			//function getMarkers
			//getMarkers();
			
		}

		function hideAllMarkers () {
			for (var key in markers)
				markers[key].forEach(function (marker) {
					marker.setMap(null);
				});
		}

		function toggleMarkers (category) {
			hideAllMarkers();
			closeInfoBox();

			if ('undefined' === typeof markers[category])
				return false;
			markers[category].forEach(function (marker) {
				marker.setMap(mapObject);
				marker.setAnimation(google.maps.Animation.DROP);

			});
		}
		
		function closeInfoBox() {
			$('div.infoBox').remove();
		}

		function getInfoBox(item) {
			return new InfoBox({
				content:
				'<div class="marker_info none" id="marker_info">' +
				'<div class="info" id="info">'+
				'<img src="' + item.map_image_url + '" class="logotype" alt=""/>' +
				'<h2>'+ item.name_point +'<span></span></h2>' +
				'<span>'+ item.description_point +'</span>' +
				'<a href="'+ item.url_point + '" class="green_btn">More info</a>' +
				'<span class="arrow"></span>' +
				'</div>' +
				'</div>',
				disableAutoPan: true,
				maxWidth: 0,
				pixelOffset: new google.maps.Size(40, -210),
				closeBoxMargin: '50px 200px',
				closeBoxURL: '',
				isHidden: false,
				pane: 'floatPane',
				enableEventPropagation: true
			});


		}
		 function handleLocationError(browserHasGeolocation, infoWindow, pos) {
		        infoWindow.setPosition(pos);
		        infoWindow.setContent(browserHasGeolocation ?
		                              'Error: The Geolocation service failed.' :
		                              'Error: Your browser doesn\'t support geolocation.');
		  }

		function getMarkers(arrayltlg){
			//get markers from db
		   var sendAjax = $.ajax({
			    type: "POST",
			    url: 'url.php',
			    data: arrayltlg,
			    success: handleResponse(data)
			   });

			 
			   function handleResponse(data){
				   clearMarkers();
				   markersData = data;
				   setMarkers();
			   }
		}
		function setMarkers(){
			for (var key in markersData)
				markersData[key].forEach(function (item) {
					marker = new google.maps.Marker({
						position: new google.maps.LatLng(item.location_latitude, item.location_longitude),
						map: mapObject,
						icon: 'img/icon/' + key + '.png',
					});

					if ('undefined' === typeof markers[key])
						markers[key] = [];
					markers[key].push(marker);
					google.maps.event.addListener(marker, 'click', (function () {
				    closeInfoBox();
				    getInfoBox(item).open(mapObject, this);
				    mapObject.setCenter(new google.maps.LatLng(item.location_latitude, item.location_longitude));
					}));
					
				});
		}

		function clearMarkers() {
			  setMapOnAll(null);
		}
		function setMapOnAll(map) {
			  for (var i = 0; i < markersData.length; i++) {
				  markersData[i].setMap(map);
			  }
		}
		function deleteMarkers() {
			  clearMarkers();
			  markersData = {};
		}
		function googleAddListener(listener){
			 google.maps.event.addListener(mapObject, listener, function() {
				   /* On récupère les coordonnées des coins de la map */ 
				   var bds = mapObject.getBounds();
				   var South_Lat = bds.getSouthWest().lat();
				   var South_Lng = bds.getSouthWest().lng();
				   var North_Lat = bds.getNorthEast().lat();
				   var North_Lng = bds.getNorthEast().lng();
				  
				   var arrayltlg = {'bounds':[{
							   		'SO_Lt' : South_Lat,
							   		'SO_lg' : South_Lng,
							   		'NE_lt' : North_Lat,
							   		'NE_lg' : North_Lng
				   					}
					   				]};
				   
				   //callAjax(arrayltlg);
				  console.log(arrayltlg);
				  }); 
		}