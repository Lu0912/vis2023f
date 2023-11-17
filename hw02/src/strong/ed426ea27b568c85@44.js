function _1(md){return(
md`# HW2 Strong baseline (2pt)`
)}

function _data(FileAttachment){return(
FileAttachment("data.json").json()
)}

function _Counts(){return(
[]
)}

function _Constellation(){return(
[
  "牡羊座",
  "金牛座",
  "雙子座",
  "巨蟹座",
  "獅子座",
  "處女座",
  "天秤座",
  "天蠍座",
  "射手座",
  "摩羯座",
  "水瓶座",
  "雙魚座",
]
)}

function _5(Counts,data)
{
  Counts.length = 0;
  for (var y=0; y< 12; y++) { 
    Counts.push({Constellation:y, gender:"male", count:0}); 
    Counts.push({Constellation:y, gender:"female", count:0}); 
  }
  data.forEach (x=> {
    var i = (x.Constellation)*2 + (x.Gender== "男" ? 0 : 1); 
    Counts[i].count++;
  })
  return Counts
}


function _6(Plot,Counts,Constellation){return(
Plot.plot({
  width: 1000,
  grid: true,
  y: {label: "count"},
  marks: [
    Plot.ruleY([0]),
    Plot.barY(Counts, {x: "Constellation", y: "count", tip: true , fill:"gender" ,title: (d) => `Constellation: ${Constellation[d.Constellation]}
        \ngender: ${d.gender} (${d.count})`}),
    Plot.axisX({tickFormat: d => {return Constellation[d];},}),
  ]
})
)}

function _7(Plot,data,Constellation){return(
Plot.plot({
  width: 1000,
  x: {
    label: "Constellation",
    grid: true,
  },
  y: { grid: true, label: "count" },
  marks: [
    Plot.rectY(data, Plot.binX({ y: "count" }, { x: "Constellation", interval: 1, fill: "Gender",tip: true,
       title: (d) => `Constellation: ${Constellation[d.Constellation]}
        \ngender: ${d.Gender}`},)),
    Plot.gridY({ interval: 1, stroke: "white", strokeOpacity: 0.5 }),
    Plot.axisX({tickFormat: d => {return Constellation[d];},}),
  ]
})
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["data.json", {url: new URL("../data.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("Counts")).define("Counts", _Counts);
  main.variable(observer("Constellation")).define("Constellation", _Constellation);
  main.variable(observer()).define(["Counts","data"], _5);
  main.variable(observer()).define(["Plot","Counts","Constellation"], _6);
  main.variable(observer()).define(["Plot","data","Constellation"], _7);
  return main;
}
