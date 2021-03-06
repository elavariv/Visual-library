//1. Set dimensions
const margin = {top: 40, right: 20, bottom: 40, left:50};
const graphWidth = 500 - margin.left - margin.right;
const graphHeight = 400 - margin.top - margin.bottom;

//2. Create SVG
const canvas = d3.select('.canvas')
    .append('svg')
    .attr('width', graphWidth + margin.left + margin.right)
    .attr('height', graphHeight + margin.top + margin.bottom);

//3. Create a group so that the group can be re positioned as a whole
const graph = canvas.append('g')
    .attr('width', graphWidth)
    .attr('height', graphHeight)
    .attr('transform', `translate(${margin.left},${margin.top})`);

//8. Add x and y axis
//set the scale and the range. Domain is set in update() as it needs Data
const xScale = d3.scaleTime().range([0, graphWidth]);
const yScale = d3.scaleLinear().range([graphHeight, 0]);

//create groups for the scales
const xAxisGroup = graph.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${graphHeight})`);
//by default x axis starts top left, so we transform the group to start at left bottom.
const yAxisGroup = graph.append('g')
        .attr('class', 'y-axis')

//10. Add tool tip - https://cdnjs.com/libraries/d3-tip
// this works only for d3 v5. With v6 and up, this throws error

const update = (data) => {

    //8.continuation - Add x & y axis
    //d3.extent() scans the data to find the earlierst and latest data
    xScale.domain(d3.extent(data, d=> new Date(d.date)));
    yScale.domain([0, d3.max(data, d=>d.distance)]);

    //Create the axis
    const xAxis = d3.axisBottom(xScale)
        .ticks(4)
        .tickFormat(d3.timeFormat('%b %d'))
    const yAxis = d3.axisLeft(yScale)
        .ticks(4)
        .tickFormat(d => d + 'm')

    //Attach xAxis and yAxis to the group element
    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    //rotate exis text
    xAxisGroup.selectAll('text')
        .attr('transform', 'rotate(-40)')
        .attr('text-anchor', 'end');
    //text-anchor changes the point where rotation starts. The Default is center
                

    //4. Add SVG element and attach data
    const circles = graph.selectAll('circle') 
         .data(data); 
    //data() returns an object that conatins three sub objects - entry, exit, groups & parents

    //5. Handle element removel
    // paths.exit().remove()

    //6. Handle Updates existin element by directly updating the element
    //paths.attr();

    //7. Handle new element creation 
    circles.enter()
        .append('circle')
            .attr('r', 4)
            .attr('cx', d=> xScale(new Date(d.date)))
            .attr('cy', d=> yScale(d.distance))
            .attr('fill', '#ccc');


    //9. Take care of user interaction
    // graph.selectAll('path')
    //     .on('mouseover', handleMouseOver) 
    //     .on('mouseout', handleMouseOut) 
    //     .on('click', handleClick)
    //handleMouseOver automatically gets d, i & n
    //d - data, n - array of selected HTML tags. i - index of the current tag


};

var data = [];

db.collection('activities').onSnapshot(res => {
    
    res.docChanges().forEach(change => {

        const doc = {...change.doc.data(), id: change.doc.id};
        
        switch (change.type) {
            case 'added':
                data.push(doc);
                break;
            case 'modified':
                const index = data.findIndex(item => item.id == doc.id)
                data[index] = doc;
                break;
            case 'removed':
                data = data.filter(item => item.id !== doc.id);
                break;
            default:
                break;
        }

    });

    update(data);

});

