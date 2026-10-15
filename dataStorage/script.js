
export function saveData(dataname){
    let theinputs=document.getElementsByClassName("input");
    let theselects=document.getElementsByClassName("select");
    let data={
        inputs:[],
        selects:[]
    };
    for(let i=0;i<theinputs.length;i++){
        data.inputs.push(theinputs[i].value);
    }
    for(let i=0;i<theselects.length;i++){
        data.selects.push(theselects[i].value);
    }
    let currentData = localStorage.getItem("FinanceAviatorData");
    if(currentData){
        let currentDataObj = JSON.parse(currentData);
        currentDataObj[dataname] = data;
        localStorage.setItem("FinanceAviatorData", JSON.stringify(currentDataObj));
    }
    else{
        let newDataObj = {
            [dataname]: data
        };
        localStorage.setItem("FinanceAviatorData", JSON.stringify(newDataObj));
    }
}
export function loadData(dataname){
 let getData = localStorage.getItem("FinanceAviatorData");
    if(getData){
        let dataObj = JSON.parse(getData);
        if(dataObj[dataname]){
            let data = dataObj[dataname];
            let theinputs=document.getElementsByClassName("input");
            let theselects=document.getElementsByClassName("select");
            for(let i=0;i<theinputs.length;i++){
                theinputs[i].value=data.inputs[i];
                theinputs[i].dispatchEvent(new Event('input'));
            }
            for(let i=0;i<theselects.length;i++){
                theselects[i].value=data.selects[i];
                theselects[i].dispatchEvent(new Event('change'));
            }
        }
    }
}