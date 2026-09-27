// Graph.js
// Add a title to the graph
// Consider a Legend for multiple graphs

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

const LINE_COLORS = new Array(24).fill("black");

const FILL_COLORS = [
  "rgba(0, 123, 255, 0.3)", "rgba(255, 0, 0, 0.3)", "rgba(0, 255, 0, 0.3)",
  "rgba(255, 255, 0, 0.3)", "rgba(255, 0, 255, 0.3)", "rgba(0, 255, 255, 0.3)",
  "rgba(128, 0, 128, 0.3)", "rgba(128, 128, 0, 0.3)", "rgba(128, 128, 128, 0.3)",
  "rgba(255, 165, 0, 0.3)", "rgba(255, 192, 203, 0.3)", "rgba(173, 216, 230, 0.3)",
  "rgba(144,238,144 ,0.3)", "rgba(255 ,228 ,181 ,0.3)", "rgba(221 ,160 ,221 ,0.3)",
  "rgba(240 ,230 ,140 ,0.3)", "rgba(135 ,206 ,250 ,0.3)", "rgba(152 ,251 ,152 ,0.3)",
  "rgba(255 ,105 ,180 ,0.3)", "rgba(255 ,20 ,147 ,0.3)", "rgba(75 ,0 ,130 ,0.3)",
  "rgba(123 ,104 ,238 ,0.3)", "rgba(72 ,61 ,139 ,0.3)"
];

// points[i][j] = a single bar (i) made of stacked segment values (j).
// This turns each bar's segments into running totals so segment j's
// fillRect can start exactly where segment j-1 left off.
//No Idea just adds points together to make a cumulative graph. This is used for stacked bar graphs and line graphs.
function getCumulativePoints(points) {
  const cumulative = [];
  for (let i = 0; i < points.length; i++) {
    cumulative[i] = [];
    let running = 0;
    for (let j = 0; j < points[i].length; j++) {
      running += points[i][j];
      cumulative[i][j] = running;
    }
  }
  console.log("Points:");
  console.log(points);
  console.log("Cumulative Points:");
  console.log(cumulative);
  return cumulative;
}

// Shared "$1.2m" style abbreviation used by both the axis labels and the hover box.
//Seems good
function abbreviateNumber(num, decimals = 1) {
  let value = Math.abs(num);
  let point = 0;
  while (value > 1000) {
    value /= 1000;
    point++;
  }
  const overflow = point >= characters.length;
  return { value, suffix: overflow ? "" : characters[point], overflow };
}
//Seems good
function formatDollar(raw, decimals = 1) {
  const { value, suffix, overflow } = abbreviateNumber(raw, decimals);
  if (overflow) return "NaN";
  return `${raw < 0 ? "-" : ""}$${Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)}${suffix}`;
}

