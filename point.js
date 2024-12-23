import { Grid } from "./grid.js"

export class Point
{
	// Makes sure everyone has an unique id
	static idCounter = 1;

	// Context for drawing on the canvas
	static context = null;

	// Dimensions of the canvas
	static contextWidth = 0;
	static contextHeight = 0;

	// All points sorted by id
	static points = [];

	// 3D-Array of all existing points
	// [X-Axis][Y-Axis][Points]
	static coordinateSystem = [];

	// Currently selected point
	// There can be only one
	static currentPoint = null;

	// Show all points
	// Only showing, not selecting
	static show = false;

	// Set context for all points to use
	static setContext (ctx, w, h)
	{
		Point.context = ctx;
		Point.contextWidth = w;
		Point.contextHeight = h;
	}

	static createCoordinateSystem ()
	{
		Point.coordinateSystem = new Array (8);

		for (var x = 0; x < 8; x++)
		{
			Point.coordinateSystem[x] = new Array (8);

			for (var y = 0; y < 8; y++)
			{
				Point.coordinateSystem[x][y] = [];
			}
		}
	}

	// Helper for getting the index values for the points array
	static getPointIndex (v, l)
	{
		const length = l / 8;

		for (var i = 0; i < 8; i++)
		{
			if (v < (length + (length * i)))
			{
				return i;
			}
		}

		return -1;
	}

	// Add a point to the array
	static addPoint (p)
	{
		Point.points.push (p);

		if (Point.coordinateSystem.length == 0)
		{
			Point.createCoordinateSystem ();
		}

		var targetX = Point.getPointIndex (p.getX (), Point.contextWidth);
		var targetY = Point.getPointIndex (p.getY (), Point.contextHeight);

		Point.coordinateSystem[targetX][targetY].push (p);

		console.log ("Point added");
		console.log ("There are " + Point.points.length + " points");
	}

	// Remove a point out of the array
	static removePoint (p)
	{
		const i = Point.points.indexOf (p);
		Point.points.splice (i, 1);

		const targetX = p.getCoordX ();
		const targetY = p.getCoordY ();
		const j = Point.coordinateSystem[targetX][targetY].indexOf (p);

		if (j != -1)
		{
			Point.coordinateSystem[targetX][targetY].splice (j, 1);

			if (i != -1)
			{
				console.log ("Point removed");
			}

			return;
		}
	}

	// Get the number of currently existing points
	static getNumPoints ()
	{
		return Point.points.length;
	}

	// Get the nearest point (if there is one in reach)
	static getPointByPos (x, y, r)
	{
		var targetX = Point.getPointIndex (x, Point.contextWidth);
		var targetY = Point.getPointIndex (y, Point.contextHeight);

		const l = Point.coordinateSystem[targetX][targetY].length;

		console.log (l);

		if (l == 0)
		{
			return null;
		}

		var p = null;

		for (var i = 0; i < l; i++)
		{
			console.log ("Point " + i);

			if (p == null)
			{
				p = Point.coordinateSystem[targetX][targetY][i];
				console.log ("Distance: " + p.getDistance (x, y));
				continue;
			}

			console.log ("Old distance: " + p.getDistance (x, y));
			console.log ("New distance: " + Point.coordinateSystem[targetX][targetY][i].getDistance (x, y));

			if (p.getDistance (x, y) > Point.coordinateSystem[targetX][targetY][i].getDistance (x, y))
			{
				console.log ("New distance won");
				p = Point.coordinateSystem[targetX][targetY][i];
				continue;
			}
		}

		console.log ("Returned point has the following distance: " + p.getDistance (x, y));

		if (p == null)
		{
			console.log ("Could not get point");

			return null;
		}

		if (p.getDistance (x, y) > r)
		{
			console.log ("Measured distance: " + p.getDistance (x, y));
			console.log ("Given radius: " + r);

			return null;
		}

		return p;
	}

	// Get point by its ID
	static getPointById (id)
	{
		const p = Point.points.find ((e) => e.id == id);

		return (p === undefined) ? null : p;
	}

	// Is any point selected?
	static isSelected ()
	{
		return (Point.currentPoint == null) ? false : true;
	}

	// Get the currently selected point (if there is one)
	static getSelected ()
	{
		return Point.currentPoint;
	}

	// Draw all points
	static showAll ()
	{
		Point.show = true;
	}

	// Draw the selected point only
	static hideAll ()
	{
		Point.show = false;
	}

	// Unselect the current point
	static unselect ()
	{
		if (Point.currentPoint != null)
		{
			Point.currentPoint.unselect ();
			Point.currentPoint = null;
		}
	}

	/////////////////////////////////////////
	// BEGINNING OF THE INSTANCEABLE CLASS //
	/////////////////////////////////////////

