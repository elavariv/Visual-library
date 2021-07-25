const dims = {height: 300, width: 300, radius: 150};
const cent = {x: (dims.width/2 + 5), y:( dims.height/2 + 5)};

const canvas = d3.select('.canvas')
    .append('svg').attr('height', dims.height + 150).attr('width', dims.width + 150);

const graph = canvas.append('g').attr('transform', `translate(${cent.x},${cent.y})`);

// pie(data) function always takes array like input data as the argument 
// and returns an array objects with startAngle and endAngle, etc - one for each data point

const computeAngles = d3.pie() //sets key variables - value, startAngle, etc and returns pie(data) obj
     .value(d=> d.cost) //sets the "value" variable and returns pie(data)
     .sort(null) //sets the "sort" variable and returns pie(data) object.
// computeAngles is the result of d3.pie().value(d=>d.cost).sort(null), which is pie(data)

// When value(d=>d.cost) executes. It changes the variable "value", which
// was holding a generic identify function. Now "value" will have d=>d.cost instead.

// Since the above code alters the variables "value" & "sort" in memory
// and returns the function pie(data) code, computeAngles is not of much use.
// You still need to invoke it using () operator.

// pie(data) needs an argument. So, you should pass an arg to invoke the funcion computeAngles.
// computeAngles(data) is same as d3.pie().value(d=>d.cost).sort(null)(data)
// This time pie(data) is executed, which returns an array

// The main reason for confusion is that JS allows a regular function to behave like an object
// hence functions can have their own properties and methods. 
// here pie(data) has methods like value(), sort(), etc

// unlike d3.pie(), d3.arc() only takes one data element (no arrays allowed)
// and returns one "d" value as a string
// the input object should have two properties: startAngle & endAngle
const arcPath = d3.arc() 
    .outerRadius(dims.radius)
    .innerRadius(dims.radius/2);

const update = (data) => {
    //d3.selectAll() executes basic JS to select elements and return Selection$1 object
    //Selection$1 object has methods like, append, attr, enter, exit, etc.
    //Every method of Selection$1 object executes some JS code and returns Selection$1 object

    const paths = graph.selectAll('path') 
         .data(computeAngles(data)); 
    //data() returns an object that conatins three sub objects - entry, exit, groups & parents
    //entry object holds an array that contains the input data in it's entrity.

    paths.enter()
        .append('path')
        .attr('class', 'arc')
        .attr('d', d=>arcPath(d)) 
        .attr('stroke', '#fff')
        .attr('stoke-width', 3);
    //attr() takes two arguments. First is always a string, which represents the HTML attribute
    //The second can be a string or a function. If it is a function, attr() method runs a 
    //loop for each data element and applys the provided function. Hence the function we provide
    //is always for individual data point, not for all data points.
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
