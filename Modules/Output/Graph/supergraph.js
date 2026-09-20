// Graph.js
//Add A title to the graph
//Consider a Legend for multiple graphs
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
export class SuperGraph {
  //Might need changes
  constructor(options) {
    // Options: containerId, dataPoints array, labels, etc.
    this.options = options || {};
    this.divId = this.options.divId || 'my-graph-container';

    // Create the container div dynamically
    this._createContainer(this.options.parent);

    // Initialize data points
    this.points = this.options.points || [[[]]]; // array of graph points and a array for each point for same positions multiple verticals

    // Call setup functions
    this._initElements();
    this._bindEvents();

    // Resize and draw initially
    this._resizeCanvas();
    this.setPoints(this.points);
    this.draw();
  }
  //Same as before
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
  //Nothing new
  _createLabelDivs(count) {
    let html = '';
    for (let i = 0; i < count; i++) {
      html += `<div>0</div>`;
    }
    return html;
  }
//These still need to be initialized
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
//These events should still be fine
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
   /* const dpr = window.devicePixelRatio || 1;

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
this.canvas.style.imageRendering = 'crisp-edges';*/
    this.canvas.width = size;
    this.canvas.height = size;

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
//These should still be good
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

  setStepSize(stepsize) {
    this.options.stepsize = stepsize;
    this._calculateBounds();
    this._updateLabels();
    this.draw();
  }
//updated to calculate based on a 3 levels of arrays  
  _calculateBounds() {
    this.maxY = 0;
    this.minY = 0;
    for(let i=0;i<this.points.length;i++){
        for (let j=0;j<this.points[i].length;j++){
            //if (!isFinite(this.points[i][j])) this.points[i][j] = 0;
            for(let k=0;k<this.points[i][j].length;k++){
                if(this.points[i][j][k]>this.maxY) this.maxY=this.points[i][j][k];
                if(this.points[i][j][k]<this.minY) this.minY=this.points[i][j][k];
            }
        }
    }
  }
//Should work fine if it gives errors come back
  _updateLabels() {
    // For simplicity, fill labels with placeholder or based on data
    const count = this.xpointsDiv.children.length;
    for (let i = 0; i < count; i++) {
      this.xpointsDiv.children[i].innerHTML = Math.floor(i * this.points.length/this.options.stepsize/4)+this.options.xlabeloffset; // example
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
  //nothing changed here
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
  //Works with multiple graphs
  _drawGraph() {

    if (!this.points || this.points.length === 0) return;
    const ctx = this.ctx;
    const canvas = this.canvas;
    const max = this.maxY;
    const min = this.minY;
    const ratio = canvas.height / (max - min);
    const pixelsPerPoint =canvas.width / (this.points.length-1);
    let points=[...this.points];
    let linecolor=["black","black","black","black","black","black","black","black","black","black","black","black","black","black","black","black","black","black","black","black","black","black","black","black"];
    let infillcolor = ["rgba(0, 123, 255, 0.3)","rgba(255, 0, 0, 0.3)","rgba(0, 255, 0, 0.3)","rgba(255, 255, 0, 0.3)","rgba(255, 0, 255, 0.3)","rgba(0, 255, 255, 0.3)","rgba(128, 0, 128, 0.3)","rgba(128, 128, 0, 0.3)","rgba(128, 128, 128, 0.3)","rgba(255, 165, 0, 0.3)","rgba(255, 192, 203, 0.3)","rgba(173, 216, 230, 0.3)","rgba(144,238,144 ,0.3)","rgba(255 ,228 ,181 ,0.3)","rgba(221 ,160 ,221 ,0.3)","rgba(240 ,230 ,140 ,0.3)","rgba(135 ,206 ,250 ,0.3)","rgba(152 ,251 ,152 ,0.3)","rgba(255 ,105 ,180 ,0.3)","rgba(255 ,20 ,147 ,0.3)","rgba(75 ,0 ,130 ,0.3)","rgba(123 ,104 ,238 ,0.3)","rgba(72 ,61 ,139 ,0.3)"];



    for (let i = 0; i < points.length; i++) {
      for(let j=0;j<points[i].length;j++){
        for(let k=0;k<points[i][j].length;k++){
          points[i][j][k] *= ratio;
          points[i][j][k] -= min * ratio;
        }
      }
    } 
    ctx.setLineDash([5, 0]);
    for(let j=0;j<points[0].length;j++){
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      for (let i = 0; i < points.length; i++) {
        for(let k=0;k<points[i][j].length;k++){
          ctx.lineTo(i * pixelsPerPoint, canvas.height - points[i][j][k]);
        }
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      ctx.strokeStyle = linecolor[j];
      ctx.stroke();
      ctx.fillStyle = infillcolor[j];
      ctx.fill();
    }

    
    for (let i = 0; i < points.length; i++) {
      for(let j=0;j<points[i].length;j++){
        for(let k=0;k<points[i][j].length;k++){
          points[i][j][k] /= ratio;
          points[i][j][k] += min;
        }
      }
    } 
  }
  _drawCursor() {
    const ctx = this.ctx;
    const canvas = this.canvas;
    const ratio = canvas.height / (this.maxY - this.minY);
    const pixelsPerPoint =canvas.width / (this.points.length-1);
    let mouseX = this.drawlinex;
    let trueindex = mouseX / pixelsPerPoint;
    let index = Math.round(trueindex);
    if (index >= this.points.length) 
        index = this.points.length - 1;
    if(index<0)
        index=0;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.16)';
    ctx.beginPath();
    ctx.moveTo(pixelsPerPoint * index, 0);
    ctx.lineTo(pixelsPerPoint * index, canvas.height);
    ctx.stroke();
    for(let i=0;i<this.points[index].length;i++){
    ctx.beginPath();
    if(trueindex<index){
        ctx.arc(pixelsPerPoint * index, canvas.height - (this.points[index][i][0]-this.minY) * ratio, 5, 0, 2 * Math.PI);
    }
    else{
        ctx.arc(pixelsPerPoint * (index), canvas.height - (this.points[index][i][this.points[index][i].length-1]-this.minY) * ratio, 5, 0, 2 * Math.PI);
    }
    //ctx.fillStyle = "rgba(0, 123, 255, 0.2)";
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fill();
    }
    this._updateInfoBox(trueindex);
  }
  _updateInfoBox(theindex) {
    let infillcolor = ["rgba(0, 123, 255, 0.3)","rgba(255, 0, 0, 0.3)","rgba(0, 255, 0, 0.3)","rgba(255, 255, 0, 0.3)","rgba(255, 0, 255, 0.3)","rgba(0, 255, 255, 0.3)","rgba(128, 0, 128, 0.3)","rgba(128, 128, 0, 0.3)","rgba(128, 128, 128, 0.3)","rgba(255, 165, 0, 0.3)","rgba(255, 192, 203, 0.3)","rgba(173, 216, 230, 0.3)","rgba(144,238,144 ,0.3)","rgba(255 ,228 ,181 ,0.3)","rgba(221 ,160 ,221 ,0.3)","rgba(240 ,230 ,140 ,0.3)","rgba(135 ,206 ,250 ,0.3)","rgba(152 ,251 ,152 ,0.3)","rgba(255 ,105 ,180 ,0.3)","rgba(255 ,20 ,147 ,0.3)","rgba(75 ,0 ,130 ,0.3)","rgba(123 ,104 ,238 ,0.3)","rgba(72 ,61 ,139 ,0.3)"];

    const info = this.infobox;
    const canvas = this.canvas;
    let index = Math.round(theindex);
    if (index >= this.points.length)
        index = this.points.length - 1;
    const ratio = canvas.height / (this.maxY - this.minY);
    const pixelsPerPoint =canvas.width / (this.points.length-1);
    let maxtitlelength=0;
    for(let i=0;i<this.points[index].length;i++){
      if(this.options.graphtitles[i].length>maxtitlelength)
        maxtitlelength=this.options.graphtitles[i].length;
    }
    let inputvalue="<inline>";
    for(let i=0;i<this.points[index].length;i++){
      let value = Math.abs(this.points[index][i][0]);
      if(theindex>=index){
        value = Math.abs(this.points[index][i][this.points[index][i].length-1]);
      }
      let pointratio=0;    
      while (value > 1000) {
              value /= 1000;
              pointratio++;
          }
      inputvalue += `<span style="background-color:${infillcolor[i]}">${this.options.graphtitles[i]}:`;
      /*if(maxtitlelength>this.options.graphtitles[i].length){
        for(let j=0;j<maxtitlelength-this.options.graphtitles[i].length;j++){
          inputvalue += "\u2003";
        }
      }*/
      inputvalue += "</span>";
      if (this.points[index][i][0] < 0)
          inputvalue += "-";
      inputvalue += "$" + Math.round(value * 100) / 100 + characters[pointratio];
    inputvalue += "<br>";
    }
    inputvalue += "Y";
    switch(this.options.stepsize){
        case 12:
            inputvalue += Math.floor(theindex / 12)
            break;
        case 4:
            inputvalue += Math.floor(theindex / 4)
            break;
        case 1:
            inputvalue += Math.floor(theindex / 1)
            break;
        default:
            break;
    }
    if (theindex < index) {
        inputvalue += " End";
    }
    else {
        inputvalue += " Start";
    }
    if (this.options.stepsize === 12) {
        inputvalue += " M";
        inputvalue += Math.floor((theindex % 12)) + 1;
    }
    else if (this.options.stepsize === 4) {
        inputvalue += " Q";
        inputvalue += Math.floor((theindex % 4)) + 1;

    }
    info.innerHTML = inputvalue;
    // position info box
    const infoboxWidth = info.offsetWidth;
    let infoboxHeight = document.getElementById("infobox").offsetHeight;
    if (this.drawlinex <= canvas.width / 2) {
        info.style.left = `${pixelsPerPoint*index + 50 + (canvas.width / 9)}px`;
    } else {
        info.style.left = `${pixelsPerPoint*index + 50 + (canvas.width / 9) - infoboxWidth}px`;
    }
    if(theindex<index){
        info.style.top = `${canvas.height - (this.points[index][0][0]-this.minY)*ratio + 51 - infoboxHeight}px`;
    }
    else{
        info.style.top = `${canvas.height - (this.points[index][0][this.points[index][0].length-1]-this.minY)*ratio + 51 - infoboxHeight}px`;
    }
    info.style.display = 'block';
  }
}