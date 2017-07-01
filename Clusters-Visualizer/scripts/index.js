window.onload = function() {

require([
		"scripts/dataProcessor", 
		"scripts/colorService", 
		"scripts/utils",
		"scripts/parserService",
		"scripts/popupService",
		"scripts/consts"
	], 
	function(dataProcessor, colorService, utils, parserService, popupService, consts) {

		dataProcessor.setL(L);

		var layerGroupOfClusters = new L.LayerGroup();
		var mapbox = L.tileLayer(consts.LEAFLET_TILE_LAYER, {
			maxZoom: 18,
			id: 'mapbox.streets',
			access_token: consts.LEAFLET_ACCESS_TOKEN
		});

		var map = L.map('map', {
			center: [50.675001, 10.888962],
			zoom: 8,
			layers: [mapbox]
		});

		var filesList;
		var layerControl;

		function populateFilesListDropdown() {
			var file = consts.FILE_NAMES_LIST_PATH;
			var dropdownList = $("#file-names-list-dropdown");
			$.get(file, function(data) {
				filesList = data.split("\n");
				for (var i = 0, len = filesList.length; i < len; i++) {
					var fileName = filesList[i];
					dropdownList.append("<option value='" + fileName + "'>" + fileName + "</option>");
				}   
			})
			.done(function() {
				var file = filesList[0];
				utils.getData(file, function(data) {
					map.addLayer(layerGroupOfClusters);
					var baseLayers = {
						//"Map": mapbox
					};
					layerControl = L.control.layers(baseLayers).addTo(map);
					processDataFromFile(file, data);
				});
			});
		}
			
		$("#file-names-list-dropdown").change(function(data) {		
			var file = $(this).val();

			var partitionsFile = utils.getPartitionsFileName(file);//"server-data/partitions-double_eps.csv";
			utils.getData(partitionsFile, function(data) {	
				processDataFromFile(partitionsFile, data);
			});
			
			utils.getData(file, function(data) {
				layerGroupOfClusters.clearLayers();//remove cluster layers from layerGroupOfClusters
				layerControl.removeLayer(layerGroupOfClusters);//remove controls
				Overlays.removeOverlaysFromControl(layerControl);//
				Overlays.removeAllKeys();
				
				processDataFromFile(file, data);
			});
		});

		var setLabelsColor = function(overlays) {
			var self = this;
			Object.keys(overlays).forEach(function(key) {
				$("span:contains('" + key +"')")
					.addClass("cluster-label")
					.parent().parent()
					.css('background', colorService.getColorHex(key.replace( /^\D+/g, '')));
			});
		}
			
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


		/* ========== DATA PROCESSORS ========== */

		var onPoint = function(row, overlay) {
			dataProcessor.processPoint(
				row.wktComps[0].x, row.wktComps[0].y, 
				row.radius, colorService.getColorHex(row.clusterId), overlay, 
				popupService.getPopupContent(utils.getItemDataObj(row.id, row.wktComps[0].x, row.wktComps[0].y, row.radius, row.start, row.end, row.clusterId, row.payload, row.label))
			)
		}
		
		var onLineString = function(row, overlay) {
			dataProcessor.processLineString(
				row.wktComps, 
				row.radius, colorService.getColorHex(row.clusterId), overlay, 
				popupService.getPopupContent(utils.getItemDataObj(row.id, row.wktComps[0].x, row.wktComps[0].y, row.radius, row.start, row.end, row.clusterId, row.payload, row.label))
			)
		}

		var onPointAnalyzed = function(row, overlay) {
			dataProcessor.processPoint(
				row.wktComps[0].x, row.wktComps[0].y, 
				row.radius, colorService.getColorHex(row.clusterId), overlay, 
				//need to be for analyzed
				popupService.getPopupContent(utils.getItemDataObj(row.id, row.wktComps[0].x, row.wktComps[0].y, row.radius, "", row.clusterId, row.payload))
			)
		}
		
		var onLineStringAnalyzed = function(row, overlay) {
			dataProcessor.processLineString(
				row.wktComps, colorService.getColorHex(row.clusterId), 
				row.radius, overlay, 
				//need to be for analyzed
				popupService.getPopupContent(utils.getItemDataObj(row.id, row.wktComps[0].x, row.wktComps[0].y, row.radius, "", row.clusterId, ""))
			);
		}

		var onPolygonAnalyzed = function(row, overlay) {
			dataProcessor.processPolygon(
				row.wktComps[0], colorService.getColorHex(row.clusterId), 
				overlay, popupService.getPopupContentForAnalyzed(row)
			);
		}
		
		var onRectangle = function(row, overlay, colorId) {
			var bounds = [[row[0], row[1]], [row[2], row[3]]];
			dataProcessor.processRectangle(
				bounds,
				colorService.getColorHex(colorId ? colorId : 0), 
				overlay, popupService.getPopupContentForRectangle(utils.getRectDataObj(utils.getOverlayName(colorId), bounds[0], bounds[1]))
			);
		}

		var processDataFromFile = function(fileName, data) {
			var processInner = function() {
				if (utils.isFileNameStartsWith(utils.getFileName(fileName), "partitions_")) {
					processPartitions(data, parserService.parsePointsRow)
					return;
				}
				if (utils.getFileFolder(fileName) === "analyzed") {
					processData(data, parserService.parseAnalyzedRow, onPointAnalyzed, onLineStringAnalyzed, onPolygonAnalyzed);
					return;
				}
				processData(data, parserService.parseRow, onPoint, onLineString, function(row, overlay) {});
			}
			setTimeout(processInner, 0);
		}
		
		var processPartitions = function(data, parseFunc) {
			var colorId = 0;
			var separator = ",";
			data.forEach(function(item) {
				var row = parseFunc(item, separator);
				var overlay = Overlays.getOverlay(utils.getOverlayName(colorId));
				if (!overlay) {
					overlay = Overlays.overlays[utils.getOverlayName(colorId)] = new L.LayerGroup();
				}
				layerGroupOfClusters.addLayer(overlay);//add to map directly to enable it right away
				onRectangle(row, overlay, colorId);
				colorId++;
			});
			//Overlays.overlays = utils.sortObjectByKey(Overlays.overlays);
			//Overlays.addOverlaysToControl(layerControl);
			//setLabelsColor(Overlays.overlays);
		}

		var processData = function(data, parseFunc, onPoint, onLineString, onPolygon) {
			data.forEach(function(item) {
				var row = parseFunc(item);
				var overlay = Overlays.getOverlay(utils.getClusterName(row.clusterId));
				if (!overlay) {
					overlay = Overlays.overlays[utils.getClusterName(row.clusterId)] = new L.LayerGroup();
				}
				layerGroupOfClusters.addLayer(overlay);//add to map directly to enable it right away
				switch(row.wktType) {
					case "point":		
						onPoint(row, overlay);
						break;
					case "linestring":
						onLineString(row, overlay);
						break;
					case "polygon":
						onPolygon(row, overlay);
						break;
					default:
						break;
				}
			});
			Overlays.overlays = utils.sortObjectByKey(Overlays.overlays);
			Overlays.addOverlaysToControl(layerControl);
			setLabelsColor(Overlays.overlays);
		}

		populateFilesListDropdown();
	})
}