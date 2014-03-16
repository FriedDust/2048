function Grid() {
	this.cols = 4;
	this.cells = [];
	
	for (var x=0; x<this.cols; x++) {
		this.cells[x] = [];
		
		for (var y=0; y<this.cols; y++) {
			this.cells[x][y] = null;
		}
	}
}

Grid.prototype.addTile = function(tile) {
	tile.prev = tile;
	this.cells[tile.x][tile.y] = tile;
}

Grid.prototype.removeTile = function(tile) {
	this.cells[tile.x][tile.y] = null;
}

Grid.prototype.getTile = function(x, y) {
	return this.cells[x][y];
}

Grid.prototype.isCellEmpty = function(x, y) {
	if (this.cells[x][y] == null)
		return true;
	return false;
}

Grid.prototype.getEmptyCells = function() {
	var cells = [];
	
	for (var x=0; x<this.cols; x++) {
		for (var y=0; y<this.cols; y++) {
			var tile = this.cells[x][y];
			
			if (tile == null)
				cells.push({x:x, y:y});
		}
	}
	return cells;
}

Grid.prototype.isMergePossible = function() {

}

Grid.prototype.countTiles = function() {
	var count = 0;
	for (var x=0; x< this.cols; x++) {
		for (var y=0; y < this.cols; y++) {
			var tile = this.cells[x][y];
			if (tile != null)
				count++;
		}
	}
	return count;
}

Grid.prototype.print = function() {

	for (var x=0; x< this.cols; x++) {
		console.log(x, this.cells[0][x],this.cells[1][x],this.cells[2][x],this.cells[3][x]);
	}
	console.log("---------------------------------------------------");
}

Grid.prototype.getRandomEmptyCell = function() {
	var emptyCells = this.getEmptyCells();
	
	if (emptyCells.length > 0) {
		return emptyCells[Math.floor(Math.random() * emptyCells.length)];
	}
	
	return null;
}


Grid.prototype.isValidPosition = function(x, y) {
	return x >= 0 && x < this.cols && y >= 0 && y < this.cols;
}