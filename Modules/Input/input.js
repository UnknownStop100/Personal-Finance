export function numberInput(min,max,parentelement,labeltext="",initialvalue=0,prefix="",suffix="",runfunction=()=>{}){
    //Create the elements
    const label = document.createElement("label");
    const inputdiv=document.createElement("div");
    const input = document.createElement("input");
    const inputprefix = document.createElement("div");
    const inputsuffix = document.createElement("div");
    //assign the ids so styles apply correctly from the style.css
    label.id="input-label";
    input.id=labeltext.toLowerCase().replaceAll(" ","-")+"-input";
    input.className="input";
    inputdiv.id="input-div";
    inputprefix.id="input-prefix";
    inputsuffix.id="input-suffix";

    input.type = "number";
    input.value=initialvalue;
    input.style.paddingLeft=prefix.length*9+"px";
    inputprefix.textContent=prefix;
    inputsuffix.textContent=suffix;
    inputsuffix.style.left=7.3*input.value.length+prefix.length*9+2+"px";
    label.htmlFor=input.id;
    if (labeltext) {
        label.textContent = labeltext;
        parentelement.appendChild(label);
    }
    inputdiv.appendChild(inputprefix);
    inputdiv.appendChild(input);
    inputdiv.appendChild(inputsuffix);
    parentelement.appendChild(inputdiv);
    input.addEventListener('input', (e)=>{
    if(input.value>max){
        input.value=max;
    }
    if(input.value<min){
        input.value=min;
    }
    let length=input.value.length;
    let a=input.value;
    length=input.value.length;
    let spacing=7*length+8;
    inputsuffix.style.left=7.3*input.value.length+prefix.length*9+2+"px";

        runfunction();
    });
    return input;
}
export function valueInputs(labeltext,inputvalues,outputvalues,parentelement,runfunction=()=>{}){
    const label = document.createElement("label");
    const select = document.createElement("select");
    label.for=labeltext.toLowerCase().replaceAll(" ","-")+"-label";
    select.id=labeltext.toLowerCase().replaceAll(" ","-")+"-select";
    select.className="select";
    label.textContent = labeltext;
    
    for(let i=0;i<inputvalues.length;i++){
        const option = document.createElement("option");
        option.value = outputvalues[i];
        option.textContent = inputvalues[i];
        select.appendChild(option);
    }
    parentelement.appendChild(label);
    parentelement.appendChild(document.createElement("br"));
    parentelement.appendChild(select);
    select.addEventListener('change', (e)=>{
        runfunction();
    });
    return select;
}