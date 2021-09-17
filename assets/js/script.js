const nameTypeChart = dc.rowChart("#nameType");
const recClassChart = dc.rowChart("#recClass");
const fallChart = dc.rowChart("#fall");
const yearChart = dc.barChart("#year");
// dc.config.defaultColors(d3.schemeCategory10);
d3.csv("assets/data/meteorite-landings.csv")
  .catch((err) => {
    throw err;
  })
  .then(function (data) {
    const ndx = crossfilter(data);
    const all = ndx.groupAll();

    const nameTypeDim = ndx.dimension((d) => d.nametype);
    const recClassDim = ndx.dimension((d) => d.recclass);
    const fallDim = ndx.dimension((d) => d.fall);
    const yearDim = ndx.dimension((d) => d.year);

    const nameTypeGroup = nameTypeDim.group();
    const recClassGroup = recClassDim.group();
    const fallGroup = fallDim.group();
    const yearGroup = yearDim.group();

    nameTypeChart
      .dimension(nameTypeDim)
      .group(nameTypeGroup)
      .elasticX(true);

    
    recClassChart
      // .height(500)
      .dimension(recClassDim)
      .group(recClassGroup)
      .data((group) => group.top(10))
      .elasticX(true);
      
        
    fallChart
      .dimension(fallDim)
      .group(fallGroup)
      .elasticX(true);

    yearChart
      .dimension(yearDim)
      .group(yearGroup)
      .elasticY(true)
    //   .elasticX(true)
      .x(d3.scaleLinear().domain([1900, 2019]));

    dc.renderAll();    
  });
