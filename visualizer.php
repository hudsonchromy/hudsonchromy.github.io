<!DOCTYPE html>
<html>
	<head>
		<title>Algorithm Visualizer</title>
        <link href="style.css" rel="stylesheet" type="text/css">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.3/p5.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.3/addons/p5.dom.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.3/addons/p5.sound.min.js"></script>
        <meta charset="utf-8" />
	</head>
    <?php include($header); ?>
    <script src="sketch.js"></script>
    <div class="btn-group">
        <button onclick="reset()">Reset</button>
        <button onclick="setre()">Set</button>
        <button onclick="search('BFS')">BFS</button>
        <button onclick="search('DFS')">DFS</button>
        <button onclick="search('AStar')">A-Star</button>
        <div class="dropdown">
            <button class="dropbtn" id="dropdown">Mode</button>
            <div class="dropdown-content">
                <a onclick='opt("drag")'>Drag</a>
                <a onclick='opt("click")'>Click</a>
                <a onclick='opt("start")'>Start</a>
                <a onclick='opt("end")'>End</a>
            </div>
        </div>
        <div class="dropdown">
            <button class="dropbtn" id="sizeDropdown">Size: </button>
            <div class="dropdown-content">
                <a onclick='resize(1)'>+</a>
                <a onclick='resize(-1)'>-</a>
                <a onclick='resize(20)'>20</a>
                <a onclick='resize(50)'>50</a>
                <a onclick='resize(80)'>80</a>
                <a onclick='resize(100)'>100</a>
            </div>
        </div>
        <div class="dropdown">
                <button class="dropbtn" id="speedDropdown">Speed: 1</button>
                <div class="dropdown-content">
                    <a onclick='speed(1/4)'>1/4</a>
                    <a onclick='speed(1/2)'>1/2</a>
                    <a onclick='speed(1)'>1</a>
                    <a onclick='speed(2)'>2</a>
                    <a onclick='speed(4)'>4</a>
                    <a onclick='speed(-1)'>Show</a>
                </div>
            </div>
    </div>
    <p id="searchSpace">Search Space: </p>
    <p id="pathLength">Path Length: </p>

		

		
</html>