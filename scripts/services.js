window.onload = function() {
	var map = L.map('map', {
			center: [36.98, -120.12],
			zoom: 8
	});

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoia2FuZ2Fyb29vIiwiYSI6ImNqMXNkbWl5NjAwMWUzMnJ6eDdqbWV1dnAifQ.yHRhnXJ0ek-a6DrU5-GjEQ', {
		maxZoom: 18,
		id: 'mapbox.streets'
	}).addTo(map);

	var wkt = new Wkt.Wkt();

	var processData = function(data) {
		data.forEach(function(item){
			wkt.read(item.toString().split(";")[1]);
			var coords = wkt.components[0];
			
			L.circle([coords.x, coords.y], {
				color: 'red',
				fillColor: '#f03',
				fillOpacity: 0.5,
				radius: 1000
			}).addTo(map);
		});
	}
	
	$.ajax({
		url: "http://localhost:8081/data.csv",
		async: false,
		success: function (csvd) {
			console.log("Start processing!");
			var data = $.csv.toArrays(csvd);	
			processData(data);
		},
		dataType: "text",
		complete: function () {
			console.log("Completed!");
		}
	});
}