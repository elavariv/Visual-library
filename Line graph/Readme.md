## Generate Line chart
### Learnings
#### Line chart
1. Line generator requires the input to have an arrya of data points with x & y value. Each of the data points are connected to form the line. So, the input data should be an **array of array**
2. Data points must be **sorted** for the line chart to work, if not, you will see point A connected to a random point D, which gets connected to another random point B
3. If you have multiple SVG elements such as circles and path, you just have to do the entry/update/exit code for one element (Circle). The other element (Path) will only need the update code. 
#### Javascript
1. data-* attribute in button tag to store data for processing later
2. change HTML tag data based on button clicked