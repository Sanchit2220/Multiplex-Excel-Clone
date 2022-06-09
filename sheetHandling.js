let activeSheetColor = "#ced6e0";
let sheetsFolderCont = document.querySelector(".sheets-folder-cont");
let addSheetBtn = document.querySelector(".sheet-add-icon");

addSheetBtn.addEventListener("click", (e) => {
    let sheet = document.createElement("div");
    sheet.setAttribute("class", "sheet-folder");
    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    sheet.setAttribute("id", allSheetFolders.length);
    sheet.innerHTML = `
   <div class="sheet-content">Sheet ${allSheetFolders.length + 1}</div>
   `;
    sheetsFolderCont.appendChild(sheet);
    sheet.scrollIntoView(); 
    // storage dB
    createSheetDB();
    createGraphComponentMatrix();
    handleSheetActiveness(sheet);
    handleSheetRemoval(sheet);
    sheet.click();
})
function handleSheetRemoval(sheet) {
    sheet.addEventListener("mousedown", (e) => {
        // right click == 2;
        if (e.button !== 2) return;
        let allSheetFolders = document.querySelectorAll(".sheet-folder");
        if (allSheetFolders.length === 1) {
            alert("You need to have atleast one sheet!!");
            return;
        }
        let response = confirm("Your sheet will be removed permanenty,Are you sure?")
        if (response === false) return;
        let sheetIdx = Number(sheet.getAttribute("id"));
        collectedSheetDB.splice(sheetIdx, 1);
        collectedGraphComponent.splice(sheetIdx, 1);
        handleSheetUiRemoval(sheet);
        // by default db to  sheet 1 to active
        sheetDB = collectedSheetDB[0];
        graphComponentMatrix = collectedGraphComponent[0];
        handlSheetProperties();
        console.log(sheetDB);
    })
}
function handleSheetUiRemoval(sheet) {
    sheet.remove(); // remove ui
    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    for (let i = 0; i < allSheetFolders.length; i++) {
        allSheetFolders[i].setAttribute("id", i);
        let sheetContent = allSheetFolders[i].querySelector(".sheet-content");
        sheetContent.innerText = `Sheet ${i + 1}`;
        allSheetFolders[i].style.backgroundColor = "transparent";
    }
    allSheetFolders[0].style.backgroundColor = activeSheetColor;
}
function handleSheetDB(sheetIdx) {
    sheetDB = collectedSheetDB[sheetIdx];
    graphComponentMatrix = collectedGraphComponent[sheetIdx];
}
function handlSheetProperties() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let cell = document.querySelector(`.cell[rid = "${i}"][cid="${j}"]`);
            cell.click();
        }
    }
    // by default click on first cell via dom
    let firstCell = document.querySelector(".cell");
    firstCell.click();
}
function handleSheetUI(sheet) {
    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    for (let i = 0; i < allSheetFolders.length; i++) {
        allSheetFolders[i].style.backgroundColor = "transparent";
    }
    sheet.style.backgroundColor = activeSheetColor;
}


function handleSheetActiveness(sheet) {
    sheet.addEventListener("click", (e) => {
        let sheetIdx = Number(sheet.getAttribute("id"));
        handleSheetDB(sheetIdx);
        handlSheetProperties();
        handleSheetUI(sheet);
    })
}


function createSheetDB() {
    let sheetDB = [];

    for (let i = 0; i < rows; i++) {
        let sheetRow = [];
        for (let j = 0; j < cols; j++) {
            let cellProp = {
                bold: false,
                italic: false,
                underline: false,
                alignment: "left",
                fontFamily: "monospace",
                fontSize: "14",
                fontColor: "#000000",
                BGcolor: "#000000", // just for indication purpose default value; 
                value: "",
                formula: "",
                children: [],
            }
            sheetRow.push(cellProp);
        }
        sheetDB.push(sheetRow);
    }
    collectedSheetDB.push(sheetDB)
}

function createGraphComponentMatrix() {
    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < cols; j++) {
            //why Array ----> more than one child relation (dependency)
            row.push([]);
        }
        graphComponentMatrix.push(row);
    }
    collectedGraphComponent.push(graphComponentMatrix);
}
