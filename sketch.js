let grid;
let cellSize;
let start;
let end;
let searchSpace;
let path;
let done;
let bt;
let checked;
let size = 20;
let drawi;
let mode;
let canvasSize = 601;

function setup() {
  drawi = 0;
  canvasSize = Math.floor(Math.min(window.innerHeight * 0.8, window.innerWidth));
  console.log(canvasSize);
  searchSpace = [];
  document.getElementById("sizeDropdown").innerText = 'Size: ' + size;
  path = [];
  start = [Math.floor(size/2), Math.floor(size/2)];
  end = [size - 1, size - 1];
  createCanvas(canvasSize, canvasSize);
  grid = new Array(50);
  cellSize = (canvasSize - 1) / size;
  for (var i = 0; i < grid.length; i++) {
    grid[i] = new Array(grid.length);
    for (var j = 0; j < grid.length; j++) {
      grid[i][j] = new Cell(i * cellSize, j * cellSize, cellSize, i, j);
      grid[i][j].show();
    }
  }
}

function draw() {
  if (mode == "drag") {
    if (mouseX > 0 && mouseX < 600 && mouseY > 0 && mouseY < 600) {
      grid[Math.floor(mouseX / cellSize)][Math.floor(mouseY / cellSize)].setAvailable(true);
      grid[Math.floor(mouseX / cellSize)][Math.floor(mouseY / cellSize)].setColorAvailable();
    }
  }
  else if (mode == "click") {
    if (mouseDown == 1 && mouseY >= 0) {
      node = [Math.floor(mouseX / cellSize) , Math.floor(mouseY / cellSize)];
      if (grid[node[0]][node[1]].getAvailable()) {
        grid[node[0]][node[1]].setAvailable(false);
        grid[node[0]][node[1]].setColorNothing();
      }
      else {
        console.log("---");
        grid[node[0]][node[1]].setAvailable(true);
        grid[node[0]][node[1]].setColorAvailable();
      }
    }
  }
  else if (mode == "start") {
    if (mouseDown == 1 && mouseY >= 0) {
      grid[start[0]][start[1]].setColorNothing();
      start = [Math.floor(mouseX / cellSize) , Math.floor(mouseY / cellSize)];
      grid[start[0]][start[1]].setColorEdge();
    }
  }
  else if (mode == "end") {
    if (mouseDown == 1 && mouseY >= 0) {
      grid[end[0]][end[1]].setColorNothing();
      end = [Math.floor(mouseX / cellSize) , Math.floor(mouseY / cellSize)];
      grid[end[0]][end[1]].setColorEdge();

    }
  }
  if (done) {
    if (drawi < checked.length) {
      c = checked[drawi];
      grid[c[0]][c[1]].setColorChecked();
    }
    else if (drawi - checked.length == path.length) {
      done = false;
      drawi = 0;
    }
    else {
      c = path[drawi - checked.length];
      grid[c[0]][c[1]].setColorPath();
    }
    drawi++;
  }
  grid[start[0]][start[1]].setColorEdge();
  grid[end[0]][end[1]].setColorEdge();
}

function setre() {
  document.getElementById("searchSpace").innerText = 'Search Space: ';
  document.getElementById("pathLength").innerText = 'Path Length: ';
  drawi = 0;
  done = false;
  for (var i = 0; i < grid.length; i++) {
    for (var j = 0; j < grid.length; j++) {
      if (!grid[i][j].getAvailable()) {
        grid[i][j].setAvailable(false);
        grid[i][j].setColorNothing();
      }
    }
  }
  grid[start[0]][start[1]].setColorEdge();
  grid[end[0]][end[1]].setColorEdge();
}
function resize(s) {
  size = s;
  setup();
}

