define(["utils"], function(utils) {
    return {

        getPopupContent: function(contenObj) {
            var content = "<table class=\"item-data-table\">"; 
            Object.keys(contenObj).forEach(function(key) {
                if (key == "lat") {
                    content += "<tr>";
                    content += "<td class=\"caption-col\">coords</td>";
                    content += "<td class=\"content-col\">[" + contenObj["lat"] + ", " + contenObj["lng"] + "]</td>";
                    content += "</tr>";
                } else if (key == "lng") {
                } else {	
                    content += "<tr>";
                    content += "<td class=\"caption-col\">" + key + "</td>";
                    content += "<td class=\"content-col\">" + contenObj[key] + (key == "radius" ? " m": "") + "</td>";
                    content += "</tr>";
                }
            });
            content += "</table>";
            return content;
        },

        getPopupContentForAnalyzed: function(contenObj) {
            var content = "<table class=\"item-data-table\">"; 
            
            content += this.appendData("clusterId", contenObj.clusterId);
            content += this.appendData("events", contenObj.size);
            content += this.appendData("min time interval", utils.getGMTDate(contenObj.minTimeIntervalStart) + " - " + utils.getGMTDate(contenObj.minTimeIntervalEnd));
            content += this.appendData("max time interval", utils.getGMTDate(contenObj.maxTimeIntervalStart) + " - " + utils.getGMTDate(contenObj.maxTimeIntervalEnd));
            content += this.appendData("time interval", utils.getGMTDate(contenObj.timeStart) + " - " + utils.getGMTDate(contenObj.timeEnd));
            
            content += "</table>";
            return content;
        },  
		
		getPopupContentForRectangle: function(contenObj) {
            var content = "<table class=\"item-data-table\">"; 
            content += this.appendData("Layer", contenObj.layer);
            content += this.appendData("Top Right", contenObj.tr[0] + " " + contenObj.tr[1]);
            content += this.appendData("Bottom Left", contenObj.bl[0] + " " + contenObj.tr[1]);
            content += "</table>";
            return content;
        }, 	
        
        appendData: function(caption, data) {
            var content = "";
            content += "<tr>";
            content += "<td class=\"caption-col\">" + caption + "</td>";
            content += "<td class=\"content-col\">" + data + "</td>";
            content += "</tr>";
            return content;
        }
    }
});
