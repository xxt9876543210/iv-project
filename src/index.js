import React from 'react';
import ReactDOM from 'react-dom';
import { csv } from 'd3';
import { ScatterPlot } from './scatterplot';
import { BarChart } from './barchart';
import { Tooltip } from "./tooltip";
import { CreateGraph } from "./nodechart";
import 'bootstrap/dist/css/bootstrap.min.css';

//text encoder
// var encoder = new TextEncoder();

//url
// const csvUrl = "https://raw.githubusercontent.com/xxt9876543210/iv-project/master/data/cleaned_joint.csv"
// const csvUrl = "https://raw.githubusercontent.com/xxt9876543210/iv-project/master/data/TEST.csv"
const csvUrl = "https://raw.githubusercontent.com/TheTarr/data/main/one_genera.csv"
const csvUrl2 = "https://raw.githubusercontent.com/xxt9876543210/iv-project/master/data/genre_use.csv"

//function for loading the data
// function useData(csvPath) {
//   const [dataAll, setData] = React.useState(null);
//   React.useEffect(() => {
//     csv(csvPath).then(data => {
//       data.forEach(d => {
//         d.Released_Year = +d.Released_Year;
//         d.IMDB_Rating = +d.IMDB_Rating;
//         d.revenue = +d.revenue;
//         // d.Genre = +d.Genre;
//         d.budget = +d.budget;
//         d.justified_revenue = +d.justified_revenue;
//         d.Series_Title = decodeURIComponent(encodeURIComponent(d.Series_Title));
//       });
//       setData(data);
//     });
//   }, []);
//   return dataAll;
// };

//new
function useData(csvPath1, csvPath2) {
  const [dataAll, setData1] = React.useState(null);
  const [dataAll2, setData2] = React.useState(null);

  React.useEffect(() => {
    csv(csvPath1).then(data => {
      data.forEach(d => {
        d.Released_Year = +d.Released_Year;
        d.IMDB_Rating = +d.IMDB_Rating;
        d.revenue = +d.revenue;
        d.budget = +d.budget;
        d.justified_revenue = +d.justified_revenue;
        d.Series_Title = decodeURIComponent(encodeURIComponent(d.Series_Title));
      });
      setData1(data);
    });

    csv(csvPath2).then(data => {
      data.forEach(d => {
        // do any necessary data cleaning or conversion here
        d.Released_Year = +d.Released_Year;
      });
      setData2(data);
    });
  }, []);

  return { dataAll, dataAll2 };
}
///




// function useData2(csvPath2) {
//   const [dataAll2, setData] = React.useState(1);
//   React.useEffect(() => {
//     csv(csvPath2).then(data => {
//       setData(data);
//     });
//   }, []);
//   return dataAll2;
// };


// heatmap
function getHeatmapData(data) {
  const heatmapData = {};

  // Count the number of Series_Title per year and genre
  data.forEach((d) => {
    const year = d.Released_Year;
    const genre = d.Genre;

    if (!heatmapData[year]) {
      heatmapData[year] = {};
    }

    if (!heatmapData[year][genre]) {
      heatmapData[year][genre] = 0;
    }

    heatmapData[year][genre]++;
  });

  return heatmapData;
}

function Heatmap({ data, offsetX, offsetY, width, height }) {
  const heatmapData = getHeatmapData(data);

  const years = Object.keys(heatmapData).map(Number);
  const genres = new Set();

  // Collect all genres
  Object.values(heatmapData).forEach((values) => {
    Object.keys(values).forEach((genre) => {
      genres.add(genre);
    });
  });

  const colorScale = d3
    .scaleSequential()
    .domain([0, d3.max(Object.values(heatmapData).map(Object.values).flat())])
    .interpolator(d3.interpolateBlues);

  const xScale = d3.scaleBand().domain(years).range([0, width]);
  const yScale = d3.scaleBand().domain([...genres]).range([height, 0]);

  return (
    <g transform={`translate(${offsetX}, ${offsetY})`}>
      {years.map((year) =>
        [...genres].map((genre) => {
          const value = heatmapData[year]?.[genre] ?? 0;
          return (
            <rect
              key={`${year}-${genre}`}
              x={xScale(year)}
              y={yScale(genre)}
              width={xScale.bandwidth()}
              height={yScale.bandwidth()}
              fill={colorScale(value)}
            />
          );
        })
      )}
      <g transform={`translate(-${offsetX}, -${offsetY})`}>
        <g transform={`translate(${offsetX - 10}, ${offsetY + height + 40})`}>
          <text x={width / 2} y={-10} textAnchor="middle" fill="white">
            Released Year
          </text>
        </g>
        {/* <g transform={`translate(${offsetX - 10}, ${offsetY - 100}) rotate(-90)`}>
          <text y={0} x={-height / 2} textAnchor="start" fill = "white"> */}
        <g transform={`translate(${offsetX - 10}, ${offsetY})`}>
          <text x={-10} y={-10} textAnchor="start" fill="white">
            Genre
          </text>
        </g>
      </g>
    </g>
  );
}

// function Heatmap({ data, offsetX, offsetY, width, height }) {
//   const heatmapData = getHeatmapData(data);

//   const years = Object.keys(heatmapData).map(Number);
//   const genres = new Set();

//   // Collect all genres
//   Object.values(heatmapData).forEach((values) => {
//     Object.keys(values).forEach((genre) => {
//       genres.add(genre);
//     });
//   });

