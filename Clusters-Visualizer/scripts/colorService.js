define(["scripts/utils"], function(utils) {
	return {
		colorTemplate: "000000",
		getColorHex: function(num) {  
			var step = 50000;
			var maxColor = 16777215;//#FFFFFF
			return '#' + utils.completeTemplate(this.colorTemplate, ((num  * step) % maxColor).toString(16), "left");
		}
	}
});