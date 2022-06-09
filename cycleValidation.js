//storage -> 2d matrix; (basic needed )
 let collectedGraphComponent = [];
 let graphComponentMatrix = [];
// for (let i = 0; i < rows; i++) {
//     let row = [];
//     for (let j = 0; j < cols; j++) {
//         //why Array ----> more than one child relation (dependency)
//         row.push([]);
//     }
//     graphComponentMatrix.push(row);
// }
// true --> cyclic false --> not cyclic
function isGraphCyclic(graphComponentMatrix) {
    //dependency --> visited  ---> dfs visited(2d array)
    let visited = []; // node visit trace
    let dfsVisited = []; // stack trace

    for (let i = 0; i < rows; i++) {
        let visitedRow = [];
        let dfsVisitedRow = [];
        for (let j = 0; j < cols; j++) {
            visitedRow.push(false);
            dfsVisitedRow.push(false);
        }

        visited.push(visitedRow);
        dfsVisited.push(dfsVisitedRow);
    }
    for (let i = 0; i < rows; i++) {
        for (let j  = 0; j < cols; j++) {
            if (visited[i][j] === false) {
                let response = dfsCycleDetection(graphComponentMatrix, i, j, visited, dfsVisited);
                if (response == true)  return [i ,j];  //// found cycle so return immediately,no need to explore more path
            }
        }
    }
    return  null;
}
// start --> visited true dfsvisited [true]
// end dfsvalue false
// if visit [i][j] --> already explored path so go back no use to explore
// cycle detection condition  -->  if(visited[i][j] == true && dfsvisi[i][j] === true) --> cycle
// return boolean --> true or false
function dfsCycleDetection(graphComponentMatrix, srcr, srcc, visited, dfsVisited) {
    visited[srcr][srcc] = true;
    dfsVisited[srcr][srcc] = true;

    // a1 --> [0,1] ,[1,2] many children
    for (let children = 0; children < graphComponentMatrix[srcr][srcc].length; children++) {
        let [nbrr, nbrc] = graphComponentMatrix[srcr][srcc][children];

        if (visited[nbrr][nbrc] === false) {
            let response = dfsCycleDetection(graphComponentMatrix, nbrr, nbrc, visited, dfsVisited);
            if (response === true) return true; // found cycle so return immediately,no need to explore more path

        }
        else if (visited[nbrr][nbrc] === true && dfsVisited[nbrr][nbrc] === true) {
            return true;
        }

    }
    dfsVisited[srcr][srcc] = false;
    return false;

}