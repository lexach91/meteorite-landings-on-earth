const nameTypeChart = dc.rowChart("#nameType");
const recClassChart = dc.pieChart("#recClass");
const fallChart = dc.pieChart("#fall");
const yearChart = dc.barChart("#year");
// dc.config.defaultColors(d3.schemeCategory10);
d3.csv("assets/data/meteorite-landings.csv")
  .catch((err) => {
    throw err;
  })
  .then(function (data) {
    const ndx = crossfilter(data);
    const all = ndx.groupAll();

    const allDim = ndx.dimension((d) => d);
    const nameTypeDim = ndx.dimension((d) => d.nametype);
    const recClassDim = ndx.dimension((d) => d.recclass);
    const fallDim = ndx.dimension((d) => d.fall);
    const yearDim = ndx.dimension((d) => d.year);
    const coords = ndx.dimension((d) => [d.reclong, d.reclat]);
    const mass = ndx.dimension((d) => d.mass);

    coords.filter((d) => d[0] !== "");

    // console.log(yearDim.bottom(10));

    const nameTypeGroup = nameTypeDim.group();
    const recClassGroup = recClassDim.group();
    const fallGroup = fallDim.group();
    const yearGroup = yearDim.group();
    const coordsGroup = coords.group();
    // console.log(coordsGroup.top(1))
    nameTypeChart.dimension(nameTypeDim).group(nameTypeGroup).elasticX(true);

    recClassChart
      // .height(500)
      .dimension(recClassDim)
      .group(recClassGroup)
      .data((group) => group.top(10));
    //   .elasticX(true);

    fallChart.dimension(fallDim).group(fallGroup);
    //   .elasticX(true);

    yearChart
      .dimension(yearDim)
      .group(yearGroup)
      .elasticY(true)
      //   .elasticX(true)
      .x(d3.scaleLinear().domain([1900, 2019]));

    var map = L.map("map").setView([39, 34], 2);
    var meteoriteMarkers = new L.FeatureGroup();

    L.tileLayer(
      "https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
      {
        id: "satellite-streets-v11",
        accessToken:
          "pk.eyJ1IjoibGV4YWNoOTEiLCJhIjoiY2t0djA5ZDduMDNzaTJwbjRpM2FvcWllNiJ9.lcz7-gBRDJ__hxv1vRjU4g",
        maxZoom: 16,
      }
    ).addTo(map);

    for (let meteor of allDim.top(200)) {
      // var loc = [d.reclat, d.reclong]
      var meteorName = meteor.name;
      var meteorMass = meteor.mass;
      var marker = L.marker([meteor.reclat, meteor.reclong]);
      marker.bindPopup("<p>" + meteorName + " Mass: " + meteorMass + "</p>")
      meteoriteMarkers.addLayer(marker);
    }

    map.addLayer(meteoriteMarkers);
    map.fitBounds(meteoriteMarkers.getBounds());



    dc.renderAll();
  });



