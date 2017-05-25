define(function() {
    return {
        L: undefined,
        setL: function(L) {
            this.L = L;
        },
        processPoint: function(x, y, radius, color, overlay, popupContent) {
            this.L.circle([x, y], {
                color: color,
                fillColor: color,
                fillOpacity: 0.5,
                radius: radius
            })
            .addTo(overlay)
            .bindPopup(popupContent);
        },
        processLineString: function(coordsColl, color, radius, overlay, popupContent) {
            var coordsArr = [];
            coordsColl.forEach((coords) => {
                coordsArr.push(new this.L.LatLng(coords.x, coords.y));
            });
            this.L.corridor(coordsArr, {
                color: color,
                corridor: radius,
                opacity: 0.5
            })
            .addTo(overlay)
            .bindPopup(popupContent);
        },
        processPolygon: function(coordsColl, color, overlay, popupContent) {
            var coordsArr = [];
            coordsColl.forEach((coords) => {
                coordsArr.push([coords.x, coords.y]);
            });
            this.L.polygon(coordsArr, {
                color: color,
                opacity: 0.5
            })
            .addTo(overlay)
            .bindPopup(popupContent);
        } 
     }
});