function reset() {
  document.getElementById("searchSpace").innerText = 'Search Space: ';
  document.getElementById("pathLength").innerText = 'Path Length: ';
  drawi = 0;
  done = false;
  for (var i = 0; i < grid.length; i++) {
    for (var j = 0; j < grid.length; j++) {
      grid[i][j].setAvailable(false);
      grid[i][j].setColorNothing();
    }
  }
  grid[start[0]][start[1]].setColorEdge();
  grid[end[0]][end[1]].setColorEdge();
}

function opt(option) {
  if (option == "nothing") {
    mode = "nothing";
    document.getElementById("dropdown").innerText = 'Mode';
  }
  else if (option == "drag") {
    mode = "drag";
    document.getElementById("dropdown").innerText = 'Mode (Drag)';
  }
  else if (option == "click") {
    mode = "click";
    document.getElementById("dropdown").innerText = 'Mode (Click)';
  }
  else if (option == "start") {
    mode = "start";
    document.getElementById("dropdown").innerText = 'Mode (Start)';
  }
  else {
    mode = "end";
    document.getElementById("dropdown").innerText = 'Mode (End)';
  }
}

var mouseDown = 0;
document.body.onmousedown = function() { 
  ++mouseDown;
}
document.body.onmouseup = function() {
  --mouseDown;
}

function BFS() {
  setre();
  opt("nothing");
  var queue = [start];
  checked = [];
  path = []
  bt = new Array(size);
  for (var i = 0; i < bt.length; i++) {
    bt[i] = new Array(bt.length);
    for (var j = 0; j < bt.length; j++) {
      bt[i][j] = -1;
    }
  }
  bt[start[0]][start[1]] = [start[0], start[1]];
  last = queue[0];
  checked = [];
  while (queue.length != 0) {
    current = queue.shift();
    if (end[0] == current[0] && end[1] == current[1]) {
      done = true;
      backtrack();
      document.getElementById("searchSpace").innerText = 'Search Space: ' + checked.length;
      document.getElementById("pathLength").innerText = 'Path Length: ' + path.length;
      return;
    }
    for (t = 0; t < 4; t++) {
      if (canMove(t, current)) {
        next = move(t, current);
        checked.push(next);
        queue.push(next);
        bt[next[0]][next[1]] = current;
      }
    }
  }
  console.log("not found");
  document.getElementById("searchSpace").innerText = 'Search Space: ' + checked.length;
  document.getElementById("pathLength").innerText = 'Path Length: N/A';
  done = true;
}

function DFS() {
  setre();
  opt("nothing");
  checked = [];
  path = [];
  var queue = [start];
  bt = new Array(size);
  for (var i = 0; i < bt.length; i++) {
    bt[i] = new Array(bt.length);
    for (var j = 0; j < bt.length; j++) {
      bt[i][j] = -1;
    }
  }
  bt[start[0]][start[1]] = [start[0], start[1]];
  last = queue[0];
  checked = [];
  while (queue.length != 0) {
    current = queue.pop();
    checked.push(current);
    if (end[0] == current[0] && end[1] == current[1]) {
      done = true;
      backtrack();
      document.getElementById("searchSpace").innerText = 'Search Space: ' + checked.length;
      document.getElementById("pathLength").innerText = 'Path Length: ' + path.length;
      return;
    }
    for (t = 0; t < 4; t++) {
      if (canMove(t, current)) {
        next = move(t, current);
        queue.push(next);
        bt[next[0]][next[1]] = current;
      }
    }
  }
  document.getElementById("searchSpace").innerText = 'Search Space: ' + checked.length;
  document.getElementById("pathLength").innerText = 'Path Length: N/A';
  done = true;
}

