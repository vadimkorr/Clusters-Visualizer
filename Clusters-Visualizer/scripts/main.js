requirejs.config({
    "paths": {
        "modules": "../node_modules",
        "jquery": "../node_modules/jquery/dist/jquery.min",
        "wicket": "../node_modules/wicket/wicket",
        "leaflet": "../node_modules/leaflet/dist/leaflet",    
        "jquery.csv": "../node_modules/jquery-csv/src/jquery.csv.min",  
        "wicketLeaflet": "../node_modules/wicket/wicket-leaflet",

        "leafletCorridor": "./libs/leaflet-corridor",

        "colorService": "./services/colorService",
        "processorService": "./services/processorService",
        "popupService": "./services/popupService",
        "parserService": "./services/parserService",

        "utils": "./helpers/utils",
        "consts": "./helpers/consts",
    },
    "shim": {
    }

});

requirejs(["index"]);