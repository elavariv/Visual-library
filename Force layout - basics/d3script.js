//1. Set dimensions
const margin = {top: 40, right: 20, bottom: 40, left:50};
const graphWidth = 1200 - margin.left - margin.right;
const graphHeight = 1200 - margin.top - margin.bottom;

//2. Create SVG
const canvas = d3.select('.canvas')
    .append('svg')
    .attr('width', graphWidth + margin.left + margin.right)
    .attr('height', graphHeight + margin.top + margin.bottom);

//3.1 Create a group for circles
const graph = canvas.append('g')
    .attr('width', graphWidth)
    .attr('height', graphHeight)
    .attr('transform', `translate(${margin.left},${margin.top})`);

const popScale = d3.scaleLinear().range([2,200])

const update = (data) => {

    popScale.domain([d3.min(data, d=>d.population), d3.max(data, d=>d.population)])
    //console.log(pop)
    //4. Add force simulation
    const simulation = d3.forceSimulation(data)
        .force('charge', d3.forceManyBody().strength(2))
        .force('center', d3.forceCenter(graphWidth/2, graphHeight/2))
        .force('collide', d3.forceCollide().radius(d=>popScale(d.population)+2))
        .on('tick', ticked);

    function ticked(){
        //ticked() gets input data as {<userdata>; x:48, y:54, vx-0.6:, vy:1.43}
        graph.selectAll('circle').data(data).join('circle')
        .attr('r', d=>popScale(d.population))
        .attr('cx', d=>d.x)
        .attr('cy', d=>d.y)
        .attr('fill', 'purple')
    }
    

};

//prep data
forceData = [{r:200, color:'blue'},
            {r:30, color:'purple'},
            {r:50, color:'red'},
            {r:120, color:'darkgrey'},
            {r:170, color:'green'}
        ]

update(worldData);
