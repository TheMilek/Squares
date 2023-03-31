
"use strict";  

var canvas;    
var graphics;  

function randomColorString() {
    var r = Math.floor(256*Math.random());
    var g = Math.floor(256*Math.random());
    var b = Math.floor(256*Math.random());
    return "rgb(" + r + "," + g + "," + b + ")";
}
    
function installMouseHandler() {

    var dragging = false;  
    var startX, startY;    
    var prevX, prevY;      
    
    var colorChoice;  
    
    function doMouseDown(evt) {
        if (dragging) {
            return; 
        }
        if (evt.button != 0) {
            return;  
        }
        var x,y;  
        var r = canvas.getBoundingClientRect();
        x = Math.round(evt.clientX - r.left);  
        y = Math.round(evt.clientY - r.top);   
        dragging = true;  
        if (dragging) {
            startX = prevX = x;
            startY = prevY = y;
            document.addEventListener("mousemove", doMouseMove, false);
            document.addEventListener("mouseup", doMouseUp, false);
        }
        colorChoice = Number(document.getElementById("colorChoice").value);
    }
    
    function doMouseMove(evt) {
            
        if (!dragging) {
            return;  
        }
        var x,y;  
        var r = canvas.getBoundingClientRect();
        x = Math.round(evt.clientX - r.left);  
        y = Math.round(evt.clientY - r.top);
        
        if ( Math.abs(x-prevX) + Math.abs(y-prevY) < 3 ) {
            return;  
        }
            
        if (colorChoice == 0) {
            graphics.fillStyle = randomColorString();
        }
        else if (colorChoice == 1) {
            graphics.fillStyle = "red";
        }
        else if (colorChoice == 2) {
            graphics.fillStyle = "green";
        }
        else if (colorChoice == 3) {
            graphics.fillStyle = "blue";
        }
        else if (colorChoice == 4) {
            graphics.fillStyle = "pink";
        }
        graphics.fillRect(x-20,y-20,40,40);
        graphics.strokeRect(x-20,y-20,40,40);
        
        prevX = x;  
        prevY = y;
    }
    
    function doMouseUp(evt) {
        if (!dragging) {
            return;  
        }
        dragging = false;
        document.removeEventListener("mousemove", doMouseMove, false);
        document.removeEventListener("mouseup", doMouseMove, false);
     }
     
     canvas.addEventListener("mousedown", doMouseDown, false);

    const clear = document.getElementById('clear');
    clear.addEventListener('click', function(event) {
        graphics.fillStyle = "white";
        graphics.fillRect(0,0,canvas.width,canvas.height);
    });
} 


function addGraphicsContextExtras(graphics) {
    graphics.strokeLine = function(x1,y1,x2,y2) {
       this.beginPath();
       this.moveTo(x1,y1);
       this.lineTo(x2,y2);
       this.stroke();
    }
    graphics.fillCircle = function(x,y,r) {
       this.beginPath();
       this.arc(x,y,r,0,2*Math.PI,false);
       this.fill();
    }
    graphics.strokeCircle = function(x,y,radius) {
       this.beginPath();
       this.arc(x,y,radius,0,2*Math.PI,false);
       this.stroke();
    }
    graphics.fillPoly = function() { 
        if (arguments.length < 6)
           return;
        this.beginPath();
        this.moveTo(arguments[0],arguments[1]);
        for (var i = 2; i+1 < arguments.length; i = i + 2) { 
           this.lineTo(arguments[i],arguments[i+1]);
        }
        this.closePath();
        this.fill();
    }
    graphics.strokePoly = function() { 
        if (arguments.length < 4)
           return;
        this.beginPath();
        this.moveTo(arguments[0],arguments[1]);
        for (var i = 2; i+1 < arguments.length; i = i + 2) { 
           this.lineTo(arguments[i],arguments[i+1]);
        }
        this.closePath();
        this.stroke();
    }
    graphics.fillOval = function(x,y,horizontalRadius,verticalRadius) {
       this.save();
       this.translate(x,y);
       this.scale(horizontalRadius,verticalRadius);
       this.beginPath();
       this.arc(0,0,1,0,2*Math.PI,false);
       this.restore();
       this.fill();
    }
    graphics.strokeOval = function(x,y,horizontalRadius,verticalRadius) {
       this.save();
       this.translate(x,y);
       this.scale(horizontalRadius,verticalRadius);
       this.beginPath();
       this.arc(0,0,1,0,2*Math.PI,false);
       this.restore();
       this.stroke();
    }
    graphics.getRGB = function(x,y) {
        var color = this.getImageData(x,y,1,1);
        return color.data;
    }
}

   
function init() {
    try {
        canvas = document.getElementById("canvas");
        graphics = canvas.getContext("2d");
    } catch(e) {
        document.getElementById("canvasholder").innerHTML =
           "<p>Canvas graphics is not supported.<br>" +
           "An error occurred while initializing graphics.</p>";
           return;
    }
    addGraphicsContextExtras(graphics);
    installMouseHandler();
    graphics.fillStyle = "white";
    graphics.fillRect(0,0,canvas.width,canvas.height);
}
