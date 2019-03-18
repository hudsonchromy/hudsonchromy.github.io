let grid;
let cellSize;
let start;
let end;
let searchSpace;
let path;
let done;
let bt;
let checked;
let size = 50;
let drawi;
let mode;
let canvasSize;
let time = 0;

function setup() {
  drawi = 0;
  canvasSize = Math.floor(Math.min(window.innerHeight * 0.8, window.innerWidth));
  searchSpace = [];
  document.getElementById("sizeDropdown").innerText = 'Size: ' + size;
  path = [];
  start = [Math.floor(size/2), Math.floor(size/2)];
  end = [size - 1, size - 1];
  createCanvas(canvasSize, canvasSize);
  grid = new Array(size);
  cellSize = Math.floor((canvasSize - 10) / size);
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
    if (mouseX > 0 && mouseX < canvasSize - 1 && mouseY > 0 && mouseY < canvasSize - 1) {
      grid[gridPane(mouseX)][gridPane(mouseY)].setAvailable(true);
      grid[gridPane(mouseX)][gridPane(mouseY)].setColorAvailable();
    }
  }
  else if (mode == "click") {
    if (mouseDown == 1 && mouseY >= 0 && (Date.now() - time) > 200) {
      time = Date.now();
      node = [gridPane(mouseX) , gridPane(mouseY)];
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
      grid[start[0]][start[1]].setAvailable(false);
      start = [gridPane(mouseX) , gridPane(mouseY)];
      grid[start[0]][start[1]].setColorEdge();
    }
  }
  else if (mode == "end") {
    if (mouseDown == 1 && mouseY >= 0) {
      grid[end[0]][end[1]].setColorNothing();
      end = [gridPane(mouseX) , gridPane(mouseY)];
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

function gridPane(x) {
  return Math.min(Math.floor(x / cellSize), size - 1);
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
  reset();
  if (s == 1 || s == -1) {
    size += s;
    if (size == 0) {
      size = 1;
    }
  }
  else {
    size = s;
  }
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
      grid[i][j].setGHF();
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

let mouseDown = 0;
document.body.onmousedown = function() { 
  ++mouseDown;
}
document.body.onmouseup = function() {
  --mouseDown;
}

function search(choice) {
  grid[end[0]][end[1]].setAvailable(false);
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
    if (choice == "DFS") {
      current = queue.pop();
    }
    else {
      if (choice == "AStar") {
        queue.sort(function(a,b){
          return grid[a[0]][a[1]].getF() - grid[b[0]][b[1]].getF();
        });
      }
      current = queue.shift();
    }
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
        if (choice == "AStar") {
          grid[next[0]][next[1]].setG(grid[current[0]][current[1]].getG() + 1);
        }
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
    this.gv = -1;
  }
  setGHF() {
    this.h = -1;
    this.g = -1;
    this.f = -1;
  }
  //the distance gone
  setG(gv) {
    this.gv = gv;
  } 
  getG() {
    if (this.gv == -1) {
      this.gv = grid[bt[this.i][this.j][0]][bt[this.i][this.j][1]].getG() + 1;
    }
    return this.gv;
  }
  //the manhatton distance to end
  getH() {
    if (this.h == -1) {
      this.h = Math.sqrt(Math.pow(this.i - end[0], 2) + Math.pow(this.j - end[1], 2));
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
    this.show();
  }

  show() {
    stroke(150, 150, 150);
    fill(this.r, this.g, this.b);
    strokeWeight(0.1);
    rect(this.x, this.y, this.cellSize, this.cellSize);
  }
}