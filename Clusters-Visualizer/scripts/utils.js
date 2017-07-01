define(["scripts/consts"], function(consts) {
    return {
        //pos = "left" (paste num on the left hand side, so complete value is in the right side) / "right"
		completeTemplate: function(template, num, pos) {
			var completePart = template.substring(0, template.length - num.toString().length);
			return pos == "left" ? num.toString() + completePart : completePart + num.toString(); 
		},
        sortObjectByKey: function(obj) {
			return Object.keys(obj).sort().reduce((r, k) => (r[k] = obj[k], r), {});
		},
        isFileNameStartsWith: function(fullPath, suffix) {
            var fileName = fullPath.replace(/^.*[\\\/]/, '');
            return fileName.startsWith(suffix);
        },
        getGMTDate: function(str) {
            return (new Date(parseFloat(str, 10))).toLocaleString();
        },
        getClusterName: function(clusterId) {
            return "Cluster " + this.completeTemplate(consts.CLUSTER_ID_TEMPLATE, clusterId, "right");
        },
        getItemDataObj: function(id, lat, lng, radius, timeStart, timeEnd, cluster, payload, label) {
            return {
                "id": id, 
                "lat": lat, 
                "lng": lng, 
                "radius": radius, 
                "time": this.getGMTDate(timeStart) + " - " + this.getGMTDate(timeEnd), 
                "cluster": cluster, 
                "payload": payload,
                "label": label
            };
        },
        getRectDataObj: function(layer, tr, bl) {
            return {
                "layer": layer, 
                "tr": tr, 
                "bl": bl
            };
        },
        getOverlayName: function(id) {
            return "Overlay " + id;
        },
        getData: function(fileName, onSuccess) {
            $.ajax({
                url: consts.URL + fileName,
                async: false,
                success: function (csvd) {
                    console.log("Start processing!");
                    var data = $.csv.toArrays(csvd);	
                    onSuccess(data);
                },
                dataType: "text",
                complete: function () {
                    console.log("Completed!");
                }
            });
        },
        getFileName: function(fileName) {
			var name = fileName.replace(/^.*[\\\/]/, '');
			return name;
		},
        getFileDir: function(fileName) {
			var path = fileName.substring(0, fileName.lastIndexOf("/") + 1);
			return path;
		},
        getFileFolder: function(fileName) {
            var folder = fileName.split('/').slice(-2)[0]; 
			return folder;
		},
        getPartitionsFileName: function(fileName) {
			var name = this.getFileDir(fileName) + "partitions_" + this.getFileName(fileName);
			return name;
		}
    }
});