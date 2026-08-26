import { numberInput } from "../Modules/Input/input.js";
import { valueInputs } from "../Modules/Input/input.js";
import { createFooter } from "../Footer/script.js";
import { createHeader } from "../Header/script.js";
import { titleGenerator } from "../Calculator Title/script.js";
import { output } from "../Modules/Output/Output/script.js";
const body = document.querySelector('body');
const header = createHeader();
const footer = createFooter();
const title = titleGenerator("Finance calculator", "Investment Calculator", "Plot future investment growth using compound interest and regular contributions.")
const outputarea = document.getElementById("output");
const moneyinput=output("Money Input");
const moneyearned=output("Money Earned");
const totalmoney=output("Total Money");
body.prepend(title);
body.prepend(header);
body.appendChild(footer);
outputarea.appendChild(moneyinput);
outputarea.appendChild(moneyearned);
outputarea.appendChild(totalmoney);
///////////////////////////
//handles inputs
///////////////////////////
let roi=.08,
contributionfrequency=12,
contributionamount=500,
currentsavings=0,
investmentduration=20;

let currentSavings=numberInput(0,1000000000,document.getElementById("inputs"),"Current Savings",0,"$","",updateCurrentSavings,"?");
document.getElementById("inputs").appendChild(document.createElement("br"));
let contributionFrequency=valueInputs("Contribution Frequency",["Monthly","Quarterly","Yearly"],[12,4,1],document.getElementById("inputs"),updateContributionFrequency,"?");
document.getElementById("inputs").appendChild(document.createElement("br"));
document.getElementById("inputs").appendChild(document.createElement("br"));
let contributionAmount=numberInput(-1000000,1000000000,document.getElementById("inputs"),"Contribution Amount",500,"$","",updateContributionAmount,"?");
document.getElementById("inputs").appendChild(document.createElement("br"));
let returnOnInvestment=numberInput(0,100,document.getElementById("inputs"),"Return on Investment (ROI)",8,"","%",updateReturnOnInvestment,"?");
document.getElementById("inputs").appendChild(document.createElement("br"));
let investmentDuration=numberInput(0,100,document.getElementById("inputs"),"Investment Duration",20,"","",updateInvestmentDuration,"?");
document.getElementById("inputs").appendChild(document.createElement("br"));
document.getElementById("inputs").appendChild(document.createElement("br"));

function updateCurrentSavings(){
currentsavings=Number(currentSavings.value.replaceAll(",",""));
drawGraph();
}
function updateContributionFrequency(){
    contributionfrequency=Number(contributionFrequency.value.replaceAll(",",""));
    drawGraph();
}
function updateContributionAmount(){
    contributionamount=Number(contributionAmount.value.replaceAll(",",""));
    drawGraph();
}
function updateReturnOnInvestment(){
    roi=Number(returnOnInvestment.value.replaceAll(",",""))/100;
    drawGraph();
}
function updateInvestmentDuration(){
    investmentduration=Number(investmentDuration.value.replaceAll(",",""));
    if(investmentduration===0){
        investmentduration=1;
    }
    drawGraph();
}
///////////////////////////
//handles inputs
///////////////////////////
let actualpoints = function (ROI, iterations, iterationsperyear,initalmoney,iterationcontribution) {
    let points=[];
    let price=initalmoney;
    let iterationroi=(ROI+1)**(1/iterationsperyear);
        points.push(price);
    for(let i=0;i<iterations;i++){
        price*=iterationroi;
        points.push(price);
        price+=iterationcontribution;
        points.push(price);
    }
    return points;
}
let xlabel = document.getElementById("xpoints");
let ylabel = document.getElementById("ypoints");
let canvas = document.getElementById('investment-graph');
let infobox=document.getElementById("infobox");
//calculation variables
let drawline=false;
let drawlinex=0;
let mousepoint=0;
let characters=["","k","m","b","t","qd","qt","st"];

//resize canvas elements to line up
let resizewindow=function(){
    //get the size canvas should be set to
    let canvaswidth = (document.getElementById('canvas-div').clientWidth-100)*.9;
    let canvasheight = canvaswidth;
    //adjust canvas size
    canvas.width = canvaswidth;
    canvas.height = canvasheight;
    //change the label location to match new size
    ylabel.style.height = canvasheight / 4 * 5 + "px";
    ylabel.style.top = `${50-canvasheight/4*5/10}px`;
    //50 for padding then the width of the canvas then 5 for extra space and the border width
    ylabel.style.right = `${50+canvaswidth+5}px`;
    xlabel.style.width = canvaswidth/4*5 + "px";
    //50 is padding for the div and then go back by half the element width then a 1 for the border width
    xlabel.style.right = `${50-canvaswidth/4*5/10+1}px`;
    xlabel.style.bottom= `${50-22}px`
    document.getElementById("xlabel").style.width=`${(document.getElementById('canvas-div').clientWidth-100)*.9+100}px`;
}
//resize canvas when user loads page so it matches the screen
resizewindow();

