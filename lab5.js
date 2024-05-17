const n1 = 3;
const n2 = 3;
const n3 = 0;
const n4 = 7;
const n = 10 + n3;

const prng = new PRNG(3307);
let matrix2 = [];
const k1 = 1 - n3 * 0.01 - n4 * 0.005 - 0.15;   //lab3
for (let i = 0; i < n; i++) {
    matrix2[i] = [];
    for (let j = 0; j < n; j++) {
        let num = prng.next();
        matrix2[i][j] = Math.floor(num * k1);
    }
}
function PRNG(seed) {   //stackoverflow
    this.seed = seed;
    const g = Math.pow(2, 31);
    this.next = function () {
        this.seed = (5665 * this.seed + 999) % g;
        return (this.seed / g) * 2;
    };
}
function drawArrow(x, y, angle, color) {  //lab3
    const arrowheadSize = 10;
    ctx.fillStyle = color;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-arrowheadSize, arrowheadSize / 2);
    ctx.lineTo(-arrowheadSize, -arrowheadSize / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function drawNodeColor(i, array, color) {    //lab3
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(array[i].x, array[i].y, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.closePath();
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${i + 1}`, array[i].x, array[i].y);
}

console.log(`Directed graph matrix: `);
console.log(matrix2);

const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');
let radius = 300;
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const angleIncrement = (2 * Math.PI) / (n - 1);
const nodePositions2 = [];
for (let i = 0; i < n - 1; i++) {
    const x = centerX - radius * Math.cos(i * angleIncrement);
    const y = centerY - radius * Math.sin(i * angleIncrement);
    nodePositions2.push({x: x, y: y});   //lab3
}
function selfConnection(i, angle, x, y, color)
{
    let offsetX;
    ctx.strokeStyle = color;
    if ((x > canvas.width / 2)) {
        offsetX = 40;
    } else {
        offsetX = -40;
    }
    x += offsetX;
    ctx.beginPath();
    ctx.arc(x, y - 15, 20, Math.PI / 1.3, Math.PI * 6.5 / 2);
    ctx.stroke();
    ctx.closePath();
    drawArrow(x, y + 6, angle, color); //lab 3
}



function drawConnection(i, j, nodePositions, matrix, color) {
    if (matrix[i][j] === 1 && i <= 10) {
        const nodePosI = nodePositions[i];
        const nodePosJ = nodePositions[j];
        const midX = (nodePosI.x + nodePosJ.x) / 2;
        const midY = (nodePosI.y + nodePosJ.y) / 2;
        ctx.beginPath();
        ctx.moveTo(nodePosJ.x, nodePosJ.y);
         if (i !== j) {
            drawRegularConnection(i, j, midX, midY, nodePosI, nodePosJ, 1, color);
        } else {
            let angle;
            if (nodePosI.x <= canvas.width / 2) angle = Math.PI / 6
            else angle = Math.PI * 7 / 8;
            selfConnection(i, angle, nodePosI.x, nodePosI.y, color);   //lab3
        }
    }
}

function drawRegularConnection(i, j, midX, midY, nodePosI, nodePosJ, a, color) {
    ctx.strokeStyle = color;
    if ((nodePosJ.x < centerX / 2 && nodePosI.x < centerX / 2) || (nodePosJ.x > centerX /
        2 && nodePosI.x > centerX / 2)) {
        ctx.lineTo(nodePosI.x + 20, nodePosI.y);
    } else {
        ctx.lineTo(nodePosI.x, nodePosI.y + 20);
    }
    ctx.stroke();
    const angle = Math.atan2(nodePosJ.y - nodePosI.y, nodePosJ.x - nodePosI.x);
    const offsetX = Math.cos(angle) * 40;
    const offsetY = Math.sin(angle) * 40;
    if (a === 1) drawArrow(nodePosJ.x - offsetX, nodePosJ.y - offsetY, angle, color); //lab3
}
nodePositions2.push({x: centerX, y: centerY});
for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
        drawConnection(i, j, nodePositions2, matrix2);
    }
}
for (let i = 0; i < n; i++) {
    drawNodeColor(i, nodePositions2, '#f1f1f1');
}
let startNode = 0;
for (let i = 0; i < n; i++) {
    if (matrix2[i].some(value => value === 1)) {
        startNode = i;
        break;
    }
}

function changeColor(node, status) {
    let color;
    switch (status) {
        case 'active':
            color = '#f11ff1';
            break;
        case 'visited':
            color = '#8B008B';
            break;
        case 'closed':
            color = '#B22222';
            break;

    }
    drawNodeColor(node, nodePositions2, color)
}

const connectedNodes = (i) => {
    let r = [];
    for (let j = 0; j < matrix2[i].length; j++) {
        if (matrix2[i][j] === 1) r.push(j);
    }
    return r;
}

let queue = [startNode];
let visitedBFS = [];
let BfsAdj = []
for (let i = 0; i < n; i++){
    BfsAdj[i] = [];
    for(let j = 0; j < n; j++){
        BfsAdj[i][j] = 0;
    }}
let nodeOrderBFS = [startNode];

function nextStepBFS() {
    if (queue.length > 0) {
        let node = queue.shift();
        queue.unshift(node);
        visitedBFS.push(node);
        changeColor(node, 'active');
        let connected = connectedNodes(node);
        let checkNeighbor = 0;
        for (let q of connected) {
            if (!visitedBFS.includes(q) && !queue.includes(q)) {
                queue.push(q);
                drawConnection(node, q, nodePositions2, matrix2, 'blue')
                checkNeighbor = 1;
                visitedBFS.push(q);
                changeColor(node, 'active');
                changeColor(q, 'visited');
                BfsAdj[node][q] = 1;
                nodeOrderBFS.push(q);
                break;
            }
        }
        if (checkNeighbor === 0) {
            changeColor(node, 'closed');
            queue.shift();
        }
        console.log(queue)
        return node;
    }
    console.log('BFS adjacency matrix');
    console.log(BfsAdj);
    for (let i = 0; i < n; i++) {
        console.log(`${i + 1} - ${nodeOrderBFS.indexOf(i) + 1}`);
    }
    return null;
}

document.getElementById('nextStepButton').addEventListener('click', function () {
    nextStepBFS();
});
let stack = [startNode];
let visited = [];
let lastActiveNode = null;
let DfsAdj = []
for (let i = 0; i < n; i++){
    DfsAdj[i] = [];
    for(let j = 0; j < n; j++){
        DfsAdj[i][j] = 0;
    }}
let nodeOrder = [startNode];

function nextstep() {
    if (stack.length > 0) {
        if (lastActiveNode !== null) changeColor(lastActiveNode, 'visited');
        let node = stack[stack.length -1];
        visited.push(node);
        changeColor(node, 'active');
        let connected = connectedNodes(node);
        let checkNeighbor = 0;
        for (let q of connected) {
            if (!visited.includes(q)) {
                stack.push(q);
                drawConnection(node, q, nodePositions2, matrix2, 'blue')
                checkNeighbor = 1;
                visited.push(q);
                changeColor(node, 'active');
                changeColor(q, 'visited');
                DfsAdj[node][q] = 1;
                nodeOrder.push(q);
                break;
            }
        }
        if (checkNeighbor === 0) {
            changeColor(node, 'closed');
            stack.pop()
            lastActiveNode = null;
        } else lastActiveNode = node;
        console.log(stack)
        return node;
    }
    console.log('DFS adjacency matrix');
    console.log(DfsAdj);
    for (let i = 0; i < n; i++) {
        console.log(`${i + 1} - ${nodeOrder.indexOf(i) + 1}`);
    }
    return null;
}

document.getElementById('nextButton').addEventListener('click', function () {
    nextstep();
});
