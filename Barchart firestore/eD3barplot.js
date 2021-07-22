// Better to include the properties as a separate .js file
//---------------------------
var barProp = {
    //graph area properties
    margin: {
                top: 40,
                right: 20,
                bottom: 20,
                left: 70
            },
    //data properties
    collectionName : 'gdp',
    nameField : 'country',
    widthField : 'country',
    heightField : 'gdp',
    barColor : 'orange',

    //transition properties
    transDuration : 500,
};
//---------------------------

//Select the div which has the class "canvas"
const canvas = d3.select('.canvas');

//Create the parent SVG element
//  Step1 Set the width and height of the canvas
//     capture canvas dimension on the initial load
captureWindowSize();
//     capture canvas dimension on resize
window.addEventListener("resize", captureWindowSize);

var canvasWidth, canvasHeight, margin;

function captureWindowSize() {
    let canvas = document.querySelector('.canvas');
    canvasWidth = canvas.clientWidth;
    canvasHeight = canvas.clientHeight;
    //margin = { top: 40, bottom: 20, left: 70, right: 20 }
    
}

const svg = canvas.append('svg')
                .attr("width", canvasWidth)
                .attr('height', canvasHeight)

//Create a margin inside the SVG Canvas for the group element
const graphWidth = canvasWidth - barProp.margin.left - barProp.margin.right
const graphHeight = canvasHeight - barProp.margin.top - barProp.margin.bottom;

/* Create a group for all rect elements so that we can move 
the entire graph to desired location */
const graph = svg.append('g')
.attr('width', graphWidth)
.attr('height', graphHeight)
.attr('transform', `translate(${barProp.margin.left}, ${barProp.margin.top})`)

//Create groups for XAxis and YAxis
const xAxisGrop = graph.append('g')
    .attr('transform', `translate(0, ${graphHeight})`); //shift down while keeping left
const yAxisGrop = graph.append('g');

/* This is the main function that follows d3 update pattern
*/
const update = (data) => {
    
    //create a scale for Y axis
    const max = d3.max(data, d => d.gdp);
    const y = d3.scaleLinear()
                .domain([0, max])
                .range([graphHeight, 0]); //To reverse the Y axis ticks

    //create a scale for X axis
    const x = d3.scaleBand()
                .domain(data.map(item => item.country)) 
                .range([0,500]) //sets the total lenght of X axis
                .paddingInner(0.2) //adds space between elements
                .paddingOuter(0.2) //adds space before and after the graph

    //Create and call the axes
    const xAxis = d3.axisBottom(x); //pass d3.scaleBand() created earlier
    const yAxis = d3.axisLeft(y); //pass d3.scaleLinear() created earlier

    xAxisGrop.call(xAxis)
    yAxisGrop.call(yAxis);

    //bind data to rect elements
    const rects = graph.selectAll('rect').data(data);        
 
    /*After the first time execution, there will be some rectangles in the DOM
    If the data changes, update existing rectangles with the new data */
    rects.attr('x', d => x(d.country)) 
        .attr('width', d => x.bandwidth(d.country)) 
        .attr('fill', 'orange')
        .transition(barProp.transDuration)
            .attr('y', d => y(d.gdp))
            .attr('height', d => graphHeight - y(d.gdp)) ;

    /* When the program runs for the first time, there are no rect elements.
    Create new rectangles using enter selection */
    rects.enter()
        .append('rect')
        .attr('x', d => x(d.country)) 
        .attr('y', graphHeight) //before transition, set Y to base of the graph
        .attr('width', d => x.bandwidth(d.country)) 
        .attr('height', 0) //before transition set height to 0
        .attr('fill', barProp.barColor)
        .transition().duration(barProp.transDuration)
            .attr('y', d => y(d.gdp)) //after transition Y
            .attr('height', d => graphHeight-y(d.gdp)); //after transition height

    /* Delete rect element if the data is updated and has less data points than 
    the existing elements. We should delete elements first before we add or 
    update elements. If we don't delete first, any animation will look weired*/
    rects.exit().remove();        
};

var data = [];

db.collection(barProp.collectionName).onSnapshot(res => {
    
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

/*Read from firestore db, but without realtime connection
You need to refresh the page to see the update to the graph
but it is pretty simple to test */

// db.collection('gdp').get().then(res => {
    
//     //read data from the Firestore connection response variable "res"
//     var data = [];
//     res.docs.forEach(doc => {
//         data.push(doc.data());
//     });

//     update(data);

// })