	// Constructor of a single point
	constructor (x, y)
	{
		// Currently accepted coordinates
		this.x = x;
		this.y = y;

		// Current coordinates on the screen (while moving)
		this.drawX = x;
		this.drawY = y;

		this.realX = (this.drawX / Grid.getSpanX ()) * Grid.getSize ();
		this.realY = (this.drawY / Grid.getSpanY ()) * Grid.getSize ();

		// Own indices for the 3D-point-array
		// Only for the first two dimensions, the third one is determined by its distance to the mouse
		this.arrayX = Point.getPointIndex (x, Point.contextWidth);
		this.arrayY = Point.getPointIndex (y, Point.contextHeight);

		// Last measured distance to given coordinates
		this.distance = -1;

		// Is the point selected?
		this.selected = false;

		// Color to use when the point is drawn
		this.color = "yellow";

		// Own unique id (should be unique)
		this.id = Point.idCounter;

		// If deprecated, replace with the point owning this id
		this.newId = this.id;

		Point.idCounter++;
		Point.addPoint (this);
	}

	// Select this point
	select ()
	{
		if (this.selected == false)
		{
			if (Point.currentPoint != null)
			{
				Point.currentPoint.unselect ();
			}

			Point.currentPoint = this;
			this.selected = true;
		}
	}

	// Unselect this point
	unselect ()
	{
		this.selected = false;
		Point.currentPoint == null;
	}

	// Move this point
	// (Actually it just changes the color to visualize the movement)
	move ()
	{
		this.color = "blue";
	}

	// Set new position
	setPos (x, y)
	{
		this.x = x;
		this.y = y;

		this.realX = (this.drawX / Grid.getSpanX ()) * Grid.getSize ();
		this.realY = (this.drawY / Grid.getSpanY ()) * Grid.getSize ();
	}

	// Set new position relative to old position
	setRelPos (x, y)
	{
		this.x += x;
		this.y += y;

		this.realX = (this.drawX / Grid.getSpanX ()) * Grid.getSize ();
		this.realY = (this.drawY / Grid.getSpanY ()) * Grid.getSize ();
		console.log ("Mööp");
	}

	// Accept the current coordinates used for drawing as official ones
	setSnappedPos ()
	{
		this.x = this.drawX;
		this.y = this.drawY;

		const p = Point.getPointByPos (this.x, this.y, 0);

		if (p == null)
		{
			return;
		}

		if (p.getId () == this.id)
		{
			return;
		}

		if (p.getX () == this.x && p.getY () == this.y)
		{
			p.setNewId (this.id);
		}
	}

	// Update the point's position in the points array
	update ()
	{
		this.setSnappedPos ();

		const i = Point.coordinateSystem[this.arrayX][this.arrayY].indexOf (this);

		if (i == -1)
		{
			return;
		}

		Point.coordinateSystem[this.arrayX][this.arrayY].splice (i, 1);

		this.arrayX = Point.getPointIndex (this.x, Point.contextWidth);
		this.arrayY = Point.getPointIndex (this.y, Point.contextHeight);

		Point.coordinateSystem[this.arrayX][this.arrayY].push (this);

		this.color = "yellow";
	}

	// Get the currently accepted position on the x-axis
	getX ()
	{
		return this.x;
	}

	// Get the current position on the x-axis used for drawing
	getDrawnX ()
	{
		return this.drawX;
	}

	getCoordX ()
	{
		return this.arrayX;
	}

	// Get the currently accepted position on the y-axis
	getY ()
	{
		return this.y;
	}

	// Get the current position on the y-axis used for drawing
	getDrawnY ()
	{
		return this.drawY;
	}

	getCoordY ()
	{
		return this.arrayY;
	}

	// Get the distance between the given coordinates and the point
	getDistance (x, y)
	{
		this.distance = Math.hypot (x - this.x, y - this.y);

		return this.distance;
	}

	// Get the last calculated distance
	getLastDistance ()
	{
		return this.distance;
	}

	// Get the id of the point
	getId ()
	{
		return this.id;
	}

	// Set the new id
	// As soon as newId is set to something different than the own id, the point is seen as deprecated
	setNewId (id)
	{
		this.newId = id;
	}

	// Get the new id
	// If the new id does not match the id given to the point, the point is seen as deprecated
	getNewId ()
	{
		return this.newId;
	}

	// Is the point deprecated or not?
	isDeprecated ()
	{
		return (this.id != this.newId) ? true : false;
	}

	// Draw the point (if selected)
	draw ()
	{
		const spanX = Grid.getSpanX ();
		const spanY = Grid.getSpanY ();

		var restX = this.x % spanX;
		var restY = this.y % spanY;

		if (restX < spanX * 0.2)
		{
			this.drawX = this.x - restX;
		}

		else if (restX > spanX * 0.8)
		{
			this.drawX = this.x + (spanX - restX);
		}

		else
		{
			this.drawX = this.x;
		}

		if (restY < spanY * 0.2)
		{
			this.drawY = this.y - restY;
		}

		else if (restY > spanY * 0.8)
		{
			this.drawY = this.y + (spanY - restY);
		}

		else
		{
			this.drawY = this.y;
		}

		if (this.selected == false && Point.show == false)
		{
			return;
		}

		Point.context.beginPath ();
		Point.context.arc (this.drawX, this.drawY, 10, 0, 2 * Math.PI);
		Point.context.fillStyle = this.color;
		Point.context.fill ();
		Point.context.stroke ();

		Point.context.fillStyle = "black";
		Point.context.font = "24px sanserif";

		Point.context.fillText (this.realX + ", " + this.realY, this.drawX + 20, this.drawY + 5);
	}
}