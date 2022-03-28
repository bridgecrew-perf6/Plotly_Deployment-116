function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var newSample = samples.filter(sampleObj => sampleObj.id == sample);
    console.log(newSample);
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = newSample[0];
    console.log(firstSample)

        // Deliverable 3
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var metaArray = metadata.filter(sampleObj => sampleObj.id == sample);
    console.log(metaArray);
        // Deliverable 3
    // Create a variable that holds the first sample in the array.
    var result = metaArray[0];
    console.log(result);
        // Deliverable 3
    // 2. Create a variable that holds the first sample in the metadata array.
    var result1 = metaArray[0];
    
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = firstSample.otu_ids;
    var otuIdsSliced = otuIds.slice(0,10).map(otuId => `OTU ${otuId}`).reverse();
    console.log(otuIdsSliced)

    var otuLabels = firstSample.otu_labels;
    var otuLabelsSliced = otuLabels.slice(0,10).reverse();
    console.log(otuLabelsSliced);

    var sampleValues = firstSample.sample_values;
    var sampleValuesSliced = sampleValues.slice(0,10).reverse();
    console.log(sampleValuesSliced);

        // Deliverable 3
    // 3. Create a variable that holds the washing frequency.
    var washing = parseFloat(result1.wfreq)
    console.log(washing)

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIdsSliced

    // 8. Create the trace for the bar chart. 
    var barData = [ {
      x: sampleValuesSliced,
      y: yticks,
      text: otuLabelsSliced,
      type: 'bar',
      orientation: 'h',
      marker: {
        color: '#FF6347',
        opacity: 0.8,}
    }
      
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
    title: "Top 10 Bacterial Cultures",
    titlefont: {"size": 20},
    xaxis: {title: "Sample Value"},
    yaxis: {title: "Ids"} 
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // Deliverable 2
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: 'RdBu',
      }
    }];
  
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures per Sample",
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Sample Value"},
      titlefont: {"size": 25},
      hovermode: "closest",
      height: 600,
      width: 1300
      };
  
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    // Deliverable 3
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      title: {text: "Scrubs per Week", font: {size: 15}},
      value: washing,
      type: "indicator",
      mode: "gauge+number",
      tickmode: 'linear',
      gauge: {
        axis: { range: [null, 10], dtick: 2, tick0: 0 },
        bar: { color: "black" },
        bgcolor: "white",
        borderwidth: 1,
        bordercolor: "white",
        steps: [
          { range: [0, 2], color: "#FF6347"},
          { range: [2, 4], color: "#FA8072"},
          { range: [4, 6], color: "#F4A460"},
          { range: [6, 8], color: "#B0E0E6" },
          { range: [8, 10], color: "#4682B4" },
        ]},
     
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      title: "Belly Button Washing Frequency",
      titlefont: {"size": 20}
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
    });

    }