export class VerticalBar {
  //Seems Good unless something changes
  constructor(options) {
    this.options = options || {};
    this.drawlinex = 0;
    this.drawliney = 0;
    this.divId = this.options.divId || 'my-bar-container';

    this._createContainer(this.options.parent);

    this.points = this.options.points || [[]];

    this._initElements();
    this._bindEvents();

    this._resizeCanvas();
    this.setPoints(this.points);
    this.draw();
  }
  //Still need containers
  _createContainer(parent) {
    const container = document.createElement('div');
    container.id = this.divId;
    container.style.position = 'relative';
    container.style.width = '100%';
    container.innerHTML = `
      <canvas></canvas>
      <div id="ypoints">${this._createLabelDivs(5)}</div>
      <div id="ypoints2">${this._createLabelDivs(5)}</div>
      <div id="infobox" style="display:none;"></div>
    `;
    document.getElementById('canvas-div')?.remove();
    parent.appendChild(container);
  }
  //Functions just fine
  _createLabelDivs(count) {
    let html = '';
    for (let i = 0; i < count; i++) {
      html += `<div>0</div>`;
    }
    return html;
  }
  //Initalizes correctly
  _initElements() {
    this.container = document.getElementById(this.divId);
    this.canvas = this.container.querySelector('canvas');
    this.ypointsDiv = this.container.querySelector('#ypoints');
    this.ypointsDiv2 = this.container.querySelector('#ypoints2');
    this.infobox = this.container.querySelector('#infobox');
    this.ctx = this.canvas.getContext('2d');
    this._resizeCanvas();
    this._updateLabels();
    this._calculateBounds();
  }
  //Should be good
  _bindEvents() {
    window.addEventListener('resize', () => {
      this._resizeCanvas();
      this.draw();
    });
    this.canvas.addEventListener('mousemove', (e) => this._handleMouseMove(e));
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
    this.canvas.addEventListener('touchstart', (e) => this._handleTouchStart(e));
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
  //Resizes correctly
  _resizeCanvas() {
    const containerWidth = (document.getElementById('canvas-div')?.clientWidth - 100) * 0.9;
    const containerHeight = (document.getElementById('canvas-div')?.clientHeight - 100) * 0.9;
    const size = containerWidth;
    //don't be taller than screen height
    const hsize = Math.min(Math.max(size * 1.5, containerHeight), document.documentElement.clientHeight - 100);
    this.canvas.width = size;
    this.canvas.height = hsize;

    const ylabel = this.container.querySelector('#ypoints');
    ylabel.style.height = hsize / 4 * 5 + "px";
    ylabel.style.top = `${50 - hsize / 4 * 5 / 10}px`;
    ylabel.style.right = `${50 + size + 5}px`;
    
    const ylabel2 = this.container.querySelector('#ypoints2');
    ylabel2.style.height = hsize / 4 * 5 + "px";
    ylabel2.style.top = `${50 - hsize / 4 * 5 / 10}px`;
    ylabel2.style.left = `${100 + size + 5}px`;
  }
  //Handles mouse movement fine
  _handleMouseMove(e) {
    this.drawlinex = Math.max(1, e.offsetX);
    this.drawliney = Math.max(1, e.offsetY);
    this.draw();
  }
  //This should be good as well
  _handleTouchMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.drawlinex = Math.max(1, e.touches[0].clientX - rect.left);
    this.drawliney = Math.max(1, e.touches[0].clientY - rect.top);
    this.draw();
  }
  //Should be good as well
  _handleTouchStart(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.drawlinex = Math.max(1, e.touches[0].clientX - rect.left);
    this.drawliney = Math.max(1, e.touches[0].clientY - rect.top);
    this.drawline = true;
    this.draw();
  }
  //Set new points works fine
  setPoints(pointsArray) {
    this.points = pointsArray;
    this._calculateBounds();
    this._updateLabels();
    this.draw();
  }

