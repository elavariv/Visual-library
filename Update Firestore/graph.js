const dims = {height: 300, width: 300, radius: 150};
const cent = {x: (dims.width/2 + 5), y:( dims.height/2 + 5)};

const canvas = d3.select('.canvas')
    .append('svg').attr('height', dims.height + 150).attr('width', dims.width + 150);

const graph = canvas.append('g').attr('transform', `translate(${cent.x},${cent.y})`);

// pie(data) function always takes array like input data as the argument 
// and returns an array objects with startAngle and endAngle, etc - one for each data point

const computeAngles = d3.pie() 
     .value(d=> d.cost) 
     .sort(null) 
// computeAngles is the result of d3.pie().value(d=>d.cost).sort(null), which is pie(data)

// unlike d3.pie(), d3.arc() only takes one data element (no arrays allowed)
// and returns one "d" value as a string
// the input object should have two properties: startAngle & endAngle
const arcPath = d3.arc() 
    .outerRadius(dims.radius)
    .innerRadius(dims.radius/2);

// Add tool tip - https://cdnjs.com/libraries/d3-tip
// this works only for d3 v5. With v6 and up, this throws error
const tip = d3.tip()
    .attr('class', 'tip')
    .html(d => {
        let content = `<div class="name">${d.data.name}</div>`;
        content += `<div class="cost">${d.data.cost}</div>`;
        return content;
    });

graph.call(tip);

const update = (data) => {

    //Build a scale to create colors for the pie slices
    pieColor = d3.scaleOrdinal()
                .domain(data.map(d=>d.name))
                .range(d3['schemeSet1'])
    
    //d3.selectAll() executes basic JS to select elements and return Selection$1 object
    const paths = graph.selectAll('path') 
         .data(computeAngles(data)); 
    //data() returns an object that conatins three sub objects - entry, exit, groups & parents

    paths.enter()
        .append('path')
            .attr('class', 'arc')
            .attr('stroke', 'black')
            .attr('stoke-width', 3)
            .attr('fill', d=>pieColor(d.data.name))//actual data is inside the object called "data"
            .transition().duration(750)
                .attrTween('d', arcTweenEnter)

    //Update selection. When we update the data, we just need to update d
    paths.attr('d', d=>arcPath(d))

    //Exit selection when we delete a data in the input
    paths.exit()
        .transition().duration(750)
            .attrTween('d', arcTweenExit)
        .remove()
    
    //add text (better add a group and add text & path to the group)
    paths.enter()
    .append("text")
        .text(d=>d.data.name)
        .attr("x", d=>arcPath.centroid(d)[0])
        .attr("y", d=>arcPath.centroid(d)[1])

    //update text
    //exti text


    // basic event listner for all path elements
    // graph.selectAll('path')
    //     .on('mouseover', handleMouseOver) 
    //     .on('mouseout', handleMouseOut) //handleMouseOver automatically gets d, i & n
        //d is the data of the element, n is the list of all paths. i is the index of the current element
        // .on('click', handleClick)

    //event listner that shows both the tooltip and the color change
    graph.selectAll('path')
        .on('mouseover', (d,i,n)=>{
            tip.show(d, n[i]);
            handleMouseOver(d,i,n);
        }) 
        .on('mouseout', (d,i,n)=>{
            tip.hide();
            handleMouseOut(d,i,n);
        }) 
        .on('click', handleClick)
};

var data = [];

db.collection('expenses').onSnapshot(res => {
    
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

//it calculates attribute "d" over time "t". 
//First the start angle is set as the end angle. 
//For each value of "t", the function i(t) returns the d value
const arcTweenEnter = (d) => {
    var i = d3.interpolate(d.endAngle, d.startAngle);

    return function(t){
        d.startAngle = i(t);
        return arcPath(d);
    }
}
const arcTweenExit = (d) => {
    var i = d3.interpolate(d.startAngle, d.endAngle);

    return function(t){
        d.startAngle = i(t);
        return arcPath(d);
    }
}

//Event Handlers. upto v5 (d,i,n) are the arguments. V6 and up only has 2 orgs (e,d)
//Mouse Over
const handleMouseOver = function (d, i ,n) { 
    d3.select(this)
        .transition().duration(300)
            .attr('fill', 'white')
}
//Mouse Out
const handleMouseOut = function (d, i ,n) {
    d3.select(this)
        .transition().duration(300)
            .attr('fill', pieColor(d.data.name))
}
//Delete data point on a Click
const handleClick = function (d, i ,n) {
    const id = d.data.id;
    db.collection('expenses').doc(id).delete();
}