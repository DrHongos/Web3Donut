import React, {useEffect} from "react";
import '../../App.css';

const d3 = require("d3");

function CollapsibleTree(props) {

  const width = 700;
  let data;
  const dataOriginal = !props.dataGraphed || props.dataGraphed.children.length === 0;
  if(dataOriginal) {
    data = props.data;
  } else {
    data = props.dataGraphed;
  }


  const chart = () => {
    const dx = 10
    const dy = width/6
    const margin = ({top: 10, right: 60, bottom: 10, left: 60})
    const diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x)
    const tree = d3.tree().nodeSize([dx, dy])
    const root = d3.hierarchy(data);

    root.x0 = dy / 2;
    root.y0 = 0;
    root.descendants().forEach((d, i) => {
      d.id = i;
      d._children = d.children;
      if (d.depth && d.data.name.length !== 7 && !props.dataGraphed) d.children = null;
    });

    const svg = d3.select("#graph")
        .append('svg')
        .attr("viewBox", [-margin.left, -margin.top, width, dx])
        .style("font", "10px sans-serif")
        .style("user-select", "none");

    Object.entries(props.style ?? {}).forEach(([attr, val]) => {
      svg.style(attr, val)
    });

    const gLink = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1.5);

    const gNode = svg.append("g")
        .attr("cursor", "pointer")
        .attr("pointer-events", "all");


    function update(source) {
      const duration = d3.event && d3.event.altKey ? 2500 : 250;
      const nodes = root.descendants().reverse();
      const links = root.links();

      // Compute the new tree layout.
      tree(root);

      let left = root;
      let right = root;
      root.eachBefore(node => {
        if (node.x < left.x) left = node;
        if (node.x > right.x) right = node;
      });

      const height = right.x - left.x + margin.top + margin.bottom;

      const transition = svg.transition()
          .duration(duration)
          .attr("viewBox", [-margin.left, left.x - margin.top, width, height])
          .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

      // Update the nodes…
      const node = gNode.selectAll("g")
        .data(nodes, d => d.id);


      function goto(url){
        console.log(url)
        // const url = p.data.url;
        if(url) window.open(url, '_blank').focus();
      }


      // Enter any new nodes at the parent's previous position.
      const nodeEnter = node.enter().append("g")
          .attr("transform", d => `translate(${source.y0},${source.x0})`)
          .attr("fill-opacity", 0)
          .attr("stroke-opacity", 0)
          .on("click", (event, d) => {
            if(d._children){
              d.children = d.children ? null : d._children;
              update(d);
            }else{
              goto(d.data.url)
            }
          });

      nodeEnter.append("circle")
          .attr("r", 2.5)
          .attr("fill", d => d._children ? "#ff5733" : "#999")
          .attr("stroke-width", 10);

      nodeEnter.append("text")
          .attr("dy", "0.31em")
          .attr("x", d => d._children ? -6 : 6)
          .attr("text-anchor", d => d._children ? "end" : "start")
          .text(d => d.data.name)
          .on("mouseover", function (d) {
            // console.log(d.target)
            d3.select(d.target).style("fill", "blue");
          })
          .on("mouseout", function (d) {
            if(d.target._children){
              d3.select(d.target).style("fill", "#ff5733");
            }else{
              d3.select(d.target).style("fill", "black");
            }
          })
        .clone(true).lower()
          .attr("stroke-linejoin", "round")
          .attr("stroke-width", 3)
          .attr("stroke", "white");

      // Transition nodes to their new position.
      node.merge(nodeEnter).transition(transition)
          .attr("transform", d => `translate(${d.y},${d.x})`)
          .attr("fill-opacity", 1)
          .attr("stroke-opacity", 1);

      // Transition exiting nodes to the parent's new position.
      node.exit().transition(transition).remove()
          .attr("transform", d => `translate(${source.y},${source.x})`)
          .attr("fill-opacity", 0)
          .attr("stroke-opacity", 0);

      // Update the links…
      const link = gLink.selectAll("path")
        .data(links, d => d.target.id);

      // Enter any new links at the parent's previous position.
      const linkEnter = link.enter().append("path")
          .attr("d", d => {
            const o = {x: source.x0, y: source.y0};
            return diagonal({source: o, target: o});
          });

      // Transition links to their new position.
      link.merge(linkEnter).transition(transition)
          .attr("d", diagonal);

      // Transition exiting nodes to the parent's new position.
      link.exit().transition(transition).remove()
          .attr("d", d => {
            const o = {x: source.x, y: source.y};
            return diagonal({source: o, target: o});
          });

      // Stash the old positions for transition.
      root.eachBefore(d => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    update(root);
    return svg.node();
  }

  useEffect(() => {
    d3.selectAll("#graph").select('svg').remove();
    chart(); //useRef()?
  },[props.dataGraphed, props.data]);// eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <br />

      <div
        id="graph"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "5vh auto",
        }}
      >
      </div>
    </div>
  );
}

export default CollapsibleTree;