  // Bounds now come from the STACKED total at each point, not the raw
  // segment values, otherwise the axis scale undershoots the real bar height.
  //Seems to be fixed and working correctly off of a [][] array system
  _calculateBounds() {
    this.maxY = 0;
    this.minY = 0;
    const cumulative = getCumulativePoints(this.points);
    for (let i = 0; i < cumulative.length; i++) {
      for (let j = 0; j < cumulative[i].length; j++) {
        if (cumulative[i][j] > this.maxY) this.maxY = cumulative[i][j];
        if (cumulative[i][j] < this.minY) this.minY = cumulative[i][j];
      }
    }
  }
  //Same doesn't need to be changed
  _updateLabels() {
    const count = this.ypointsDiv.children.length;
    for (let i = 0; i < count; i++) {
      const raw = (this.maxY - this.minY) / (count - 1) * i + this.minY;
      // reversed: index 0 in the DOM is the top label, which should show maxY
      this.ypointsDiv.children[count - 1 - i].innerHTML = formatDollar(raw);
    }
    const count2 = this.ypointsDiv2.children.length;
    for (let i = 0; i < count2; i++) {
      // reversed: index 0 in the DOM is the top label, which should show maxY
      this.ypointsDiv2.children[count2 - 1 - i].innerHTML = 100/(count2-1) * i + "%";
    }
  }
  //Should still be good
  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this._drawGraph();
    if (this.drawline) {
      this.infobox.style.display = "revert";
      this._drawCursor();
    } else {
      this.infobox.style.display = "none";
    }
  }

  // Draws actual bars: canvas width split evenly (one slot per bar), each
  // stacked segment filled as its own rect, then ONE strokeRect around the
  // whole stack afterward (not one stroke per segment).
  _drawGraph() {
    if (!this.points || this.points.length === 0) return;
    const ctx = this.ctx;
    const canvas = this.canvas;
    const max = this.maxY;
    const min = this.minY;
    const ratio = canvas.height / ((max - min) || 1);

    const barSlot = canvas.width / this.points.length;
    const barWidth = barSlot * 0.8; // leaves a small gap between bars
    const barGap = (barSlot - barWidth) / 2;

    // Running totals per bar so segment j starts where segment j-1 ended.
    const cumulative = getCumulativePoints(this.points);

    ctx.setLineDash([5, 0]);
    for (let i = 0; i < this.points.length; i++) {
      const xStart = i * barSlot + barGap;
      let prevY = canvas.height; // baseline for this bar (value = minY)

      for (let j = 0; j < this.points[i].length; j++) {
        const scaled = cumulative[i][j] * ratio - min * ratio;
        const y = canvas.height - scaled;

        ctx.fillStyle = FILL_COLORS[j % FILL_COLORS.length];
        ctx.fillRect(xStart, y, barWidth, prevY - y);

        prevY = y;
      }

      // Outline the full stack in one stroke, from its top down to the baseline.
      const stackTop = prevY;
      ctx.strokeStyle = LINE_COLORS[i % LINE_COLORS.length];
      ctx.strokeRect(xStart, stackTop, barWidth, canvas.height - stackTop);
    }
  }

  _drawCursor() {
    const canvas = this.canvas;
    const ctx = this.ctx;
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.moveTo(0, this.drawliney);
    ctx.lineTo(canvas.width, this.drawliney);
    ctx.stroke();
    const barSlot = canvas.width / this.points.length;
    const trueindex = this.drawlinex / barSlot;
    
    this._updateInfoBox(trueindex);
  }

  _updateInfoBox(theindex) {
    const info = this.infobox;
    const canvas = this.canvas;
    let index = Math.floor(theindex);
    if (index >= this.points.length) index = this.points.length - 1;
    if (index < 0) index = 0;

    // cumulative[index][j] IS the stacked total for segment j already —
    // points[index][j] is a plain number now, not an array.
    const cumulative = getCumulativePoints(this.points);
    console.log(cumulative);
    let inputvalue = "<inline>";
      inputvalue += `<span>Total:</span>`;
      inputvalue += formatDollar(cumulative[index][cumulative[index].length-1]);
      inputvalue += "<br>";
    for (let j = this.points[index].length - 1; j >= 0; j--) {
      const values = this.points[index][j];
      inputvalue += `<span style="background-color:${FILL_COLORS[j % FILL_COLORS.length]}">${this.options.graphtitles[index][j]}:</span>`;
      inputvalue += formatDollar(values);
      inputvalue += ` ${Math.round((values / cumulative[index][this.points[index].length-1]) * 1000) / 10}%`;
      inputvalue += "<br>";
    }
    info.innerHTML = inputvalue;

    const infoboxWidth = info.offsetWidth;
    const infoboxHeight = info.offsetHeight;
    if (this.drawlinex <= canvas.width / 2) {
      info.style.left = `${this.drawlinex + 50 + (canvas.width / 9)}px`;
    } else {
      info.style.left = `${this.drawlinex + 50 + (canvas.width / 9) - infoboxWidth}px`;
    }
    info.style.top = `${this.drawliney + 51 - infoboxHeight}px`;
    info.style.display = 'block';
  }
}

