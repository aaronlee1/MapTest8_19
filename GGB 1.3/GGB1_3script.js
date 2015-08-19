var tableId, locCol, mapCenter, layer, newLayer, heatmap;

function initialize() {
	//Creates the map object and specifies the dimensions contained in style.css
	map = new google.maps.Map(document.getElementById('map-canvas'), {
		center: {
			lat: 42.903281,
			lng: -78.837536
		},		zoom: 13,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});
	//Creates initial FusionTablesLayer
	layer = new google.maps.FusionTablesLayer({
		query: {
			select: 'Address',
			from: '1w6LW8CAewH1hf4hUitL5nyY25MCf19MvVG9RDGma'
		},
		//These two items state that the InfoWindow will use the FT InfoWindow
		//The InfoWindows can also be suppressed and add custom in Google Maps API
		//But it is a bit more coding, FT InfoWindows are easily customizable!
		templateId: 2,
		styleId: 2
	});
	//Creates the object that stores the user selection from the "Survey" Dropdown.
	basemapBox = document.getElementById('basemap');
	surveyBox = document.getElementById('survey');
	//sets the FT layer specified above on the map (change map to null in parentheses)
	layer.setMap(null);
	mapCenter = new google.maps.LatLng();
	
	var legend = document.createElement('div');
	legend.id ='legend';
	legend.index = 1;
	map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
		
	}

//user 	
function toggleHeatmap() {
	
	heatmap.setMap(heatmap.getMap() ? null: map);
	newLayer.setMap(null);
	
}
function changeRadius() {
	heatmap.set('radius',heatmap.get('radius') ? null: 15);
}
//User Selects Basemap Name, Retrieve matching tableId and locCol.
//If you generate a new survey(and FT) and an if...else statement.
//**Note: You MUST add select option in the html file under select id = "basemap"!
//This function works when there is a change in the selection box for basemap.
//Notice in the GGB1_3.html file, "getTableInfo();" occurs "onchange()"
function getTableInfo() {
	var bmap = basemapBox.value;
	var lat;
	var lon;
	var att1;
	if (bmap == 1) {
		tableId = '1Zw3P1Zyz030P8K7KEHi25qp8A3RSP5MuBvKTZp9F',
		locCol = 'Address',
		lat = 'Latitude',
		lon = 'Longitude',
		att1 = 'Garden_ID'
	var content = [];	
	content.push('<h3>Gardens By Council District<h3>');
	content.push('<p><div class="lgdIcon red"></div>Ellicott</p>');
	content.push('<p><div class="lgdIcon yellow"></div>Fillmore</p>');
	content.push('<p><div class="lgdIcon grey"></div>Lovejoy</p>');
	content.push('<p><div class="lgdIcon purple"></div>Masten</p>');
	content.push('<p><div class="lgdIcon green"></div>Niagara</p>');
	content.push('<p><div class="lgdIcon blue"></div>North</p>');
	content.push('<p><div class="lgdIcon brown"></div>South</p>');
	content.push('<p><div class="lgdIcon turquoise"></div>University</p>');
	content.push('<p><div class="lgdIcon white"></div>No Data</p>');
	content.push('<p><div class="Text"><a target="_blank" href="https://www.ci.buffalo.ny.us/Home/Leadership/CommonCouncil">Contact</a> your Council Member');
	legend.innerHTML = content.join('');
		
	}else if(bmap == 2) {
		tableId = '1e_Qd0Z98VVqavqqCwDCN9vUltr8dYRaOI1okoaxe',
		locCol = 'location',
		lat = 'Latitude',
		lon = 'Longitude',
		att1 = 'instanceID'
	}	
	
	var query = "https://www.googleapis.com/fusiontables/v1/query?sql=SELECT "+lat + ","+lon +","+att1 + " FROM "+ tableId +"&key=AIzaSyDgfgOcUEAuuHJZ0ChHUUlWSuh2LkrqrWw";
	var queryurl = encodeURI(query);
	var dataQuer = $.get(queryurl, dataHandlerBounds);
}

function getSurvey() {
	var survey = surveyBox.value;
	var surveyLoc;
	var surLatLng;
	var lat;
	var lon;
	var resp1;
	if(survey == 1){
		tableId = '1rL9bAytcXpPB8HeIXp5RE1ojYeKI0YrD8HtnAdK-',
		locCol = 'Address',
		surLatLng = 'Coordinates',
		resp1 = 'Rent'
	}else if(survey == 0){
	
	}
	var query1 = "https://www.googleapis.com/fusiontables/v1/query?sql=SELECT "+surLatLng +","+resp1 +" FROM "+ tableId +"&key=AIzaSyDgfgOcUEAuuHJZ0ChHUUlWSuh2LkrqrWw";
	var queryurl1 = encodeURI(query1);
	var dataQuer1 = $.get(queryurl1, dataHandlerBounds);
}		
		
//Removes initial layer and draws new layer
//The locCol and tableId are defined by the previous function.
function updateMap(){
	layer.setMap(null);
	newLayer = new google.maps.FusionTablesLayer({
		query: {
			select: locCol,
			from: tableId
		},
		templateId:2,
		styleId:2
	});
	
	newLayer.setMap(map);
	
}
	
function dataHandlerBounds(data){
	
	var newLoc = new Array();
	var bounds = new google.maps.LatLngBounds();
	
	for(i=0;i< data.rows.length; i++){
		var point = new google.maps.LatLng(
			data.rows[i][0],
			data.rows[i][1]);
		newLoc.push({
			location:point,
		});
		bounds.extend(point);
	}
	
	heatmap = new google.maps.visualization.HeatmapLayer({
		data: newLoc,
		map: map
	});
	heatmap.setMap(heatmap.getMap() ? null: map);
	newLayer.setMap(newLayer.getMap() ? map: null);	
	map.fitBounds(bounds);
}



google.maps.event.addDomListener(window,'load',initialize);

			