//   const colorScale = d3
//     .scaleSequential()
//     .domain([0, d3.max(Object.values(heatmapData).map(Object.values).flat())])
//     .interpolator(d3.interpolateBlues);

//   const xScale = d3.scaleBand().domain(years).range([0, width]).padding(0.1);
//   const yScale = d3.scaleBand().domain([...genres]).range([height, 0]).padding(0.1);

//   return (
//     <g transform={`translate(${offsetX}, ${offsetY})`}>
//       {years.map((year) =>
//         [...genres].map((genre) => {
//           const value = heatmapData[year]?.[genre] ?? 0;
//           return (
//             <rect
//               key={`${year}-${genre}`}
//               x={xScale(year)}
//               y={yScale(genre)}
//               width={xScale.bandwidth()}
//               height={yScale.bandwidth()}
//               fill={colorScale(value)}
//             />
//           );
//         })
//       )}
//       <g transform={`translate(-${offsetX}, -${offsetY})`}>
//         <g transform={`translate(${offsetX}, ${offsetY + height})`}>
//           <text x={width / 2} y={35} textAnchor="middle">
//             Released Year
//           </text>
//           <g transform={`translate(0, 10)`}>
//             <Axis scale={xScale} orientation="bottom" />
//           </g>
//         </g>
//         <g transform={`translate(${offsetX - 40}, ${offsetY})`}>
//           <text y={-40} x={-height / 2} textAnchor="middle" transform="rotate(-90)">
//             Genre
//           </text>
//           <g transform={`translate(-10, 0)`}>
//             <Axis scale={yScale} orientation="left" />
//           </g>
//         </g>
//       </g>
//     </g>
//   );
// }

// function Axis({ scale, orientation }) {
//   const axisRef = React.useRef(null);
//   React.useEffect(() => {
//     const axis = d3.axisLeft(scale).tickFormat(d => d);
//     if (orientation === "bottom") {
//       axis.tickFormat(d => "'" + d.toString().slice(2));
//     }
//     d3.select(axisRef.current).call(axis);
//   }, [scale, orientation]);
//   return <g ref={axisRef} />;
// }

// the Chart component
function Charts() {
  const [range, setMonth] = React.useState('4');
  const SVG_WIDTH = 500;
  const SVG_HEIGHT = 400;
  const margin = { left: 50, right: 30, top: 30, bottom: 80 };
  const width = SVG_WIDTH - margin.left - margin.right;
  const height = SVG_HEIGHT - margin.top - margin.bottom;
  const [selectedStation, setSelectedStation] = React.useState(null);
  const [tooltipLeft, setTooltipLeft] = React.useState(null);
  const [tooltipTop, setTooltipTop] = React.useState(null);
  //the handler of the slider bar
  const changeHandler = (event) => {
    setMonth(event.target.value);
  }
  //loading the whole data set
  const {dataAll,dataAll2} = useData(csvUrl, csvUrl2);
  if (!dataAll) {
    return <pre>Loading...</pre>;
  };

  // load2nd
  // const dataAll2 = useData2(csvUrl2);
  // if (!dataAll2) {
  //   return <pre>Loading...</pre>;
  // };

  const YEAR = ['1920s', '1930s', '1940s', '1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s'];
  //get the monthly data
  const data = dataAll.filter(d => {
    return d.range === YEAR[range]
  });

  const dTooltip = data.filter(d => d.Series_Title === selectedStation)[0];

  // gptjiade
  //group data by year and genre to get count of series titles
  const genreCount = d3.group(data, d => d.Genre);
  const yearCount = d3.group(data, d => d.Released_Year);

  //get min and max count of series titles
  const minCount = d3.min(genreCount.values(), g => d3.min(g, d => d.Series_Title));
  const maxCount = d3.max(genreCount.values(), g => d3.max(g, d => d.Series_Title));

  //create color scale
  const colorScale = d3.scaleSequential().domain([minCount, maxCount]).interpolator(d3.interpolateYlOrRd);



  return <div>
    <div>
      <input key="slider" type='range' min='0' max='9' value={range} step='1' onChange={changeHandler} />
      <input key="monthText" type="text" value={YEAR[range]} readOnly />
    </div>
    <div className='row'>
      <div className='col-lg-6'>
        <svg width={'100%'} viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}>
          <ScatterPlot offsetX={margin.left} offsetY={margin.top} data={data} height={height} width={width}
            selectedStation={selectedStation} setSelectedStation={setSelectedStation}
            setTooltipLeft={setTooltipLeft} setTooltipTop={setTooltipTop} />
        </svg>
        <Tooltip d={dTooltip} left={tooltipLeft} top={tooltipTop} />
      </div>
      <div className='col-lg-6'>
        <svg width={'100%'} viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}>
          <BarChart offsetX={margin.left - 10} offsetY={margin.top} height={height} width={width} data={data} selectedStation={selectedStation} setSelectedStation={setSelectedStation} />
        </svg>
      </div>
    </div>
    <div className='row'>
      <div className='col-lg-6'>
        <svg width={'100%'} viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}>
          <Heatmap
            offsetX={margin.left + 10}
            offsetY={margin.top}
            data={dataAll2}
            height={height}
            width={width}
          />
        </svg>
      </div>
      <div className='col-lg-6'>
        <svg width={'100%'} viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}>
          <CreateGraph x={margin.left} y={margin.right} width={width} height={height} data={dataAll2} />
        </svg>
      </div>
    </div>
  </div>
}

const rootElement = document.getElementById('root')
ReactDOM.render(<Charts />, rootElement);