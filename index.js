// moment | MIT License | https://github.com/moment/moment/blob/develop/LICENSE
'use strict'

sessionStorage.clear();
let dataObject = {};

const rangeInput = document.getElementById("js-range-value");
rangeInput.addEventListener('input', showRangeValue, false);

const resultDiv = document.getElementById("js-result-div");

const resetButton = document.getElementById("js-reset-button");
resetButton.addEventListener('click', initializeDiv, false);

let index = 1;
function initializeDiv(){
    resultDiv.textContent = "";
    rangeInput.value = 0;
    index = 1;
    dataObject = {};
    sessionStorage.clear();
}

const valueInputElement = document.getElementById("js-displaying-value-input");
valueInputElement.addEventListener('change', ()=>{
    const valueInput = valueInputElement.value;
    if(valueInput < 1){
        valueInputElement.value = 1;
    }else if(valueInput > 1000){
        valueInputElement.value = 1000;
    }
    initializeDiv();
    //displayValue = valueInput.value;
} ,false);

// CSV形式でエクスポート
function exportCSV(){
    let momentStr = moment().format("YYYYMMDD-HHmmss");
    //alert(`downloading .csv text: text_${momentStr}.csv`);
    const filename = `text_${momentStr}.csv`;

    let dataStr = "";
    for(let i = 1; i < sessionStorage.length; i++){
        let key = `${i}`;
        let value = sessionStorage.getItem(key);
        dataStr += `"${key}","${value.toString()}"\n`;
    }
    let data = dataStr.slice(0, dataStr.length - 1);

    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    const blob = new Blob([bom, data], {type: "text/csv"});

    const url = (window.URL || window.webkitURL).createObjectURL(blob);
    const download = document.createElement("a");
    download.href = url;
    download.download = filename;
    download.click();
    (window.URL || window.webkitURL).revokeObjectURL(url);
}

const exportCsvButton = document.getElementById("js-exportcsv-button");
exportCsvButton.addEventListener('click', exportCSV, false);

// ログをJSON形式でダウンロードする関数
function exportJSON(){
    // タイムスタンプを取得
    let momentStr = moment().format("YYYYMMDD-HHmmss");
    // タイムスタンプをファイル名に付与
    const filename = `text_${momentStr}.json`;

    // sessionStorageからデータを取り出し、JSON形式にする
    let dataStr = "";
    for(let i = 1; i < sessionStorage.length; i++){
        let key = `${i}`;
        let value = sessionStorage.getItem(key);
        dataStr += `"${key}":"${value.toString()}",`;
    }
    let data = "{" + dataStr.slice(0, dataStr.length - 1) + "}";

    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    const blob = new Blob([bom, data], {type: "text/json"});

    const url = (window.URL || window.webkitURL).createObjectURL(blob);
    const download = document.createElement("a");
    download.href = url;
    download.download = filename;
    download.click();
    (window.URL || window.webkitURL).revokeObjectURL(url);
}

const exportJsonButton = document.getElementById("js-exportjson-button");
exportJsonButton.addEventListener('click', exportJSON, false);

function showRangeValue(){
    let currentIndex = index;
    let currentRangeInput = rangeInput.value;
    let valueInput = valueInputElement.value;

    // キーを
    let key = `${currentIndex}`;
    dataObject[key] = currentRangeInput
    // ログをsessionStorageに保存
    sessionStorage.setItem(`${currentIndex}`, `${dataObject[key]}`);

    let indexAndValue = `<div id="js-div${currentIndex}" class="log-div">${currentIndex},${currentRangeInput}</div>`;

    resultDiv.insertAdjacentHTML('beforeend', indexAndValue);
    resultDiv.scroll(0, resultDiv.scrollHeight);
    index++;

    if(currentIndex > valueInput){
        let deleteTargetDivIndex = currentIndex - valueInput;
        let deleteTargetDiv = document.getElementById(`js-div${deleteTargetDivIndex}`);
        //deleteTargetDiv.textContent = `${deleteTargetDivIndex}番は削除済み`;
        deleteTargetDiv.remove();
    }
}
