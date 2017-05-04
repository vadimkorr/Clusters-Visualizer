window.onload = function() {
	var URL = "http://localhost:8081/";

	var layerGroupOfClusters = new L.LayerGroup();
	var mapbox = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={access_token}', {
		maxZoom: 18,
		id: 'mapbox.streets',
		access_token: 'pk.eyJ1Ijoia2FuZ2Fyb29vIiwiYSI6ImNqMXNkbWl5NjAwMWUzMnJ6eDdqbWV1dnAifQ.yHRhnXJ0ek-a6DrU5-GjEQ'
	});

	var filesList;
	var layerControl;
	function populateFilesListDropdown() {
		var file = URL + "file-names-list.txt";
		var dropdownList = $("#file-names-list-dropdown");
		$.get(file, function(data) {
			filesList = data.split("\n");
			for (var i=0, len = filesList.length; i < len; i++) {
				var fileName = filesList[i];
				dropdownList.append("<option value='" + fileName + "'>" + fileName + "</option>");
			}   
		})
		.done(function() {
			Utils.getData(filesList[0], function(data) {
				map.addLayer(layerGroupOfClusters);
				var baseLayers = {
					//"Map": mapbox
				};
				layerControl = L.control.layers(baseLayers).addTo(map);
				processData(data);
			});
		});
	}
	populateFilesListDropdown();
	
	$("#file-names-list-dropdown").change(function(data) {
		Utils.getData($(this).val(), function(data) {
			layerGroupOfClusters.clearLayers();//remove cluster layers from layerGroupOfClusters
			layerControl.removeLayer(layerGroupOfClusters);//remove controls
			Overlays.removeOverlaysFromControl(layerControl);//
			Overlays.removeAllKeys();
			processData(data);
		});
	});
	
	var map = L.map('map', {
		center: [40.0, 0.5],
		zoom: 5,
		layers: [mapbox]
	});

	var Utils = {
		//pos = "left" (paste num on the left hand side, so complete value is in the right side) / "right"
		complete: function(template, num, pos) {
			var completePart = template.substring(0, template.length - num.toString().length);
			return pos == "left" ? num.toString() + completePart : completePart + num.toString(); 
		},
		colorTemplate: "000000",
		getColorHex: function(num) {  
			var step = 50000;
			var maxColor = 16777215;//#FFFFFF
			return '#' + this.complete(this.colorTemplate, ((num  * step) % maxColor).toString(16), "left");
		},
		clusterIdTemplate: "0000",
		getClusterName: function(clusterId) {
			return "Cluster " + this.complete(this.clusterIdTemplate, clusterId, "right");
		},
		sortObjectByKey: function(obj) {
			return Object.keys(obj).sort().reduce((r, k) => (r[k] = obj[k], r), {});
		},
		getData: function(fileName, onSuccess) {
			$.ajax({
				url: URL + fileName,
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
		parseRow: function(row) {
			var arr = row.toString().split(";");
			var wkt = new Wkt.Wkt();
			wkt.read(arr[1]);
			return {
				"id": arr[0],
				"radius": arr[2],
				"clusterId": arr[arr.length - 1],
				"wktType": wkt.type,
				"wktComps": wkt.components,
				"payload": arr[arr.length - 2]
			}
		},
		setLabelsColor: function(overlays) {
			var self = this;
			Object.keys(overlays).forEach(function(key) {
				$("span:contains('" + key +"')")
					.addClass("cluster-label")
					.parent().parent()
					.css('background', self.getColorHex(key.replace( /^\D+/g, '')));
			});
		},
		getItemDataObj: function(id, lat, lng, radius, time, cluster, payload) {
			return {
				"id": id, 
				"lat": lat, 
				"lng": lng, 
				"radius": radius, 
				"time": time, 
				"cluster": cluster, 
				"payload": payload
			};
		}
	};
	
	var Overlays = {
		overlays: {},
		getOverlay: function(key) {
			return this.overlays[key];
		},
		removeAllKeys: function() {
			var self = this;
			Object.keys(this.overlays).forEach(function(key) {
				delete self.overlays[key];
			});
		},
		addOverlaysToControl: function(ctrl) {
			var self = this;
			Object.keys(this.overlays).forEach(function(key) {
				ctrl.addOverlay(self.getOverlay(key), key);
			});
		},
		removeOverlaysFromControl: function(ctrl) {
			var self = this;
			Object.keys(this.overlays).forEach(function(key) {
				ctrl.removeLayer(self.getOverlay(key));
			});
		}
	};
	
	var getPopupContent = function(contenObj) {
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
	}

	var processData = function(data) {
		data.forEach(function(item) {
			var row = Utils.parseRow(item);
			var overlay = Overlays.getOverlay(Utils.getClusterName(row.clusterId));
			if (!overlay) {
				overlay = Overlays.overlays[Utils.getClusterName(row.clusterId)] = new L.LayerGroup();
			}
			layerGroupOfClusters.addLayer(overlay);//add to map directly to enable it right away
			switch(row.wktType) {
				case "point":		
					L.circle([row.wktComps[0].x, row.wktComps[0].y], {
						color: Utils.getColorHex(row.clusterId),
						fillColor: Utils.getColorHex(row.clusterId),
						fillOpacity: 0.5,
						radius: row.radius
					})
					.addTo(overlay)
					.bindPopup(
						getPopupContent(
							Utils.getItemDataObj(row.id, row.wktComps[0].x, row.wktComps[0].y, row.radius, "", row.clusterId, row.payload)
						)
					);
					break;
				case "linestring":
					var coordsArr = [];
					row.wktComps.forEach((coords) => {
						coordsArr.push(new L.LatLng(coords.x, coords.y));
					});
					L.corridor(coordsArr, {
						color: Utils.getColorHex(row.clusterId),
						corridor: row.radius,
						opacity: 0.5
					})
					.addTo(overlay)
					.bindPopup(
						getPopupContent(
							Utils.getItemDataObj(row.id, coordsArr[0].lat, coordsArr[0].lng, row.radius, "", row.clusterId, "")
						)
					);
					break;
				default:
					break;
			}
		});
		Overlays.overlays = Utils.sortObjectByKey(Overlays.overlays);
		Overlays.addOverlaysToControl(layerControl);
		Utils.setLabelsColor(Overlays.overlays);
	}
}