function getDummy() {
	var labels = [ 'data1', 'data2','data3','data4','data5'];
			
	var data = [
		{ MIN: 10, Q1: 40, Q2: 60, Q3: 80, MAX: 120 },
		{ MIN: 20, Q1: 50, Q2: 70, Q3: 100, MAX: 130 },
		{ MIN: 30, Q1: 70, Q2: 90, Q3: 120, MAX: 170 },
		{ MIN: 25, Q1: 60, Q2: 80, Q3: 110, MAX: 140 },
		{ MIN: 30, Q1: 45, Q2: 50, Q3: 70, MAX: 125 },
	];
	return { labels: labels, data: data };
}
window.onload = function() {
	var dummy = getDummy();
	Boxplot.print('chart', dummy.data, dummy.labels);
}