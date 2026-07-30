//let canvassize = document.getElementById('canvas-div').clientWidth;
let xlabel = document.getElementById("xpoints");
let ylabel = document.getElementById("ypoints");
let canvas = document.getElementById('investment-graph');
let infobox=document.getElementById("infobox");
//calculation variables
let roi=0,
contributionfrequency=12,
contributionamount=10,
currentsavings=10,
investmentduration=1;
let drawline=false;
let drawlinex=0;
let mousepoint=0;
let characters=["","k","m","b","t","qd","qt","st"];

//resize canvas elements to line up
resizewindow=function(){
    //get the size canvas should be set to
    canvassize = document.getElementById('canvas-div').clientWidth-50;
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
actualpoints = function (ROI, iterations, iterationsperyear,initalmoney,iterationcontribution) {
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
drawGraph = function () {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    let base = 1.01;
    let start = 1;
    let newpoints = actualpoints(roi,contributionfrequency*investmentduration,contributionfrequency,currentsavings,contributionamount);

    let ypoints=ylabel.children;
    let max=newpoints[0];
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
            ypoints[4-i].innerHTML=`$${Math.round(num)}${characters[point]}`;
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


    ctx.setLineDash([5, 0]);
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.moveTo(0, canvas.height);
    for (let i = 0; i < newpoints.length; i++) {
        ctx.lineTo(i*pixelsperpoint, canvas.height - newpoints[i]);
        i++
        ctx.lineTo((i+1)*pixelsperpoint, canvas.height - newpoints[i]);
    }
    ctx.stroke();


    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    for (let i = 0; i < newpoints.length; i++) {
        ctx.lineTo(i*pixelsperpoint, canvas.height - newpoints[i]);
        i++
        ctx.lineTo((i+1)*pixelsperpoint, canvas.height - newpoints[i]);
    }
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fillStyle = "rgba(0, 123, 255, 0.2)";
    ctx.fill();

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


//update variables with new values when called
updateValues = function(){
    currentsavings=Number(document.getElementById("current-savings").value);
    contributionamount=Number(document.getElementById("contribution-amount").value);
    roi=Number(document.getElementById("ROI").value)/100;
    currentsavings=Number(document.getElementById("current-savings").value);
    investmentduration=Number(document.getElementById("investment-duration").value);
    let frequency=document.getElementById("contribution-frequency").value;
    switch(frequency){
        case "monthly":
            contributionfrequency=12;
            break;
        case "quarterly":
            contributionfrequency=4;
            break;
        case "yearly":
            contributionfrequency=1;
            break;
        default:
            break;
    }
    graphdraw=true;
    drawGraph();
}
updateROIview = function(){
    let ROI=document.getElementById("ROI")
    let length=ROI.value.length;
    let a=ROI.value;
    if(length>2){
        ROI.value=a.slice(0,-1);
    }
    length=ROI.value.length;
    let spacing=7*length+8;
    document.getElementById("ending-percentage").style.left=spacing+"px";

}
document.getElementById("ROI").addEventListener('input', (e)=>{
    updateROIview();
});
document.getElementById("investment-duration").addEventListener('input', (e)=>{
    if(document.getElementById("investment-duration").value<1){
        document.getElementById("investment-duration").value=1;
    }
});
/*document.getElementById("calculate-btn").addEventListener("click", ()=>{
    updateValues();
});*/
//if a key is clicked the canvas area is pressed update the graph
document.getElementById("main-calculator").addEventListener('keyup',(e)=>{
    updateValues()
});
document.getElementById("main-calculator").addEventListener('click',()=>{
    updateValues()
});
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

updateValues();
drawGraph();