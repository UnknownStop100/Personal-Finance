export function graph(element,ylabels,xlabels,values){
    let ctx=element.getContext("2d");
    let width=element.width;
    let height=element.height;
    let newpoints=[];
    let max=Math.max(...values);
    let min=Math.min(...values);
    let range=max-min;
    let newvalues=scalevalues(values,max,height);
    let pixelsperpoint=width/(values.length-1);
    ctx.clearRect(0,0,width,height);

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

}
function scalevalues(values,max,height){
    let ratio = height / max;
    for (let i = 0; i < values.length; i++) {
        values[i] *= ratio;
    }
    return values;
}