let ctx = canvas.getContext('2d');
window.addEventListener('resize', function () {
    resizewindow();
    drawGraph();
});
let drawthegraph = function (points,pixelsperpoint,canvaselement,min,max,linecolor="black",infillcolor="rgba(0, 123, 255, 0.2)") {

    let ratio = canvas.height / (max-min);
    for (let i = 0; i < points.length; i++) {
        points[i] *= ratio;
        points[i] -= min*ratio;
    }
    ctx.setLineDash([5, 0]);
    ctx.beginPath();
    ctx.strokeStyle = linecolor;
    ctx.moveTo(0, canvaselement.height);
    for (let i = 0; i < points.length; i++) {
        ctx.lineTo(i*pixelsperpoint, canvaselement.height - points[i]);
        i++
        ctx.lineTo((i+1)*pixelsperpoint, canvaselement.height - points[i]);
    }
    ctx.stroke();


    ctx.beginPath();
    ctx.moveTo(0, canvaselement.height);
    for (let i = 0; i < points.length; i++) {
        ctx.lineTo(i*pixelsperpoint, canvaselement.height - points[i]);
        i++
        ctx.lineTo((i+1)*pixelsperpoint, canvaselement.height - points[i]);
    }
    ctx.lineTo(canvaselement.width, canvaselement.height);
    ctx.lineTo(0, canvaselement.height);
    ctx.closePath();
    ctx.fillStyle = infillcolor;
    ctx.fill();
}
 const formatInput = (value) => {
            value=value+"";
            value.replace(/,/g, "")
            .replace(/[^\d.]/g, "");

        // Prevent multiple decimal points
        const decimalIndex = value.indexOf(".");

        if (decimalIndex !== -1) {
            value =
                value.substring(0, decimalIndex + 1) +
                value
                    .substring(decimalIndex + 1)
                    .replace(/\./g, "");
        }

        if (value === "" || value === ".") {
            return value;
        }

        const parts = value.split(".");

        const wholeNumber =
            Number(parts[0]).toLocaleString("en-US");

        if (parts.length > 1) {
            return    wholeNumber + "." + parts[1];
        } else {
            return wholeNumber;
        }
    };
