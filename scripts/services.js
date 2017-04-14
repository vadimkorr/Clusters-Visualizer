
function initMap() {
	// Create a map object and specify the DOM element for display.
	var map = new google.maps.Map(d3.select("#map").node(), {
		center: new google.maps.LatLng(37.76487, -122.41948),
		scrollwheel: true,
		zoom: 8,
		mapTypeId: google.maps.MapTypeId.TERRAIN
	});
	
	//load data, when data comes back, create an overlay
	d3.json('http://localhost:8080/data.json', function(error, data) {
		if (error) throw error;

		var overlay = new google.maps.OverlayView();

		// Add the container when the overlay is added to the map.
		overlay.onAdd = function() {
			var layer = d3.select(this.getPanes().overlayLayer).append("div")
				.attr("class", "stations");

			// Draw each marker as a separate SVG element.
			// We could use a single SVG, but what size would it have?
			overlay.draw = function() {
				var projection = this.getProjection(),
				padding = 10;
				
				var marker = layer.selectAll("svg")
					.data(d3.entries(data))
					.each(transform) // update existing markers
					.enter().append("svg")
					//.each(transform)
					.attr("class", "marker");
				
				marker.append("circle")
					.attr("r", function(d,i){
						return d.value.unc_reg;
					})
					.attr("cx", padding)
					.attr("cy", padding);

				// Add a label.
				/*marker.append("text")
					.attr("x", function(d,i) { return d.x; })
					.attr("y", function(d,i) { return d.y; })
					.attr("font-size", "10")
					.text(function(d) { 
						console.log(d.value.pos);
						return d.value.pos; });*/

				marker
					.append("text")
					.text(function(d) {
						return d.value.pos;
					})
					.attr("x", function(d, i) {
						return padding + 7;
					})
					.attr("y", function(d, i) {
						return padding;
					})
					//.attr("dy",".31em")
					.attr("class", "country-name")

				function transform(d) {
					d = new google.maps.LatLng(d.value.pos2[0], d.value.pos2[1]);
					d = projection.fromLatLngToDivPixel(d);
					//debugger;
					return d3.select(this)
						.style("left", (d.x - padding) + "px")
						.style("top", (d.y - padding) + "px");
				}
			};
		};
	// Bind our overlay to the map…
	overlay.setMap(map);
	});
}