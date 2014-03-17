function Game() {
	var that = this;
	this.startWithTiles = 2;
	
	
	this.score = 0;
	this.gameEnded = false;

	this.left = 37;	
	this.up = 38;
	this.right = 39;
	this.down = 40;
	
	
	$(document).ready(function() {
		$(window).keydown(function(e) {
			var key = e.which;
			if (key===that.left || key==that.right || key==that.up || key==that.down) {
				that.processInput(key);
			}
		});
		
		var key = 0;
		$("#hitarea").swipe({
			swipeLeft: function(event, direction, distance, fingerCount) {
				key = that.left;
				that.processInput(key);
			},
			swipeRight: function(event, direction, distance, fingerCount) {
				key = that.right;
				that.processInput(key);
			},
			swipeUp: function(event, direction, distance, fingerCount) {
				key = that.up;
				that.processInput(key);
			},
			swipeDown: function(event, direction, distance, fingerCount) {
				key = that.down;
				that.processInput(key);
			},
			threshold: 0
		});
	});
}

Game.prototype.isGameEnded = function() {
	return this.gameEnded;
}

Game.prototype.getVector = function(key) {
	var self = this;
	
	if (key == self.left)
		return {x:-1, y:0};
	if (key == self.up)
		return {x:0, y:-1};
	if (key == self.right)
		return {x:1, y:0};
	if (key == self.down)
		return {x:0, y:1};
}

Game.prototype.processInput = function(key) {
	if (this.isGameEnded()) {
		return;
	}

	var self = this;
	var moved = false;
	
	var vector = self.getVector(key);
	console.log('vec', vector);
	
	var xcells = [];
	var ycells = [];
	
	for (var i=0; i<self.grid.cols; i++) {
		xcells[i] = i;
	}
	for (var i=0; i<self.grid.cols; i++) {
		ycells[i] = i;
	}
	
	if (key == self.right) {
		xcells = xcells.reverse();
	}
	
	if (key == self.down) {
		ycells = ycells.reverse();
	}
	
	xcells.forEach(function (x) {
		ycells.forEach(function (y) {
			var tile = self.grid.cells[x][y];
			if (tile!=null) {
				tile.prev = new Tile(tile.x, tile.y, tile.value); // pachhi ko lagi kaam lagcha
				
				self.grid.cells[tile.x][tile.y] = null;
				var tile2 = self.findEndPosition(tile, vector);
				
				
				// findEndPosition might change tile.merged
				if (tile.merged) {
					moved = true;
					self.score += tile.value;
					if (tile.value == 2048) {
						alert("YOU WIN!");
					}
				}
				
				
				if (tile.x!=tile2.x || tile.y!=tile2.y) {
					moved = true;
				}
				
				tile.x = tile2.x;
				tile.y = tile2.y;

				self.grid.cells[tile.x][tile.y] = tile;
				self.grid.cells[tile.x][tile.y].prev = tile.prev;
			}
		});
	});
	
	if (moved) {
		self.addRandomTile();
		self.renderer.render(xcells, ycells);
		
	}
		
		
	xcells.forEach(function (x) {
		ycells.forEach(function (y) {
			var tile = self.grid.cells[x][y];
			if (tile!=null) {
				tile.merged = false;
				tile.prev = null;
			}
		});
	});
}

Game.prototype.findEndPosition = function(tile, vector) {
	var temp = new Tile(tile.x, tile.y, tile.value);
	var prev = null;
	
	var count = 0;
	while (true) {
		count++;
		
		prev = temp;
		var newPos = {x: prev.x + vector.x, y: prev.y + vector.y};
		
		if (!this.grid.isValidPosition(newPos.x, newPos.y)) { // check out of bounds
			return temp;
		}
		
		var tileInNewPos = this.grid.cells[newPos.x][newPos.y];
		if (tileInNewPos != null) {
			if (temp.value == tileInNewPos.value) {
				
				//if the number has been merged already
				if (tileInNewPos.merged) {
					return temp;
				}
				// if not merged
				
				temp.x = newPos.x;
				temp.y = newPos.y;
				if (tile.value == tileInNewPos.value) {
					tile.merged = true;
					tile.value += tileInNewPos.value;
				}
				return temp;
			}
			
			// if values aren't same
			return temp;
		}
		else {
			temp.x += vector.x;
			temp.y += vector.y;
		}
	}
}

Game.prototype.isMovesAvailable = function() {
	var cells = this.grid.getEmptyCells();
	if (cells.length > 0) {
		return true;
	}
	
	if (this.grid.isMergePossible()) {
		return true;
	}
	return false;
}



Game.prototype.start = function() {
	this.grid = new Grid();
	this.renderer = new Renderer(this, this.grid);
	this.score = 0
	
	this.startTiling();
	this.renderer.initRender();
}


Game.prototype.addRandomTile = function() {
	var randomCell = this.grid.getRandomEmptyCell();
	if (randomCell != null) {
			var value = Math.random() < 0.9 ? 2 : 4;
			var tile = new Tile(randomCell.x, randomCell.y, value);
			
			this.grid.addTile(tile);
			this.renderer.addTile(tile);
	}
};

Game.prototype.startTiling = function() {
/*
	var tile1 = new Tile(1, 0, 2);
	var tile2 = new Tile(1, 1, 2);
	var tile3 = new Tile(1, 2, 4);
	var tile4 = new Tile(1, 3, 4);
	
	tile1.id=1; tile2.id=2; tile3.id=3; tile4.id=4;
	this.grid.addTile(tile1);
	this.grid.addTile(tile2);
	this.grid.addTile(tile3);
	this.grid.addTile(tile4);
	
	return;
	*/
	for (var i=0; i<this.startWithTiles; i++) {
		var randomCell = this.grid.getRandomEmptyCell();
		if (randomCell != null) {
			var value = Math.random() < 0.9 ? 2 : 4;
			var tile = new Tile(randomCell.x, randomCell.y, value);
			
			this.grid.addTile(tile);
		}
	}
}