let drawGraph = function () {
    let base = 1.01;
    let start = 1;
    let newpoints = actualpoints(roi,contributionfrequency*investmentduration,contributionfrequency,currentsavings,contributionamount);
    let newpoints2 = actualpoints(0,contributionfrequency*investmentduration,contributionfrequency,currentsavings,contributionamount);
    
    let output1=document.getElementById("moneyinput");
    let output2=document.getElementById("moneyearned");
    let output3=document.getElementById("totalmoney");
    output1.innerHTML="$"+formatInput(newpoints2[newpoints2.length-1]);
    output2.innerHTML="$"+formatInput(Math.round((newpoints[newpoints.length-1]-newpoints2[newpoints2.length-1])));
    output3.innerHTML="$"+formatInput(Math.round(newpoints[newpoints.length-1]));
    let ypoints=ylabel.children;
    let max=newpoints[0];
    let min=0;
    //graph(canvas,ylabel,xlabel,newpoints);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i=0;i<newpoints.length;i++){
        if(newpoints[i]>max){
            max=newpoints[i];
        }
        if(newpoints[i]<min){
            min=newpoints[i];
        }
    }
    for(let i=0;i<ypoints.length;i++){
        let num=Math.abs(Math.round((max-min)/4*i)+min);
        let point=0;
        while(num>1000){
            num/=1000;
            point++;
        }
        if(point<characters.length){
            ypoints[4-i].innerHTML="";
            if(((max-min)/4*i+min)<0)
            ypoints[4-i].innerHTML+="-";
            ypoints[4-i].innerHTML+=`$${Math.round(num*10)/10}${characters[point]}`;
        }
        else{
            ypoints[4-1].innerHTML="NaN";
        }
    }
    let xpoints=xlabel.children;
    for(let i=0;i<xpoints.length;i++){
        xpoints[i].innerHTML=Math.floor(investmentduration/4*i);
    }
    
    let pixelsperpoint=canvas.width/(newpoints.length-1);

    if(drawline){
        mousepoint=Math.floor(drawlinex/pixelsperpoint);
    }
    //draw the graph
    let ratio = canvas.height / (max-min);
    drawthegraph(newpoints,pixelsperpoint,canvas,min,max);
    //drawthegraph(newpoints2,pixelsperpoint,canvas,0,max,"rgba(0,0,0,.75)","rgba(0, 255, 76, 0.05)");

    if(mousepoint>=newpoints.length){
        mousepoint=newpoints.length-1;
    }
    if(drawline){
        ctx.beginPath();
        if(mousepoint%2===0){
            ctx.arc(pixelsperpoint*mousepoint, canvas.height-newpoints[mousepoint], 5, 0, 2 * Math.PI);
        }
        else{
            ctx.arc(pixelsperpoint*(mousepoint+1), canvas.height-newpoints[mousepoint], 5, 0, 2 * Math.PI);
        }
        ctx.fillStyle="rgba(0, 123, 255, 0.2)";
        ctx.fill();
    }


    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.16)';
    ctx.moveTo(0, canvas.height/4*3);
    ctx.lineTo(canvas.width,canvas.height/4*3);
    ctx.moveTo(0, canvas.height/4*2);
    ctx.lineTo(canvas.width,canvas.height/4*2);
    ctx.moveTo(0, canvas.height/4*1);
    ctx.lineTo(canvas.width,canvas.height/4*1);
    if(drawline){
    if(mousepoint%2===0){
        ctx.moveTo(pixelsperpoint*mousepoint, 0);
        ctx.lineTo(pixelsperpoint*mousepoint,canvas.height);
    }
    else{
        ctx.moveTo(pixelsperpoint*(mousepoint+1), 0);
        ctx.lineTo(pixelsperpoint*(mousepoint+1),canvas.height);
    }
}
    ctx.stroke();


    if(drawline){
        infobox.style.display="revert";
        //take into account the point height and the bottom padding ie 50
        infobox.style.bottom=newpoints[mousepoint]+50+"px";
        let thewidth=infobox.style.offsetWidth;
        let point=mousepoint;
        if(point>newpoints.length){
            point=newpoints.length
        }
        else if(point<0){
            point=0;
        }
        let inputvalue="<inline>";
        let pointratio=0;
        let displayvalue=Math.abs(newpoints[point]/ratio+min);
        while(displayvalue>1000){
            displayvalue/=1000;
            pointratio++;
        }
        if(newpoints[point]/ratio+min<0)
            inputvalue+="-";
            inputvalue+="$"+Math.round(displayvalue*100)/100+characters[pointratio];
        inputvalue+="<br>";
        inputvalue+="Y";
        if(contributionfrequency===12)
            inputvalue+=Math.floor(point/24)
        else if(contributionfrequency===4)
            inputvalue+=Math.floor(point/8)
        else if(contributionfrequency===1)
            inputvalue+=Math.floor(point/2)
        if(point%2){
            inputvalue+=" End";
        }
        else{
            inputvalue+=" Start";
        }
        if(contributionfrequency===12){
        inputvalue+=" M";
        inputvalue+=Math.floor((point%24)/2)+1;
        }
        else if(contributionfrequency===4){
        inputvalue+=" Q";
        inputvalue+=Math.floor((point%8)/2)+1;

        }
        inputvalue+="</inline>"
        infobox.innerHTML=inputvalue;

        
        let canvaswidth=(document.getElementById('canvas-div').clientWidth-100)*.9;
        let infoboxwidth=(document.getElementById('infobox').clientWidth);
        if(drawlinex<=canvaswidth/2){
            if(mousepoint%2===0){
                infobox.style.left=pixelsperpoint*mousepoint+50+canvaswidth/9+"px";
            }
            else{
                infobox.style.left=pixelsperpoint*(mousepoint+1)+50+canvaswidth/9+"px";
            }
        }
        else{
            if(mousepoint%2===0){
                infobox.style.left=pixelsperpoint*mousepoint+50+canvaswidth/9-infoboxwidth-3+"px";
            }
            else{
                infobox.style.left=pixelsperpoint*(mousepoint+1)+50+canvaswidth/9-infoboxwidth-3+"px";
            }
        }
    }
    else{
        infobox.style.display="none";
    }
}
canvas.addEventListener('mousemove',(event)=>{
    drawlinex=event.offsetX;
    //removes NAN from accuring on the entry boundry of the graph
    if(drawlinex<1)
        drawlinex=1;
    drawGraph();
});
canvas.addEventListener('touchmove', (event) => {
    // 1. Prevents the phone screen from scrolling while dragging
    event.preventDefault(); 
    
    // 2. Get the position of the canvas on the screen
    const rect = canvas.getBoundingClientRect();
    
    // 3. Extract the X coordinate from the first finger touching the screen
    let touchX = event.touches[0].clientX - rect.left;
    
    // 4. Apply your boundary check to prevent errors
    if (touchX < 1) {
        touchX = 1;
    }
    
    // 5. Update your variable and redraw
    drawlinex = touchX;
    drawGraph();
}, { passive: false }); 
canvas.addEventListener('mouseenter',(event)=>{
    drawline=true;
    drawGraph();

});
canvas.addEventListener('mouseleave',(event)=>{
    drawline=false;
    drawGraph();
});
canvas.addEventListener('touchstart', (event) => {
    // 1. Optional: update the X coordinate immediately on first touch
    const rect = canvas.getBoundingClientRect();
    let touchX = event.touches[0].clientX - rect.left;
    
    if (touchX < 1) touchX = 1;
    drawlinex = touchX;

    // 2. Set your flag to true and draw
    drawline = true; 
    drawGraph();
});
window.addEventListener('touchstart', (event) => {
    // Check if the element touched is NOT the canvas
    if (event.target !== canvas) {
        drawline = false;
        drawGraph();
    }
});
canvas.addEventListener('touchcancel',(event)=>{
    drawline=false;
    drawGraph();
});
drawGraph();