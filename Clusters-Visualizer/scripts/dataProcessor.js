define(function() {
	var opacity = 0.7
    return {
        L: undefined,
        setL: function(L) {
            this.L = L;
        },
        //input as x(Lng), y(Lat)
        processPoint: function(x, y, radius, color, overlay, popupContent) {
            this.L.circle([y, x], {//Lat, Lng
				stroke: false,
                //color: color, //stroke's color
                fillColor: color,
                fillOpacity: opacity,
                radius: radius
            })
            .addTo(overlay)
            .bindPopup(popupContent);
        },
        processLineString: function(coordsColl, radius, color, overlay, popupContent) {
            var coordsArr = [];
            coordsColl.forEach((coords) => {
                coordsArr.push(new this.L.LatLng(coords.y, coords.x));
            });
            this.L.corridor(coordsArr, {
                color: color,
                corridor: radius,
                opacity: opacity
            })
            .addTo(overlay)
            .bindPopup(popupContent);
        },
        processPolygon: function(coordsColl, color, overlay, popupContent) {
            var coordsArr = [];
            coordsColl.forEach((coords) => {
                coordsArr.push([coords.y, coords.x]);
            });
            this.L.polygon(coordsArr, {
                color: color,
                opacity: opacity
            })
            .addTo(overlay)
            .bindPopup(popupContent);
        },        
		processRectangle: function(bounds, color, overlay, popupContent) {
            this.L.rectangle(bounds, {
                color: color,
                opacity: opacity
            })
            .addTo(overlay)
            .bindPopup(popupContent);
        } 
     }
});