/**
 * HorizontalBar mirrors VerticalBar exactly, with the axes swapped:
 * - "index" (i) runs down the canvas (rows) instead of across it (columns)
 * - "value" (the stacked totals) runs across the canvas (width) instead of
 *   up it (height), with zero at the left edge instead of the bottom edge
 *
 * Uses the same flat points[i][j] shape and fillRect-per-segment +
 * one-strokeRect-per-bar approach as VerticalBar.
 */
export class HorizontalBar {
  constructor(options) {
    this.options = options || {};
    this.drawlinex = 0;
    this.drawliney = 0;
    this.divId = this.options.divId || 'my-bar-container';
 
    this._createContainer(this.options.parent);
 
    this.points = this.options.points || [[]];
 
    this._initElements();
    this._bindEvents();
 
    this._resizeCanvas();
    this.setPoints(this.points);
    this.draw();
  }
 
  _createContainer(parent) {
    const container = document.createElement('div');
    container.id = this.divId;
    container.style.position = 'relative';
    container.style.width = '100%';
    container.innerHTML = `
      <canvas></canvas>
      <div id="xpoints" style="position:absolute;display:flex;flex-direction:row;justify-content:space-between;">${this._createLabelDivs(5)}</div>
      <div id="infobox" style="display:none;"></div>
    `;
    document.getElementById('canvas-div')?.remove();
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
    this.xpointsDiv = this.container.querySelector('#xpoints');
    this.infobox = this.container.querySelector('#infobox');
    this.ctx = this.canvas.getContext('2d');
 
    this._resizeCanvas();
    this._updateLabels();
    this._calculateBounds();
  }
 
  _bindEvents() {
    window.addEventListener('resize', () => {
      this._resizeCanvas();
      this.draw();
    });
    this.canvas.addEventListener('mousemove', (e) => this._handleMouseMove(e));
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
    this.canvas.addEventListener('touchstart', (e) => this._handleTouchStart(e));
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
 
  // Mirrors VerticalBar's _resizeCanvas, with the short/long axes swapped:
  // there, size (from containerWidth) is the short axis and hsize (clamped
  // to screen height) is the long one; here containerHeight is the short
  // axis and wsize (clamped to screen width) is the long one.
  _resizeCanvas() {
    const containerWidth = (document.getElementById('canvas-div')?.clientWidth - 100) * 0.9;
    const containerHeight = (document.getElementById('canvas-div')?.clientHeight - 100) * 0.9;
    const size = containerHeight;
    // don't be wider than screen width
    const wsize = Math.min(Math.max(size * 1.5, containerWidth), document.documentElement.clientWidth - 100);
    this.canvas.height = size;
    this.canvas.width = wsize;
 
    const xlabel = this.container.querySelector('#xpoints');
    xlabel.style.width = wsize / 4 * 5 + "px";
    xlabel.style.left = `${50 - wsize / 4 * 5 / 10}px`;
    xlabel.style.top = `${50 + size + 5}px`;
  }
 
  _handleMouseMove(e) {
    this.drawlinex = Math.max(1, e.offsetX);
    this.drawliney = Math.max(1, e.offsetY);
    this.draw();
  }
 
  _handleTouchMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.drawlinex = Math.max(1, e.touches[0].clientX - rect.left);
    this.drawliney = Math.max(1, e.touches[0].clientY - rect.top);
    this.draw();
  }
 
