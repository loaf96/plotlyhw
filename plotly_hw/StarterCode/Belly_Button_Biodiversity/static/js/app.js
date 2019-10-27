function buildMetaData(sample) {
  var metadata = d3.select("#sample-metadata");
  var url = "/metadata/" + sample;
  d3.json(url).then(function(getData) {
    console.log(getData);
    metadata.html('');
    Object.entries(getData).forEach(([key, value]) => metadata.append('p').text(`${key}: ${value}`))
  });
}

function buildCharts(sample) {
  var urlToo = "/samples/" + sample;
  d3.json(urlToo).then(function(getData) {
    console.log(getData);

    var samplesToo = [];
    var idsToo = [];
    var labelsToo = [];
    
    for (var i=1; i < 10; i++) {
      samplesToo.push(getData.sample_values[i]);
      idsToo.push(getData.otu_ids[i]);
      labelsToo.push(getData.otu_labels[i]);
    }

    var traceOne = {
      values: samplesToo.sort(function(a,b){return a-b}),
      labels: idsToo.map(String),
      hovertext: labelsToo,
      type: 'pie'
    };

    var traceTwo = {
      x: getData.otu_ids,
      y: getData.sample_values,
      mode: 'markers',
      text: getData.otu_labels,
      marker: {
        size: getData.sample_values,
        color: getData.samlpe_values
      },
    };

    var dataOne = [traceOne];
    var dataTwo = [traceTwo];

    var layout = {
      height: 400,
      width: 400,
    };

    var layoutTwo = {
      height: 1200,
      width: 500,
    };

    Plotly.newPlot('pie', dataOne, layout);
    Plotly.newPlot('bubble', dataTwo, layoutTwo);
  });
}
function init() {
  var selector = d3.select('#selDataset');
  d3.json('/names').then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector.append('option').text(sample).property('value', sample);
    });

    const sampleFirst = sampleNames[0];
    buildCharts(sampleFirst);
    buildMetaData(sampleFirst);
  })
}

function optionChanged(sampleNew) {
  buildCharts(sampleNew);
  buildMetaData(sampleNew);
}

init();