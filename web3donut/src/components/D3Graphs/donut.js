import React, {useEffect} from "react";
import logo from '../../libs/images/raidGuildLogo.png';
import '../../App.css';

const d3 = require("d3");

function Donut(props) {

  const width = 932;
  const radius = width / 6
  const format = d3.format(",d")
  const arc = d3.arc()
  .startAngle(d => d.x0)
  .endAngle(d => d.x1)
  .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
  .padRadius(radius * 1.5)
  .innerRadius(d => d.y0 * radius)
  .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1))

  let data;

  const dataOriginal = !props.dataGraphed || props.dataGraphed.children.length === 0;
  if(dataOriginal) {
    data = props.data;
  } else {
    data = props.dataGraphed;
  }

  const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1)) // this kills the color palette in ipfs_API
  const partition = data => {
    const root = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);
    return d3.partition()
        .size([2 * Math.PI, root.height + 1])
      (root);
  }

  let chart = () => {
    const root = partition(data);

    root.each(d => d.current = d);

    const svg = d3.select("svg")
        .attr("viewBox", [0, 0, width, width])
        .style("font", "10px sans-serif");

    Object.entries(props.style ?? {}).forEach(([attr, val]) => {
      svg.style(attr, val)
    });

    const g = svg.append("g")
        .attr("transform", `translate(${width / 2},${width / 2})`);

    const div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("color", 'white');

    const path = (
      g.append("g")
      .selectAll("path")
      .data(root.descendants().slice(1))
      .join("path")
      .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
      .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
      .attr("d", d => arc(d.current))
      .on('mouseover', (evt, d) => {
        console.info('EVT', evt.target)
        div.transition()
        .duration(200)
        .style("opacity", .9);
        // div.html(`<span>name: ${evt.target.__data__.data.name}</span><br/><span>url: ${d.target.__data__.data.url}</span><br/><span>description: ${d.target.__data__.data.description}</span>`)
        // .style("right", "1px")
        // .style("top",  "1px");
      })
      .on("mouseout", function(d) {
        div.transition()
        .duration(500)
        .style("opacity", 0)
      })
    );

    path.style('cursor', d => (
      Boolean(d.children) ? 'crosshair' : 'pointer'
    ))
    .on('click', clicked)

    path.append("title")
        .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);

    const label = (
      g.append("g")
        .attr("pointer-events", "all")
        .attr("text-anchor", "middle")
        .style("user-select", "none")
      .selectAll("text")
      .data(root.descendants().slice(1))
      .join("text")
        .attr("dy", "0.35em")
        .attr("fill-opacity", d => +labelVisible(d.current))
        .attr("transform", d => labelTransform(d.current))
        .style('fill', 'white')
        .text(d => d.data.name)
        .style('cursor', d => (
          Boolean(d.children) ? 'crosshair' : 'pointer'
        ))
        .on('click', clicked)
        .on('mouseover', (evt) => {
          d3.select(evt.target)
          .transition()
          .duration(100)
          .style('font-size', '20px');
        })
        .on('mouseout', (evt) => {
          d3.select(evt.target)
          .transition()
          .duration(100)
          .style('font-size', '10px');
        })
    );

    const parent = g.append("image")
        .attr("pointer-events", "all")
        .on("click", clicked)
          .attr("xlink:href",logo)
          .attr("width", 160)
          .attr("height", 160)
          .attr('x',-80)
          .attr('y',-80)

    function clicked(event, p) {
      const { data: { url } } = p;
      if(url) {
        return window.open(url, '_blank').focus();
      }
      console.info('P', p)
      if(!p) return;
      parent.datum(p.parent || root);
      root.each(d => d.target = {
        x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
        x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
        y0: Math.max(0, d.y0 - p.depth),
        y1: Math.max(0, d.y1 - p.depth)
      });

      const t = g.transition().duration(350);

      path.transition(t)
          .tween("data", d => {
            const i = d3.interpolate(d.current, d.target);
            return t => d.current = i(t);
          })
        .filter(function(d) {
          return +this.getAttribute("fill-opacity") || arcVisible(d.target);
        })
          .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
          .attrTween("d", d => () => arc(d.current));

      label.filter(function(d) {
          return +this.getAttribute("fill-opacity") || labelVisible(d.target);
        }).transition(t)
          .attr("fill-opacity", d => +labelVisible(d.target))
          .attrTween("transform", d => () => labelTransform(d.current));
    }

    function arcVisible(d) {
      return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
    }

    function labelVisible(d) {
      return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
    }

    function labelTransform(d) {
      const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
      const y = (d.y0 + d.y1) / 2 * radius;
      return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    }
    return svg.node();
  }

  useEffect(() => {
    d3.selectAll("svg > *").remove();
    chart(); //useRef()?
  },[props.dataGraphed, props.data]);// eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>

        <div
          id="3d-graph"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "5vh auto",
          }}
        >
        <svg></svg>

      </div>
    </div>
  );
}

export default Donut;
