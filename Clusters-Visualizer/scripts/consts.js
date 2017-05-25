define(function() {
    var consts = new function() {
        this.URL = "http://localhost:8081/";
        this.LEAFLET_ACCESS_TOKEN = 'pk.eyJ1Ijoia2FuZ2Fyb29vIiwiYSI6ImNqMXNkbWl5NjAwMWUzMnJ6eDdqbWV1dnAifQ.yHRhnXJ0ek-a6DrU5-GjEQ';
        this.LEAFLET_TILE_LAYER = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={access_token}';
        this.FILE_NAMES_LIST_PATH = this.URL + "file-names-list.txt";
        this.CLUSTER_ID_TEMPLATE = "0000";
    };

    return consts;
});