function AStar() {
  setre();
  opt("nothing");
  var queue = [start];
  checked = [];
  path = []
  bt = new Array(size);
  for (var i = 0; i < bt.length; i++) {
    bt[i] = new Array(bt.length);
    for (var j = 0; j < bt.length; j++) {
      bt[i][j] = -1;
    }
  }
  bt[start[0]][start[1]] = [start[0], start[1]];
  grid[start[0]][start[1]].setG(0);
  last = queue[0];
  checked = [];
  while (queue.length != 0) {
    queue.sort(function(a,b){
      return grid[a[0]][a[1]].getF() - grid[b[0]][b[1]].getF();
    });
    current = queue.shift();
    if (end[0] == current[0] && end[1] == current[1]) {
      done = true;
      backtrack();
      document.getElementById("searchSpace").innerText = 'Search Space: ' + checked.length;
      document.getElementById("pathLength").innerText = 'Path Length: ' + path.length;
      return;
    }
    for (t = 0; t < 4; t++) {
      if (canMove(t, current)) {
        next = move(t, current);
        grid[next[0]][next[1]].setG(grid[current[0]][current[1]].getG() + 1);
        checked.push(next);
        queue.push(next);
        bt[next[0]][next[1]] = current;
      }
    }
  }
  console.log("not found");
  document.getElementById("searchSpace").innerText = 'Search Space: ' + checked.length;
  document.getElementById("pathLength").innerText = 'Path Length: N/A';
  done = true;
}

function backtrack() {
  path = [];
  current = end;
  while (!(current[0] == start[0] && current[1] == start[1])) {
    path.push(current);
    current = bt[current[0]][current[1]];
  }
}

function canMove(x, current) {
  if (x == 0) {
    return (current[1] - 1 >= 0 && !grid[current[0]][current[1] - 1].getAvailable() &&  bt[current[0]][current[1] - 1] == -1);
  }
  else if (x == 1) {
    return (current[0] + 1 < bt.length && !grid[current[0] + 1][current[1]].getAvailable() &&  bt[current[0] + 1][current[1]] == -1);
  }
  else if (x == 2) {
    return (current[1] + 1 < bt.length && !grid[current[0]][current[1] + 1].getAvailable() && bt[current[0]][current[1] + 1] == -1);
  }
  else {
    return (current[0] - 1 >= 0 && !grid[current[0] - 1][current[1]].getAvailable() && bt[current[0] - 1][current[1]] == -1);
  }
}

function move(x, current) {
  if (x == 0) {
    return ([current[0], current[1] - 1]);
  }
  else if (x == 1) {
    return ([current[0] + 1, current[1]]);
  }
  else if (x == 2) {
    r = [current[0], current[1] + 1];
    return r;
  }
  else {
    return ([current[0] - 1, current[1]]);
  }
}



class Cell {
  constructor(x, y, cellSize, i, j) {
    this.x = x;
    this.y = y;
    this.cellSize = cellSize;
    this.i = i;
    this.j = j;
    this.r = 49;
    this.g = 68;
    this.b = 85;
    this.available = false;
    this.changed = false;
    this.h = -1;
    this.f = -1;
  }
  //the distance gone
  setG(g) {
    this.g = g;
  }
  getG() {
    return this.g;
  }
  //the manhatton distance to end
  setH(h) {
    this.g = g;
  }
  getH() {
    if (this.h == -1) {
      this.h = Math.sqrt(Math.pow(Math.abs(this.i - end[0]), 2) + Math.pow(Math.abs(this.j - end[1]), 2));
    }
    return this.h;
  }
  getF() {
    if (this.f == -1) {
      this.f = this.getH() + this.getG();
    }
    return this.f;
  }

  setAvailable(a) {
    this.available = a;
  }

  setChanged(a) {
    this.changed = a;
  }

  getChanged() {
    return this.changed;
  }

  getAvailable() {
    return this.available;
  }

  setColorChecked() {
    this.setColor(100, 100, 100);
  }

  setColorPath() {
    this.setColor(0, 0, 0);
  }

  setColorNothing() {
    this.setColor(49, 68, 85);
  }

  setColorEdge() {
    this.setColor(242, 242, 242);
  }

  setColorAvailable() {
    this.setColor(60, 37, 43);
  }

  setColor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.show();
  }

  show() {
    stroke(255);
    strokeWeight(0.1);
    fill(this.r, this.g, this.b);
    rect(this.x, this.y, this.cellSize, this.cellSize);
  }
}