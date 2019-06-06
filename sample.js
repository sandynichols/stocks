//waits for our website to "get ready"
$(document).ready(function() {
	var indicator = "None";

	//gets indicator if one is selected, otherwise None

	$(".dropdown-menu a").click(function(){
    	$("#dropdownMenuButton:first-child").text($(this).text());
    	$("#dropdownMenuButton:first-child").val($(this).text());
    	indicator = $(this).text();
    	console.log(indicator);


   });

	//this following function triggers when the "query" button is clicked
	$("#button-query").click(function() {

		//store the stock ticker and the API key from our form input
		var stock = $("#stock").val();
		var apikey = $("#key").val();

		//get our interval
		var interval = $('input[name=intervals]:checked').val();
		var data = [];

		//plot stock
		$.getJSON(

			//this line is where we create the link to http get from
		    "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol="+stock+"&interval="+interval+"&apikey="+apikey,

		    //result is the JSON passed back from the HTTP get, so below is where we process it
		    function(result) {
		    	console.log(result);

		    	var label = "Time Series ("+interval+")";
		    	console.log(label);

		    	//get just the time series data from the query
		    	timeData = result[label];

		    	//initialize empty dates and values arrays
		    	dates = [];
		    	values = [];

		    	console.log(timeData);

		    	//iterate through our data, get dates and closing values
		    	for (const key of Object.keys(timeData)) {
		    		//this add the time to our dates
		    		dates.push(key);
		    		//this add the closing values to our values array
		       		values.push(timeData[key]["4. close"]);
				}

				//this is where we plot our graph, using plotly
		    	var trace1 = {
					x: dates,
					y: values,
					name: stock,
					type: 'scatter'
				};

				data = data.concat(trace1);


				//plot indicator too if one exists
				if(indicator != "None") {
					$.getJSON(

						//this line is where we create the link to http get from
					    
					    "https://www.alphavantage.co/query?function="+indicator+"&symbol="+stock+"&interval="+interval+"&time_period=100&series_type=close&apikey="+apikey,

					    //result is the JSON passed back from the HTTP get, so below is where we process it
					    function(result) {
					    	console.log(result);

					    	var label = "Technical Analysis: "+indicator;

					    	//get just the time series data from the query
					    	timeData = result[label];

					    	//initialize empty dates and values arrays
					    	dates = [];
					    	values = [];

					    	console.log(timeData);

					    	//iterate through our data, get dates and closing values
					    	for (const key of Object.keys(timeData)) {
					    		//this add the time to our dates
					    		dates.push(key);
					    		//this add the closing values to our values array
					       		values.push(timeData[key][indicator]);
							}

							dates = dates.slice(0,100);
							values = values.slice(0,100);

							//this is where we plot our graph, using plotly
					    	var trace2 = {
								x: dates,
								y: values,
								name: indicator,
								type: 'scatter'
							};
							console.log(trace2);


							data = data.concat(trace2);
							Plotly.newPlot('graph', data);
							
					    }
					);
				}

				Plotly.newPlot('graph', data);

		    }
		);

		

		
		
	});
});