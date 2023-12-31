function _1(md){return(
md`# Medium baseline--滑鼠移動過去顯示該成員相關資訊(1pt)`
)}

function _simple1(d3,simple_data,drag,invalidation)
{
  // 指定圖表的尺寸。
  const width = 1000;
  const height = 1100;

  // 計算圖形並啟動力模擬。
  const root = d3.hierarchy(simple_data);
  const links = root.links();
  const nodes = root.descendants();
  
  const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(100).strength(1))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("x", d3.forceX())
      .force("y", d3.forceY());

  // 創建容器 SVG。
  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto;");

  // 添加連結。
  const link = svg.append("g")
      .attr("stroke", "#00f")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line");
  
  const linkForce = d3.forceLink(links)
    .id(d => d.id)
    .distance(1000) // 增加連結的距離
    .strength(1); // 可選：設定連結的強度

  // 設定節點的顏色，根據階層關係選擇不同的顏色
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10); // 使用 D3 的顏色比例尺
  
  // 添加節點。
  const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("transform", d => `translate(${d.x},${d.y})`) // 定位節點
      .call(drag(simulation));

  // 添加節點外框
  const circleRadius = 20; // 調整圓圈半徑大小
  node.append("circle")
      .attr("r", circleRadius)
      .attr("fill", "white") // 內部填充顏色
      .attr("stroke", d => colorScale(d.depth)) // 外框顏色根據節點深度
      .attr("stroke-width", 3);

  //設定圖片大小
  const size_offset = 1.2;//控制內圖片大小
  
  // 計算偏移量
  const offset = size_offset / 2;//控制內圖片放置位置的偏移量
  
  // 添加內圖
  node.append("image")
    .attr("x", -(circleRadius * offset)) // 將圖片的左上角放在圓圈框的左上角
    .attr("y", -(circleRadius * offset)) // 將圖片的左上角放在圓圈框的左上角
    .attr("width", circleRadius * size_offset) // 設置圖片寬度為圓圈直徑的兩倍
    .attr("height", circleRadius * size_offset) // 設置圖片高度為圓圈直徑的兩倍
    .attr("href",d => d.data.image_url);

   //添加節點文字說明 
  node.append("title")
        .text(d => {
        if (d.data.leval == 1) { // 如果沒有子節點，顯示父節點的資訊
          return d.data.Name;
        } else if(d.data.leval == 2){
          return  "組別 : "+d.data.Group+
                  "\n組長 : "+d.data.Teamleadername+
                  "\n隊名 : "+d.data.Teamname+
                  "\n團隊里程數 : "+d.data.Team_Mileage;
        }else if(d.data.leval == 3){ // 如果有子節點，顯示子節點的資訊
          return  "系所 : "+d.data.Department+
                  "\n學號 : "+d.data.Classnumber+
                  "\n姓名 : "+d.data.Name+
                  "\n個人里程數 : "+d.data.Personal_Mileage+
                  "\n作業1成績 : "+d.data.Hw1_score+
                  "分\n作業2成績 : "+d.data.Hw2_score+
                  "分\n作業3成績 : "+d.data.Hw3_score+
                  "分\n作業4成績 : "+d.data.Hw4_score+
                  "分\n作業5成績 : "+d.data.Hw5_score+
                  "分\n作業6成績 : "+d.data.Hw6_score+
                  "分\n作業7成績 : "+d.data.Hw7_score+
                  "分\n作業8成績 : "+d.data.Hw8_score+
                  "分\n作業9成績 : "+d.data.Hw9_score+
                  "分\n作業10成績 : "+d.data.Hw10_score+"分";
        }
      }
  );//加入要顯示的資訊 

  
 // 設定節點初始位置在畫布的中間
  nodes.forEach(node => {
    node.y = 0; // 將y座標設定在畫布的中間
  });

  // 更新力模擬的y方向力，讓節點向下運動
  simulation.force("y", d3.forceY().strength(0.1).y(d => d.depth * 100)); // 調整動力的方向和大小
  
  simulation.on("tick", () => {
    node.attr("transform", d => `translate(${d.x},${d.y})`); // 更新節點位置
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
  });

  invalidation.then(() => simulation.stop());

  return svg.node();
}


function _simple_data(FileAttachment){return(
FileAttachment("output.json").json()
)}

function _drag(d3){return(
simulation => {
  
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }
  
  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
  
  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended); 
}
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["output.json", {url: new URL("../output.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("simple1")).define("simple1", ["d3","simple_data","drag","invalidation"], _simple1);
  main.variable(observer("simple_data")).define("simple_data", ["FileAttachment"], _simple_data);
  main.variable(observer("drag")).define("drag", ["d3"], _drag);
  return main;
}