  _handleTouchStart(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.drawlinex = Math.max(1, e.touches[0].clientX - rect.left);
    this.drawliney = Math.max(1, e.touches[0].clientY - rect.top);
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
 
  // Matches VerticalBar: points[i][j] is a flat stacked segment value, not
  // a nested array, so bounds come from cumulative[i][j] directly (2 levels).
  _calculateBounds() {
    this.maxX = 0;
    this.minX = 0;
    const cumulative = getCumulativePoints(this.points);
    for (let i = 0; i < cumulative.length; i++) {
      for (let j = 0; j < cumulative[i].length; j++) {
        if (cumulative[i][j] > this.maxX) this.maxX = cumulative[i][j];
        if (cumulative[i][j] < this.minX) this.minX = cumulative[i][j];
      }
    }
  }
 
  // Left-to-right, low value to high value — no reversal needed here since
  // (unlike the y-axis) the x-axis already increases in the "natural" direction.
  _updateLabels() {
    const count = this.xpointsDiv.children.length;
    for (let i = 0; i < count; i++) {
      const raw = (this.maxX - this.minX) / (count - 1) * i + this.minX;
      this.xpointsDiv.children[i].innerHTML = formatDollar(raw);
    }
  }
 
  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this._drawGraph();
    if (this.drawline) {
      this.infobox.style.display = "revert";
      this._drawCursor();
    } else {
      this.infobox.style.display = "none";
    }
  }
 
  // Same fillRect-per-segment + one-strokeRect-per-bar approach as
  // VerticalBar, mirrored onto the horizontal axis: canvas height split
  // evenly (one slot per bar), segments stacked left-to-right.
  _drawGraph() {
    if (!this.points || this.points.length === 0) return;
    const ctx = this.ctx;
    const canvas = this.canvas;
    const max = this.maxX;
    const min = this.minX;
    const ratio = canvas.width / ((max - min) || 1);
 
    const barSlot = canvas.height / this.points.length;
    const barHeight = barSlot * 0.8;
    const barGap = (barSlot - barHeight) / 2;
 
    const cumulative = getCumulativePoints(this.points);
 
    ctx.setLineDash([5, 0]);
    for (let i = 0; i < this.points.length; i++) {
      const yStart = i * barSlot + barGap;
      let prevX = 0; // baseline for this bar (value = minX)
 
      for (let j = 0; j < this.points[i].length; j++) {
        const scaled = cumulative[i][j] * ratio - min * ratio;
        const x = scaled;
 
        ctx.fillStyle = FILL_COLORS[j % FILL_COLORS.length];
        ctx.fillRect(prevX, yStart, x - prevX, barHeight);
 
        prevX = x;
      }
 
      // Outline the full stack in one stroke, from the baseline out to its end.
      const stackEnd = prevX;
      ctx.strokeStyle = LINE_COLORS[i % LINE_COLORS.length];
      ctx.strokeRect(0, yStart, stackEnd, barHeight);
    }
  }
 
  _drawCursor() {
    const canvas = this.canvas;
    const barSlot = canvas.height / this.points.length;
    const trueindex = this.drawliney / barSlot;
    this._updateInfoBox(trueindex);
  }
 
  _updateInfoBox(theindex) {
    const info = this.infobox;
    const canvas = this.canvas;
    let index = Math.floor(theindex);
    if (index >= this.points.length) index = this.points.length - 1;
    if (index < 0) index = 0;
 
    const cumulative = getCumulativePoints(this.points);
 
    let inputvalue = "<inline>";
    for (let j = 0; j < this.points[index].length; j++) {
      const total = cumulative[index][j];
      inputvalue += `<span style="background-color:${FILL_COLORS[j % FILL_COLORS.length]}">${this.options.graphtitles[j]}:</span>`;
      inputvalue += formatDollar(total);
      inputvalue += "<br>";
    }
    info.innerHTML = inputvalue;
 
    const infoboxWidth = info.offsetWidth;
    const infoboxHeight = info.offsetHeight;
    if (this.drawliney <= canvas.height / 2) {
      info.style.top = `${this.drawliney + 50}px`;
    } else {
      info.style.top = `${this.drawliney + 50 - infoboxHeight}px`;
    }
    info.style.left = `${this.drawlinex + 51}px`;
    info.style.display = 'block';
  }
}