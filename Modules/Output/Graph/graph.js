// Graph.js
let characters = [
  "",       // 1
  "k",      // thousand (10^3)
  "m",      // million (10^6)
  "b",      // billion (10^9)
  "t",      // trillion (10^12)
  "q",      // quadrillion (10^15)
  "qu",     // quintillion (10^18)
  "s",      // sextillion (10^21)
  "se",     // septillion (10^24)
  "oct",    // octillion (10^27)
  "n",      // nonillion (10^30)
  "d"       // decillion (10^33)
];
export class Graph {
  constructor(options) {
    // Options: containerId, dataPoints array, labels, etc.
    this.options = options || {};
    this.divId = this.options.divId || 'my-graph-container';

    // Create the container div dynamically
    this._createContainer(this.options.parent);

    // Initialize data points
    this.points = this.options.points || [];

    // Call setup functions
    this._initElements();
    this._bindEvents();

    // Resize and draw initially
    this._resizeCanvas();
    this.setPoints(this.points);
    this.draw();
  }

  _createContainer(parent) {
    const container = document.createElement('div');
    container.id = this.divId;
    container.style.position = 'relative';
    container.style.width = '100%'; // or fixed width
    container.innerHTML = `
      <canvas></canvas>
      <div id="xlabel">${this.options.xLabel || 'X'}</div>
      <div id="xpoints">${this._createLabelDivs(5)}</div>
      <div id="ypoints">${this._createLabelDivs(5)}</div>
      <div id="infobox" style="display:none;"></div>
    `;
    document.getElementById('canvas-div')?.remove(); // Remove existing if any
    parent.appendChild(container);
  }

  _createLabelDivs(count) {
    let html = '';
    for (let i = 0; i < count; i++) {
      html += `<div>0</div>`;
    }
    return html;
  }

  _initElements() {
    this.container = document.getElementById(this.divId);
    this.canvas = this.container.querySelector('canvas');
    this.xlabelDiv = this.container.querySelector('#xlabel');
    this.xpointsDiv = this.container.querySelector('#xpoints');
    this.ypointsDiv = this.container.querySelector('#ypoints');
    this.infobox = this.container.querySelector('#infobox');

    this.ctx = this.canvas.getContext('2d');

    // Resize the canvas
    this._resizeCanvas();

    // Initialize labels
    this._updateLabels();

    // Initialize bounds
    this._calculateBounds();
  }

  _bindEvents() {
    const self = this;
    window.addEventListener('resize', () => {
      self._resizeCanvas();
      self.draw();
    });
    this.canvas.addEventListener('mousemove', (e) => {
      this._handleMouseMove(e);
    });
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      this._handleTouchMove(e);
    }, { passive: false });
    this.canvas.addEventListener('mouseenter', () => {
      this.drawline = true;
      this.draw();
    });
    this.canvas.addEventListener('mouseleave', () => {
      this.drawline = false;
      this.draw();
    });
    this.canvas.addEventListener('touchstart', (e) => {
      this._handleTouchStart(e);
    });
    window.addEventListener('touchstart', (e) => {
      if (e.target !== this.canvas) {
        this.drawline = false;
        this.draw();
      }
    });
    this.canvas.addEventListener('touchcancel', () => {
      this.drawline = false;
      this.draw();
    });
  }
  //Resize working correctly with CSS values
  _resizeCanvas() {
    const containerWidth = (document.getElementById('canvas-div')?.clientWidth - 100) * 0.9;
    const size = containerWidth;
    // Get the device pixel ratio
    const dpr = window.devicePixelRatio || 1;

    // Update canvas bitmap size (multiplied by DPR)
    this.canvas.width = size * dpr;
    this.canvas.height = size * dpr;

    // Update canvas style size (CSS pixels)
    this.canvas.style.width = `${size}px`;
    this.canvas.style.height = `${size}px`;
    
    this.ctx = this.canvas.getContext('2d');
    // Reset and apply the DPR scale
    // (Crucial: setting width/height resets the canvas state, so scale must happen now)
    this.ctx.scale(dpr, dpr);

// 👇 FORCE THE CONTEXT TO TURN OFF BLURRY FILTERING
this.ctx.imageSmoothingEnabled = false;
this.ctx.webkitImageSmoothingEnabled = false;
this.ctx.mozImageSmoothingEnabled = false;

// 👇 FORCE THE BROWSER CSS ENGINE TO RENDER PIXEL-PERFECT
this.canvas.style.imageRendering = 'pixelated'; 
this.canvas.style.imageRendering = 'crisp-edges';
    /*this.canvas.width = size;
    this.canvas.height = size;*/

    // position labels
    const ylabel = this.container.querySelector('#ypoints');
    const xlabel = this.container.querySelector('#xpoints');
    const xtitle = this.xlabelDiv;

    ylabel.style.height = size / 4 * 5 + "px";
    ylabel.style.top = `${50 - size / 4 * 5 / 10}px`;
    ylabel.style.right = `${50 + size + 5}px`;
    xlabel.style.width = size / 4 * 5 + "px";
    xlabel.style.right = `${50 - 10}px`;
    xlabel.style.top = `${50 + size}px`;
    this.xlabelDiv.style.top = `${50 + size + 20}px`;
    document.getElementById('xlabel').style.width = `${(document.getElementById('canvas-div')?.clientWidth - 100) * 0.9 + 100}px`;
  }
