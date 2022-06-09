
for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        let cell = document.querySelector(`.cell[rid = "${i}"][cid="${j}"]`);
        cell.addEventListener("blur", (e) => {
            let address = addressBar.value;
            let [activeCell, cellProp] = getCellAndCellProp(address);
            let enteredData = activeCell.innerText;
            if (enteredData === cellProp.value) return;
            cellProp.value = enteredData;
            // if data modifies update remove p --- c relation, formula empty , update children with new value
            removeChildFromParent(cellProp.formula);
            cellProp.formula = "";
            updateChildrenCells(address);
        })
    }

}
// normal expression like 10 + 10
let formulaBar = document.querySelector(".formula-bar");
formulaBar.addEventListener("keydown", async (e) => {
    let inputFormula = formulaBar.value;
    if (e.key === "Enter" && inputFormula) {
        let address = addressBar.value;
        let [cell, cellProp] = getCellAndCellProp(address);
        // if change in formula ,break old parent - child relation and evaluate new formula
        if (inputFormula !== cellProp.formula) removeChildFromParent(cellProp.formula);
        addChildToGraphComponent(inputFormula, address);
        let  cycleResponse = isGraphCyclic(graphComponentMatrix);
        if (cycleResponse) {
            // alert("Your formula is cyclic");
            let response = confirm("Your formula is cyclic. do you want to trace your path?")
            while (response === true) {
                //keep your tracing color until user is satisfied
         await    isGraphCyclicTracePath(graphComponentMatrix,cycleResponse);
            response = confirm("Your formula is cyclic. do you want to trace your path?")
           
           
           
            }


            removeChildFromGraphComponent(inputFormula, address);
            return;
        }
        // check formula cyclic or not
        let evalutedValue = evaluateFormula(inputFormula);

        // to update ui and cellprop in db
        setcellUIAndcellProp(evalutedValue, inputFormula, address);
        addChildToParent(inputFormula);
        //console.log(sheetDB);
        updateChildrenCells(address);
    }
})
function addChildToGraphComponent(formula, childAddress) {
    let [crid, ccid] = decodeRidCiDFromAddress(childAddress);
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [prid, pcid] = decodeRidCiDFromAddress(encodedFormula[i]);
            //rid --> i; cid --> j
            graphComponentMatrix[prid][pcid].push([crid, ccid]); // i want to complete iteration  of color tracking so i will attach wait here also
        }
    }
}
function removeChildFromGraphComponent(formula, childAddress) {
    let [crid, ccid] = decodeRidCiDFromAddress(childAddress);
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [prid, pcid] = decodeRidCiDFromAddress(encodedFormula[i]);

            graphComponentMatrix[prid][pcid].pop();
        }
    }
}

function updateChildrenCells(parentAddress) {
    let [parentCell, parentCellProp] = getCellAndCellProp(parentAddress);
    let children = parentCellProp.children;

    for (let i = 0; i < children.length; i++) {
        let childAddress = children[i];
        let [childCell, childCellProp] = getCellAndCellProp(childAddress);
        let childFormula = childCellProp.formula;
        let evalutedValue = evaluateFormula(childFormula);
        setcellUIAndcellProp(evalutedValue, childFormula, childAddress);
        updateChildrenCells(childAddress);
    }

}
// get children 
function addChildToParent(formula) {
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);
            parentCellProp.children.push(childAddress);


        }
    }

}
// remove link to another parent
function removeChildFromParent(formula) {
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);
            let idx = parentCellProp.children.indexOf(childAddress);
            parentCellProp.children.splice(idx, 1);
        }
    }
}



function evaluateFormula(formula) {
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [cell, cellProp] = getCellAndCellProp(encodedFormula[i]);
            encodedFormula[i] = cellProp.value;
        }
    }
    let decodedFormula = encodedFormula.join(" ");
    return eval(decodedFormula);
}
function setcellUIAndcellProp(evalutedValue, formula, address) {

    let [cell, cellProp] = getCellAndCellProp(address);
    cell.innerText = evalutedValue;// ui update
    cellProp.value = evalutedValue;//db update
    cellProp.formula = formula;
    // console.log(cellProp);
}