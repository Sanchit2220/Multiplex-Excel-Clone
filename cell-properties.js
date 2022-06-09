//storage
let collectedSheetDB = []; // contains all sheet db
let sheetDB = [];

{
    let addSheetBtn = document.querySelector(".sheet-add-icon");
    addSheetBtn.click();
   
}     
 


// selectors for cell property

let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let fontSize = document.querySelector(".font-size-prop");
let fontFamily = document.querySelector(".font-family-prop");
let fontColor = document.querySelector(".font-color-prop");
let BGcolor = document.querySelector(".BGcolor-prop");
let alignment = document.querySelectorAll(".alignment");
let leftAlign = alignment[0];
let centerAlign = alignment[1];
let rightAlign = alignment[2];


let activeColorProp = "#d1d8e0";
let inactiveColorProp = "#ecf0f1";

// application of two way binding
// attach property listeners
bold.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    //modification
    cellProp.bold = !cellProp.bold;
    cell.style.fontWeight = cellProp.bold ? "bold" : "normal"; // ui change
    bold.style.backgroundColor = cellProp.bold ? activeColorProp : inactiveColorProp;
})
italic.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    //modification
    cellProp.italic = !cellProp.italic;
    cell.style.fontStyle = cellProp.italic ? "italic" : "normal"; // ui change
    italic.style.backgroundColor = cellProp.italic ? activeColorProp : inactiveColorProp;
})

underline.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    //modification
    cellProp.underline = !cellProp.underline; // data change
    cell.style.textDecoration = cellProp.underline ? "underline" : "none"; // ui change
    underline.style.backgroundColor = cellProp.underline ? activeColorProp : inactiveColorProp;
})
fontFamily.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    cellProp.fontFamily = fontFamily.value;
    cell.style.fontFamily = cellProp.fontFamily;
    fontFamily.value = cellProp.fontFamily;
})
fontSize.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    cellProp.fontSize = fontSize.value;
    cell.style.fontSize = cellProp.fontSize + "px";
    fontSize.value = cellProp.fontSize;
})

fontColor.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    cellProp.fontColor = fontColor.value;
    cell.style.color = cellProp.fontColor;
    fontColor.value = cellProp.fontColor;
})
BGcolor.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    cellProp.BGcolor = BGcolor.value;
    cell.style.backgroundColor = cellProp.BGcolor;
    BGcolor.value = cellProp.BGcolor;
})

alignment.forEach((alignment) => {
    alignment.addEventListener("click", (e) => {
        let address = addressBar.value;
        let [cell, cellProp] = getCellAndCellProp(address);
        let alignValue = e.target.classList[0];
        cellProp.alignment = alignValue; // data change
        cell.style.textAlign = cellProp.alignment; // ui change


        switch (alignValue) { // ui change
            case "left":
                leftAlign.style.backgroundColor = activeColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "center":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = activeColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "right":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = activeColorProp;
                break;
        }

    })
})
let allCells = document.querySelectorAll(".cell");
for (let i = 0; i < allCells.length; i++) {
    addListenerToAttachCellProperties(allCells[i]);
}

function addListenerToAttachCellProperties(cell) {
    //work
    cell.addEventListener("click", (e) => {
        let address = addressBar.value;
        let [rid, cid] = decodeRidCiDFromAddress(address);
        let cellProp = sheetDB[rid][cid];
        //apply cell properties
        cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
        cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
        cell.style.textDecoration = cellProp.underline ? "underline" : "none";
        cell.style.fontSize = cellProp.fontSize + "px";
        cell.style.fontFamily = cellProp.fontFamily;
        cell.style.color = cellProp.fontColor;
        cell.style.backgroundColor = cellProp.BGcolor === "#000000" ? "transparent" : cellProp.BGcolor;
        cell.style.textAlign = cellProp.alignment;

        //apply properties ui container
        bold.style.backgroundColor = cellProp.bold ? activeColorProp : inactiveColorProp;
        italic.style.backgroundColor = cellProp.italic ? activeColorProp : inactiveColorProp;
        underline.style.backgroundColor = cellProp.underline ? activeColorProp : inactiveColorProp;

        fontColor.value = cellProp.fontColor;
        BGcolor.value = cellProp.BGcolor;
        fontSize.value = cellProp.fontSize;
        fontFamily.value = cellProp.fontFamily;

        switch (cellProp.alignment) { // ui change
            case "left":
                leftAlign.style.backgroundColor = activeColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "center":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = activeColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "right":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = activeColorProp;
                break;

        }
        let formulaBar = document.querySelector(".formula-bar");
        formulaBar.value = cellProp.formula;
        cell.innerText = cellProp.value;
    })
}



function getCellAndCellProp(address) {
    let [rid, cid] = decodeRidCiDFromAddress(address);
    //acess cell and storage object
    let cell = document.querySelector(`.cell[rid = "${rid}"][cid="${cid}"]`);
    let cellProp = sheetDB[rid][cid];
    return [cell, cellProp];
}

function decodeRidCiDFromAddress(address) {
    // address -> row;
    let rid = Number(address.slice(1) - 1); // row acess
    let cid = Number(address.charCodeAt(0) - 65); // alphabet to number
    return [rid, cid];
}