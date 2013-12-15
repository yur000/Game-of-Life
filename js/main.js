/* -------- main.js ----------*/
function initialize(which) {

	switch(which) {
		case 'create':
			initCreateStuff();
			break;
		/* ------------------ */
		case 'world':
			initWorldStuff();
			break;
		/* ------------------ */
	}
}
/* --------------------------------------- */
function initCreateStuff() {
	var createButton = document.getElementById('create');

	createButton.onclick = function() {
		initialize('world');
		showBlock('world');
	};
}
/* --------------------------------------- */
function initWorldStuff() {
	var rowsValue = document.getElementById('rows').value;
	var columnsValue = document.getElementById('columns').value;
	var generationsValue = document.getElementById('generations').value;
	var speedValue = document.getElementById('speed').value;

	var world = new World(rowsValue, columnsValue, generationsValue, speedValue);

	world.backButton.onclick = function() {
		world.destroy();
		showBlock('form');
	};
	world.randomizeButton.onclick = function() {
		world.randomize();
	};
	world.clearButton.onclick = function() {
		world.clear();
	};
	world.startButton.onclick = function() {
		world.startManager('start');
	};
}
/* ---------------------------------------------------------------------------------- */
function showBlock(which) {

	var worldCell = document.getElementById('worldcell');
	var formCell = document.getElementById('formcell');

	if(which == 'world') {
		formCell.style.display = 'none';
		worldCell.style.display = 'table-cell';
	}
	if(which == 'form') {
		worldCell.style.display = 'none';
		formCell.style.display = 'table-cell';
	}
}
/* ---------------------------------------------------------------------------------- */
function touchLife(life) {

	if(life.className == lifeClassName('dead')) {
		life.className = lifeClassName('live');
	} else {
		life.className = lifeClassName('dead');
	}
}

/* ---------------------------------------------------------------------------------- */
function lifeClassName(className) {

	if(className == 'classname') {
		return 'life';
	}
	if(className == 'live') {
		return 'life live';
	}
	if(className == 'dead') {
		return 'life dead';
	}
}
/* ---------------------------------------------------------------------------------- */
function isStoppedLife() {
	var button = document.getElementById('start');

	if(button.className == 'button stopped') {
		return true;
	}
	if(button.className == 'button started') {
		return false;
	}
}
/* ---------------------------------------------------------------------------------- */
function generator(world) {

	world.printHeader();

	buildNextGen(world.field, world.fieldBuffer);
	
	if(world.generationCurrent < world.generations && !isStoppedLife()) {
		setTimeout(function() {
			world.generationCurrent++;
			generator(world);
		}, world.speed);
	}

	if(world.generationCurrent == world.generations) {
		world.startManager('init');
	}
};
/* --------------------------------------- */
function buildNextGen(currentGen, nextGen) {

	for(var i=0; i<currentGen.length; i++) {
		for(var j=0; j<currentGen[i].length; j++) {
			var count = neighborCount(currentGen, i, j);

			if(count == 3 || (count == 2 && currentGen[i][j].className == lifeClassName('live'))) {
				nextGen[i][j].className = lifeClassName('live');
			} else {
				nextGen[i][j].className = lifeClassName('dead');
			}
		}
	}

	for(var i=0; i<currentGen.length; i++) {
		for(var j=0; j<currentGen[i].length; j++) {
			currentGen[i][j].className = nextGen[i][j].className;
		}
	}
}
/* --------------------------------------- */
function neighborCount(currentGen, i, j) {

	var up = i-1;
	var down = i+1;
	var left = j-1;
	var right = j+1;
	
	if(j == 0) left = currentGen[0].length-1;
	if(j == currentGen[0].length-1) right = 0;
	if(i == 0) up = currentGen.length-1;
	if(i == currentGen.length-1) down = 0;

	var neighbors = [currentGen[up][j], currentGen[up][right], 
	currentGen[i][right], currentGen[down][right], currentGen[down][j], 
	currentGen[down][left], currentGen[i][left], currentGen[up][left]];

	var count = 0;

	for(var i=0; i<neighbors.length; i++) {
		if(neighbors[i].className == lifeClassName('live')) count++;
	}

	return count;
}
/* ---------------------------------------------------------------------------------- */