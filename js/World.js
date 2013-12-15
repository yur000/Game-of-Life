/* -------- World.js ----------*/
function World(rowsIn, columnsIn, generationsIn, speedIn) {
	this.rows = rowsIn;
	this.columns = columnsIn;
	this.generations = generationsIn;
	this.speed = speedIn;

	this.gameDIV = document.getElementById('GameOfLife');
	this.worldDIV = document.getElementById('world');
	this.infoDIV = document.getElementById('info');


	this.backButton = document.getElementById('back');
	this.randomizeButton = document.getElementById('randomize');
	this.clearButton = document.getElementById('clear');
	this.startButton = document.getElementById('start');

	this.generationCurrent = 1;

	this.field = [];
	this.field.length = 0;

	this.fieldBuffer = [];
	this.fieldBuffer.length = 0;

	this.create();
	this.createBuffer();
}
/* ---------------------------------------------------------------------------------- */
World.prototype.toString = function() {
	return "Rows: " + this.rows + 
	", Columns: " + this.columns + 
	", Generations: " + this.generations + 
	", Speed: " + this.speed;
};
/* ---------------------------------------------------------------------------------- */
World.prototype.create = function() {

	this.printHeader();

	for(var i=0; i<this.rows; i++) {
		var row = document.createElement('div');
		row.className = 'row';
		this.worldDIV.appendChild(row);
		
		for(var j=0; j<this.columns; j++) {
			var cell = document.createElement('div');
			cell.className = 'cell';

			var life = document.createElement('div');
			life.className = lifeClassName('dead');

			life.onclick = function() {
				touchLife(this);
			};

			cell.appendChild(life);
			row.appendChild(cell);
		}
	}

	var rowDIVs = this.worldDIV.getElementsByClassName('row');
	var array = [];
	array.length = rowDIVs.length;

	for(var i=0; i<array.length; i++) {
		array[i] = rowDIVs[i].getElementsByClassName(lifeClassName('classname'));
	}

	this.field = array;
};
/* ---------------------------------------------------------------------------------- */
World.prototype.createBuffer = function() {

	var array = [];
	array.length = this.rows;

	for(var i=0; i<array.length; i++) {
		array[i] = [];
		array[i].length = this.columns;
	}

	for(var i=0; i<array.length; i++) {
		for(var j=0; j<array[i].length; j++) {
			array[i][j] = { className: lifeClassName('dead') }
		}
	}

	this.fieldBuffer = array;
};
/* ---------------------------------------------------------------------------------- */
World.prototype.printHeader = function() {

	if(!this.infoDIV.hasChildNodes()) {
		var lines = [];
		lines.length = 2;

		for(var i=0; i<lines.length; i++) {
			lines[i] = document.createElement('p');
			this.infoDIV.appendChild(lines[i]);
		}
	}
	
	this.infoDIV.children[0].innerHTML = 'Generation: ' + this.generationCurrent + '/' 
		+ this.generations;
	this.infoDIV.children[1].innerHTML = 'Universe: ' + this.rows + 'x' + this.columns + 
		', Speed: ' + this.speed + 'ms';
};
/* ---------------------------------------------------------------------------------- */
World.prototype.randomize = function() {

	var array = this.field;

	for(var i=0; i<array.length; i++) {
		for(var j=0; j<array[i].length; j++) {
			if(getRandomInt(0, 1) == 0) {
				array[i][j].className = lifeClassName('dead');
			} else {
				array[i][j].className = lifeClassName('live');
			}
		}
	}
};
/* ---------------------------------------------------------------------------------- */
World.prototype.clear = function() {

	var array = this.field;

	for(var i=0; i<array.length; i++) {
		for(var j=0; j<array[i].length; j++) {
			if(array[i][j].className == lifeClassName('live')) {
				array[i][j].className = lifeClassName('dead');
			}
		}
	}
};
/* ---------------------------------------------------------------------------------- */
World.prototype.destroy = function() {

	if(confirm("Are you sure?\nThe universe would be being lost forever!")) {
		var array = this.field;

		for(var i=array.length-1; i>=0; i--) {
			this.worldDIV.removeChild(this.worldDIV.children[i]);
			array.length--;
		}

		this.startManager('init');
	}
};
/* ---------------------------------------------------------------------------------- */
World.prototype.startManager = function(mode) {
	
	var world = this;
	var button = this.startButton;
	
	if(mode == 'start') {
		button.innerHTML = 'Stop';
		button.className = 'button started';
		button.onclick = function() {
			world.startManager('stop');
		}
		generator(world);
	} else {
		if(mode == 'init') {
			button.innerHTML = 'Start';
			world.generationCurrent = 1;
		}
		if(mode == 'stop') {
			button.innerHTML = 'Resume';
		}
		button.onclick = function() {
			world.startManager('start');
		}
		button.className = 'button stopped';
	}
};
/* ---------------------------------------------------------------------------------- */