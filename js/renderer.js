function Renderer(game, grid) {
	this.game = game;
	this.grid = grid;
		
	this.tile = $(".tile-container");
	this.score = $(".score-container");
}

Renderer.prototype.debug = function() {
	$("#debug").html("");
	var boxes = $("<div>");
	
	this.grid.print();
	for (var y=0; y< this.grid.cols; y++) {
		for (var x=0; x < this.grid.cols; x++) {
			var tile = this.grid.cells[x][y];
				
			if (tile != null) {
				var box = $("<div>").addClass("sanobox").html(tile.value);
				boxes.append(box);
			} else {
				boxes.append( $("<div>").addClass("sanobox").html(""));
			}
		}
		boxes.append("<br clear='all'>");
	}
	$("#debug").append(boxes);
	$(".score-container").html(this.game.score);
}

Renderer.prototype.initRender = function() {
	var that = this;
	
	window.requestAnimationFrame(function() {
		that.clear(that.tile);
		
		for (var x=0; x< that.grid.cols; x++) {
			for (var y=0; y < that.grid.cols; y++) {
				var tile = that.grid.cells[x][y];
				
				if (tile != null)
					that.addTile(tile);
			}
		}
	});
	
	this.debug();
}

Renderer.prototype.render = function(xcells, ycells) {
	var self = this;
	
//	window.requestAnimationFrame(function() {

		xcells.forEach(function (x) {
			ycells.forEach(function (y) {

				var tile = self.grid.cells[x][y];
				
				if (tile==null) {
					var removeClass = self.positionClass(new Tile(x,y,0));
					var removeDiv = $("." + removeClass);
					removeDiv.remove();
				}
			
				if (tile != null && !tile.merged) {
					
					var tileDivClass = self.positionClass(tile.prev);
					var tileDiv = $("."+tileDivClass);
					
					var newTileDivClass = self.positionClass(tile);
					tileDiv.removeClass(tileDivClass);
					tileDiv.addClass(newTileDivClass);
					
				} else if (tile !=null) {

					var toMoveClass = self.positionClass(tile.prev);
					var toRemoveClass = self.positionClass(tile);
					
					var toMoveDiv = $("." + toMoveClass);
					var toRemoveDiv = $("." + toRemoveClass);
					
					toRemoveDiv.remove();
					toMoveDiv.removeClass(toMoveClass);
					toMoveDiv.addClass(toRemoveClass);
									
					$(".tile-inner", toMoveDiv).html(tile.value);

				}
			});
		});
	//});
	
	window.requestAnimationFrame(function() {

	});
		self.debug();	
}

Renderer.prototype.clear = function(element) {
	element.html('');
}

Renderer.prototype.addTile = function(tile) {

	var tileDiv = $("<div>").addClass("tile");

	tileDiv.addClass(this.positionClass(tile));
	
	var tileInner = $("<div>").addClass("tile-inner");
	//tileInner.html(Number(tile.x+0) + "-" + Number(tile.y+0) + " / " + tile.value);
	tileInner.html(tile.value);
	
	tileDiv.append(tileInner);
	this.tile.append(tileDiv);
}

Renderer.prototype.positionClass = function(tile) {
	var x = tile.x + 1;
	var y = tile.y + 1;
	
	return "tile-position-" + x + "-" + y;
}