//???????
  _handleMouseMove(e) {
    this.drawlinex = e.offsetX;
    if (this.drawlinex < 1) this.drawlinex = 1;
    this.draw();
  }
  _handleTouchMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    this.drawlinex = Math.max(1, touchX);
    this.draw();
  }
  _handleTouchStart(e) {
    const rect = this.canvas.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    this.drawlinex = Math.max(1, touchX);
    this.drawline = true;
    this.draw();
  }

  setPoints(pointsArray) {
    this.points = pointsArray;
    this._calculateBounds();
    this._updateLabels();
    this.draw();
  }

  _calculateBounds() {
    this.maxY = Math.max(...this.points, 0);
    this.minY = Math.min(...this.points, 0);
  }
//Labels are now updated correctly
  _updateLabels() {
    // For simplicity, fill labels with placeholder or based on data
    const count = this.xpointsDiv.children.length;
    for (let i = 0; i < count; i++) {
      this.xpointsDiv.children[i].innerHTML = Math.floor(i * this.options.timeRange/4); // example
      this.ypointsDiv.children[i].innerHTML = `$${Math.round((this.maxY - this.minY) * i / count + this.minY)}`;
    }
    for (let i = 0; i < this.ypointsDiv.children.length; i++) {
        let num = Math.abs(Math.round((this.maxY - this.minY) / 4 * i) + this.minY);
        let point = 0;
        while (num > 1000) {
            num /= 1000;
            point++;
        }
        if (point < characters.length) {
            this.ypointsDiv.children[4-i].innerHTML = "";
            if (((this.maxY - this.minY) / 4 * i + this.minY) < 0)
                this.ypointsDiv.children[4-i].innerHTML += "-";
            this.ypointsDiv.children[4-i].innerHTML += `$${Math.round(num * 10) / 10}${characters[point]}`;
        }
        else {
            this.ypointsDiv.children[4-i].innerHTML = "NaN";
        }
    }
  }
//Correct
  draw() {
    const ctx = this.ctx;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this._drawGraph();
    if (this.drawline){
        this.infobox.style.display = "revert";
        this._drawCursor();
    }
    else{
        this.infobox.style.display = "none";
    }
  }
//Correct
  _drawGraph() {

    if (!this.points || this.points.length === 0) return;
    const ctx = this.ctx;
    const canvas = this.canvas;
    const max = this.maxY;
    const min = this.minY;

    const ratio = canvas.height / (max - min);
    const pixelsPerPoint =this.points.length%2 ? canvas.width / (this.points.length-1): canvas.width / (this.points.length);
    let points=[...this.points];
    let linecolor="black";
    let infillcolor = 'rgba(0, 123, 255, 0.2)';
    for (let i = 0; i < points.length; i++) {
        points[i] *= ratio;
        points[i] -= min * ratio;
    }
    ctx.setLineDash([5, 0]);
    ctx.beginPath();
    ctx.strokeStyle = linecolor;
    ctx.moveTo(0, canvas.height);
    for (let i = 0; i < this.points.length; i++) {
        ctx.lineTo(i * pixelsPerPoint, canvas.height - points[i]);
        i++
        ctx.lineTo((i + 1) * pixelsPerPoint, canvas.height - points[i]);
    }
    ctx.stroke();
    // Fill under
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);

    for (let i = 0; i < this.points.length; i++) {
      ctx.lineTo(i * pixelsPerPoint, canvas.height - points[i]);
        i++
        ctx.lineTo((i + 1) * pixelsPerPoint, canvas.height - points[i]);
    }
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();;
    ctx.closePath();
    ctx.fillStyle = infillcolor;
    ctx.fill();
  }
