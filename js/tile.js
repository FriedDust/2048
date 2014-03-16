function Tile(x, y, value) {
	this.x = x;
	this.y = y;
	this.value = value;
	
	this.prev = null;
	this.merged = false;
}

Tile.prototype.changePosition = function(x, y) {
	this.x = x;
	this.y = y;
}