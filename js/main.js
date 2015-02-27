;(function() {
	/**
	 * Weather Card
	 */
	var AnalyticsCard = new CardPrototype({

		/**
		 * @var string 	The name of this card
		 */
		name: "AnalyticsCard",

		version: "",

		init: function() {
			$.getScript("https://cdnjs.cloudflare.com/ajax/libs/Chart.js/1.0.1/Chart.min.js");
			$.getScript("https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js");
		},

		preload: function() {},
		render: function() {
			var self = this;

			$.ajax({
				url: $("#endpoint").attr("data-attr-endpoint") + "/api/event/pageviews",
				type: "GET",
				headers: CiiMSDashboard.getRequestHeaders(),
				success: function(data, textStatus, jqXHR) {
					var totalCount = 0,
						countedRows = 0,
						actualData = [],
						sortedData = data.response.sort(function(a, b){
					    return b.count - a.count;
					});

					$.each(sortedData, function() {
						if (
							!self.contains(this.uri, "/dashboard") &&
							!self.contains(this.uri, "/cloud") &&
							!self.contains(this.uri, "/login") &&
							this.count >= 5
						)
						{
							if (countedRows >= 15)
								return;

							var color = d3.scale.category20().range()[countedRows];
							actualData.push({
								value: parseInt(this.count),
								label: this.uri,
								color: color,
								highlight: color
							});

							totalCount += parseInt(this.count);
							countedRows++;
						}
					});

					var ctx = $("#"+self.id+" .analyticsdonutchart").get("0").getContext("2d");
					var myDoughnutChart = new Chart(ctx).Doughnut(actualData, {
						animationEasing: "easeOutCubic"
					});

					$("#"+self.id+" .pageviews-container .count").text(totalCount);
				}
			});
		},

		reload: function() {},

		contains: function(string, it) {
			return string.indexOf(it) != -1;
		}
	});
}(this));
