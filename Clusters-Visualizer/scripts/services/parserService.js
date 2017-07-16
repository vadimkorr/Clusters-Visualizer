define(["wicket"], function(Wkt) {
    return {
        parseRow: function(row) {
			var arr = row.toString().split(";");
			var wkt = new Wkt.Wkt();
			wkt.read(arr[1]);
			return {
				"id": arr[0],
				"radius": arr[2],
				"start": arr[3],
				"end": arr[4],
				"label": arr[5],
				"clusterId": arr[arr.length - 1],
				"wktType": wkt.type,
				"wktComps": wkt.components,
				"payload": arr[arr.length - 2]
			}
		},
		parseAnalyzedRow: function(row) {
			var arr = row.toString().split(";");
			var wkt = new Wkt.Wkt();
			wkt.read(arr[8]);
			return {
				"clusterId": arr[0],
				"size": arr[1],
				"minTimeIntervalStart": arr[2],
				"minTimeIntervalEnd": 	arr[3],
				"maxTimeIntervalStart": arr[4],
				"maxTimeIntervalEnd": 	arr[5],
				"timeStart": arr[6],
				"timeEnd": arr[7],
				"wktType": wkt.type,
				"wktComps": wkt.components
			}
		},
		parsePointsRow: function(row, separator) {
			var arr = row.toString().split(separator).map(x => parseFloat(x));
			return arr;
		}
    }
});