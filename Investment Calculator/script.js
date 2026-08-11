import { numberInput } from "../Modules/Input/input.js";
import { valueInputs } from "../Modules/Input/input.js";

///////////////////////////
//handles inputs
///////////////////////////
let roi=.08,
contributionfrequency=12,
contributionamount=500,
currentsavings=0,
investmentduration=20;

let currentSavings=numberInput(0,1000000000,document.getElementById("inputs"),"Current Savings",0,"$","",updateCurrentSavings);
document.getElementById("inputs").appendChild(document.createElement("br"));
let contributionFrequency=valueInputs("Contribution Frequency",["Monthly","Quarterly","Yearly"],[12,4,1],document.getElementById("inputs"),updateContributionFrequency);
document.getElementById("inputs").appendChild(document.createElement("br"));
document.getElementById("inputs").appendChild(document.createElement("br"));
let contributionAmount=numberInput(-1000000,1000000000,document.getElementById("inputs"),"Contribution Amount",500,"$","",updateContributionAmount);
document.getElementById("inputs").appendChild(document.createElement("br"));
let returnOnInvestment=numberInput(0,100,document.getElementById("inputs"),"Return on Investment (ROI)",8,"","%",updateReturnOnInvestment);
document.getElementById("inputs").appendChild(document.createElement("br"));
let investmentDuration=numberInput(0,100,document.getElementById("inputs"),"Investment Duration",20,"","",updateInvestmentDuration);
document.getElementById("inputs").appendChild(document.createElement("br"));
document.getElementById("inputs").appendChild(document.createElement("br"));

function updateCurrentSavings(){
document.getElementById("inputs").appendChild(document.createElement("br"));
currentsavings=Number(currentSavings.value);
drawGraph();
}
function updateContributionFrequency(){
    contributionfrequency=Number(contributionFrequency.value);
    drawGraph();
}
function updateContributionAmount(){
    contributionamount=Number(contributionAmount.value);
    drawGraph();
}
function updateReturnOnInvestment(){
    roi=Number(returnOnInvestment.value)/100;
    drawGraph();
}
function updateInvestmentDuration(){
    investmentduration=Number(investmentDuration.value);
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
    let canvassize = document.getElementById('canvas-div').clientWidth-50;
    //adjust canvas size
    canvas.width = canvassize;
    canvas.height = canvassize;
    //change the label location to match new size
    ylabel.style.height = canvassize / 4 * 5 + "px";
    ylabel.style.top = -canvassize / 8 + "px";
    ylabel.style.right = canvassize+30+"px";
    xlabel.style.width = canvassize / 4 * 5 + "px";
    xlabel.style.left = -canvassize / 8 +25+ "px"; 
    xlabel.style.bottom= "25px"
}
//resize canvas when user loads page so it matches the screen
resizewindow();

let ctx = canvas.getContext('2d');
window.addEventListener('resize', function () {
    resizewindow();
    drawGraph();
});
let drawthegraph = function (points,pixelsperpoint,canvaselement) {

    ctx.setLineDash([5, 0]);
    ctx.beginPath();
    ctx.strokeStyle = 'black';
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
    ctx.fillStyle = "rgba(0, 123, 255, 0.2)";
    ctx.fill();
}

let drawGraph = function () {
    let base = 1.01;
    let start = 1;
    let newpoints = actualpoints(roi,contributionfrequency*investmentduration,contributionfrequency,currentsavings,contributionamount);
    let ypoints=ylabel.children;
    let max=newpoints[0];
    //graph(canvas,ylabel,xlabel,newpoints);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i=0;i<newpoints.length;i++){
        if(newpoints[i]>max){
            max=newpoints[i];
        }
    }
    for(let i=0;i<ypoints.length;i++){
        let num=Math.round(max/4*i);
        let point=0;
        while(num>1000){
            num/=1000;
            point++;
        }
        if(point<characters.length){
            ypoints[4-i].innerHTML=`$${Math.round(num*10)/10}${characters[point]}`;
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

    let ratio = canvas.height / max;
    for (let i = 0; i < newpoints.length; i++) {
        newpoints[i] *= ratio;
    }
    drawthegraph(newpoints,pixelsperpoint,canvas);

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
        infobox.style.bottom=newpoints[mousepoint]+"px";
        let thewidth=infobox.style.offsetWidth;
        if(mousepoint%2===0){
            infobox.style.left=pixelsperpoint*mousepoint-50+"px";
        }
        else{
            infobox.style.left=pixelsperpoint*(mousepoint+1)-50+"px";
        }
        let point=mousepoint;
        if(point>newpoints.length){
            point=newpoints.length
        }
        else if(point<0){
            point=0;
        }
        let inputvalue="<inline>";
        let pointratio=0;
        let displayvalue=newpoints[point]/ratio;
        while(displayvalue>1000){
            displayvalue/=1000;
            pointratio++;
        }
            inputvalue+="$"+Math.round(displayvalue*100)/100+characters[pointratio];
        inputvalue+="<br>";
        inputvalue+="Y";
        inputvalue+=Math.floor(point/24)
        if(point%2){
            inputvalue+=" End";
        }
        else{
            inputvalue+=" Start";
        }
        inputvalue+=" M";
        inputvalue+=Math.floor((point%24)/2)+1;
        inputvalue+="</inline>"
        infobox.innerHTML=inputvalue;

        
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
canvas.addEventListener('mouseenter',(event)=>{
    drawline=true;
    drawGraph();

});
canvas.addEventListener('mouseleave',(event)=>{
    drawline=false;
    drawGraph();
});
drawGraph();