//Correct
  _drawCursor() {
    const ctx = this.ctx;
    const canvas = this.canvas;
    const ratio = canvas.height / (this.maxY - this.minY);
    const pixelsPerPoint =this.points.length%2 ? canvas.width / (this.points.length-1): canvas.width / (this.points.length);
    let mouseX = this.drawlinex;
    let index = Math.floor(mouseX / pixelsPerPoint);
    if (index >= this.points.length) 
        index = this.points.length - 1;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.16)';
    ctx.beginPath();
        if (index % 2 === 0) {
            ctx.moveTo(pixelsPerPoint * index, 0);
            ctx.lineTo(pixelsPerPoint * index, canvas.height);
        }
        else {
            ctx.moveTo(pixelsPerPoint * (index+1), 0);
            ctx.lineTo(pixelsPerPoint * (index+1), canvas.height);
        }
    ctx.stroke();

    ctx.beginPath();
    if (index % 2 === 0) {
        ctx.arc(pixelsPerPoint * index, canvas.height - (this.points[index]-this.minY) * ratio, 5, 0, 2 * Math.PI);
    }
    else {
        ctx.arc(pixelsPerPoint * (index+1), canvas.height - (this.points[index]-this.minY) * ratio, 5, 0, 2 * Math.PI);
    }
    ctx.fillStyle = "rgba(0, 123, 255, 0.2)";
    ctx.fill();
    this._updateInfoBox(index);
  }
//Correct
  _updateInfoBox(theindex) {
    const info = this.infobox;
    const canvas = this.canvas;
    const ratio = canvas.height / (this.maxY - this.minY);
    let value = Math.abs(this.points[theindex]);
    const pixelsPerPoint =this.points.length%2 ? canvas.width / (this.points.length-1): canvas.width / (this.points.length);
    let pointratio=0;    
    while (value > 1000) {
            value /= 1000;
            pointratio++;
        }
    let inputvalue="<inline>";
    if (this.points[theindex] < 0)
        inputvalue += "-";
    inputvalue += "$" + Math.round(value * 100) / 100 + characters[pointratio];
    inputvalue += "<br>";
    inputvalue += "Y";
    switch(this.options.stepsize){
        case 12:
            inputvalue += Math.floor(theindex / 24)
            break;
        case 4:
            inputvalue += Math.floor(theindex / 8)
            break;
        case 1:
            inputvalue += Math.floor(theindex / 2)
            break;
        default:
            break;
    }
    if (theindex % 2) {
        inputvalue += " End";
    }
    else {
        inputvalue += " Start";
    }
    if (this.options.stepsize === 12) {
        inputvalue += " M";
        inputvalue += Math.floor((theindex % 24) / 2) + 1;
    }
    else if (this.options.stepsize === 4) {
        inputvalue += " Q";
        inputvalue += Math.floor((theindex % 8) / 2) + 1;

    }
    info.innerHTML = inputvalue;
    // position info box
    const infoboxWidth = info.offsetWidth;
    if (this.drawlinex <= canvas.width / 2) {
        
        if (theindex % 2 === 0) {
            info.style.left = `${pixelsPerPoint*theindex + 50 + (canvas.width / 9)}px`;
        }
        else {
            info.style.left = `${pixelsPerPoint*(theindex+1) + 50 + (canvas.width / 9)}px`;
        }
    } else {
        if (theindex % 2 === 0) {
      info.style.left = `${pixelsPerPoint*theindex + 50 + (canvas.width / 9) - infoboxWidth}px`;
        }
        else {
            if(theindex+1<=this.points.length)
                info.style.left = `${pixelsPerPoint*(theindex+1) + 50 + (canvas.width / 9) - infoboxWidth}px`;
        }
    }
    info.style.top = `${canvas.height - (this.points[theindex]-this.minY)*ratio + 50 - 54}px`;
    info.style.display = 'block';
    console.log(this.minY);
  }
}