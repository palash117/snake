const GRID_SIZE = 20
const GRID_SNAKE_POINT = 0
const GRID_FEED_POINT = 1
const GRID_EMPTY_POINT = 2
const REFRESH_DELAY = 150
const LEFT = {
    dx: -1,
    dy: 0
    
}

const RIGHT = {
    dx: 1,
    dy: 0
    
}

const UP = {
    dx: 0,
    dy: 1
    
}

const DOWN = {
    dx: 0,
    dy: -1,
    
}
var currentPos = {
    x:0,
    y:0
}

var velocity
var grid = new Array()
var feedGenerator
feedGenerator ={
    feed: null,
    generateRandom:function(){
        var randomPosition={
                x:  Math.floor(Math.random()*GRID_SIZE),
                y:  Math.floor(Math.random()*GRID_SIZE)
            }
        while (grid[randomPosition.x][randomPosition.y]==GRID_SNAKE_POINT){
            randomPosition = {
                x:  Math.floor(Math.random()*GRID_SIZE),
                y:  Math.floor(Math.random()*GRID_SIZE)
            }
        }
        this.feed = randomPosition
        return randomPosition
    },
    generateFeed: function(){
        randomFeed = this.generateRandom()
        grid[randomFeed.x][randomFeed.y]=GRID_FEED_POINT
    },
};
var queue = {
    first: null,
    last: null,
    length: 0,
    addToFirst: function(position){
        if( this.first== null){
            this.first = {
                position:position,
                next: null,
                previous: null,
            }
        }
        else{
            temp = {
                position:position,
                next: this.first,
                previous: null,
            }
            this.first.previous = temp
            this.first = temp
        }
        this.length= this.length+1
        if(this.last==null){
            this.last = this.first
        }
    },
    removeLast: function(){
        if(this.last!=null){
        secondLast = this.last.previous
        if (secondLast != null){
            secondLast.next = null
            this.last = secondLast
            
        }
        else {
            this.first = null
            this.last=null
        }
        this.length = this.length -1
        }
        //
    },
    getAllPositions: function(){
        temp = this.first
        positions = new Array()
        while(temp!= null){
            positions.push(temp.position)
            temp=temp.next
        }
        return positions
    }

}
initialize()


function initialize(){
    createGrid()
    paintGrid()
    velocity = RIGHT
    console.log("reached")
    //
    //queue=undefined
    queue.addToFirst(currentPos)
    feedGenerator.generateFeed()
    updateGridAndPaintGrind()
}

function createGrid(){
    for( var i = 0; i<GRID_SIZE; i++){
        grid.push(new Array())
        for(var j=0; j<GRID_SIZE; j++){
            grid[i].push(GRID_EMPTY_POINT)
        }
    }
    grid[currentPos.x][currentPos.y]= GRID_SNAKE_POINT
}

function paintGrid(){
     var table= document.getElementById("table")
    html= "";
    for( var i = 0; i<GRID_SIZE; i++){
        html = html+"<tr>"
        for(var j=0; j<GRID_SIZE; j++){
            html = html + "<td>" + getSpanHtmlForGridPoint(grid[i][j])+"</td>"
        }
        html = html+"</tr>"
    }
    table.innerHTML = html
}

function updateGridAndPaintGrind(){
    
    console.log("updating...")
    updateGrid()
    paintGrid()
}

function updateGrid(){
    newPos = updatePosition()
    
    if(checkGridBreached(newPos) || checkSelfCrossed(newPos)){
        clearInterval(UPDATE_INTERVAL)
        alertGridBreached()
    }
    else{
        

        if( !(currentPos.x == feedGenerator.feed.x && currentPos.y== feedGenerator.feed.y)){
            queue.removeLast()
        }
        else{
            
            feedGenerator.generateFeed()
        }
        grid[currentPos.x][currentPos.y]=GRID_EMPTY_POINT
        grid[newPos.x][newPos.y]= GRID_SNAKE_POINT
        currentPos = newPos
        queue.addToFirst(currentPos)
        positions = queue.getAllPositions()
        
        // remove all points from grid
        for( var i = 0; i<GRID_SIZE; i++){
            for(var j=0; j<GRID_SIZE; j++){
                grid[i][j]=GRID_EMPTY_POINT
            }
        }
        grid[feedGenerator.feed.x][feedGenerator.feed.y]= GRID_FEED_POINT
        for(var i=0; i< positions.length ; i++){
            grid[positions[i].x][positions[i].y]=GRID_SNAKE_POINT
        }
        
    }
    
}

function updatePosition(){
    var newPos = {
        x: currentPos.x+velocity.dx,
        y: currentPos.y+velocity.dy
    }
    console.log(newPos)
    return newPos
}

function checkGridBreached(newPos){
    if( newPos.x>= GRID_SIZE || newPos.x<0 || newPos.y>= GRID_SIZE || newPos.y<0 ){
        return true
    }
    return false
}

function checkSelfCrossed(newPos){
    positions = queue.getAllPositions()
    for( var i=0 ; i< positions.length; i++){
        if (newPos.x == positions[i].x && newPos.y == positions[i].y){
            return true;
        }
    }
    return false
}
function alertGridBreached(){
    alert("GAME OVER")
}

UPDATE_INTERVAL= setInterval(updateGridAndPaintGrind, REFRESH_DELAY)
document.onkeydown = checkKey
function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
        // up arrow
        newVelocity = LEFT
    }
    else if (e.keyCode == '40') {
        // down arrow
        newVelocity = RIGHT
    }
    else if (e.keyCode == '37') {
       // left arrow
        newVelocity = DOWN
    }
    else if (e.keyCode == '39') {
       // right arrow
        newVelocity = UP
    }
    
    if( !oppositeVelocity(newVelocity)){
        velocity = newVelocity
    }

}

function oppositeVelocity(newVelocity){
    if( velocity.dx * newVelocity.dx + velocity.dy*newVelocity.dy ==-1){
        return true
    }
    return false
}

function getSpanHtmlForGridPoint(gridPoint){
    switch(gridPoint){
        case GRID_EMPTY_POINT:
            return '<span class="emptydot"></span>'
        case GRID_FEED_POINT:
            return '<span class="feeddot"></span>'
        case GRID_SNAKE_POINT:
            return '<span class="snakedot"></span>'
    }
}


