d3.csv("assets/data/meteorite-landings.csv")
  .catch((err) => {
    throw err;
  })
  .then(function (data) {
    const ndx = crossfilter(data);
    const all = ndx.groupAll();
    console.log(all.value());
  });
