import { Grid } from "./grid.js"

export class Point
{
	// Makes sure everyone has an unique id
	static idCounter = 1;

	// Number of currently existing points
	static numPoints = 0;

	// Context for drawing on the canvas
	static context = null;

	// Dimensions of the canvas
	static contextWidth = 0;
	static contextHeight = 0;

	// 3D-Array of all existing points
	// [X-Axis][Y-Axis][Points]
	static points = [];

	// Currently selected point
	// There can be only one
	static currentPoint = 0;

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
		if (Point.points.length == 0)
		{
			Point.points = new Array (8);

			for (var x = 0; x < 8; x++)
			{
				Point.points[x] = new Array (8);

				for (var y = 0; y < 8; y++)
				{
					Point.points[x][y] = [];
				}
			}
		}

		var targetX = Point.getPointIndex (p.getX (), Point.contextWidth);
		var targetY = Point.getPointIndex (p.getY (), Point.contextHeight);

		Point.points[targetX][targetY].push (p);
		Point.numPoints++;

		console.log ("Point added");
		console.log ("There are " + Point.numPoints + " points");
	}

	// Remove a point out of the array
	static removePoint (p)
	{
		for (var x = 0; x < 8; x++)
		{
			for (var y = 0; y < 8; y++)
			{
				const i = Point.points[x][y].indexOf (p);

				if (i != -1)
				{
					Point.points[x][y].splice (i, 1);
					Point.numPoints--;

					console.log ("Point removed");

					return;
				}
			}
		}
	}

	// Get the number of currently existing points
	static getNumPoints ()
	{
		return Point.numPoints;
	}

	// Get the nearest point (if there is one in reach)
	static getPointByPos (x, y, r)
	{
		var targetX = Point.getPointIndex (x, Point.contextWidth);
		var targetY = Point.getPointIndex (y, Point.contextHeight);

		const p = Point.getNearestPoint (x, y, targetX, targetY);

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

		return Point.points[targetX][targetY][0];
	}

	static getNearestPoint (x, y, iX, iY)
	{
		const l = Point.points[iX][iY].length;
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
				p = Point.points[iX][iY][i];
				console.log ("Distance: " + p.getDistance (x, y));
				continue;
			}

			console.log ("Old distance: " + p.getDistance (x, y));
			console.log ("New distance: " + Point.points[iX][iY][i].getDistance (x, y));

			if (p.getDistance (x, y) > Point.points[iX][iY][i].getDistance (x, y))
			{
				console.log ("New distance won");
				p = Point.points[iX][iY][i];
				continue;
			}
		}

		console.log ("Returned point has the following distance: " + p.getDistance (x, y));

		return p;
	}

	// Get point by its ID
	static getPointById (id)
	{
		for (var x = 0; x < 8; x++)
		{
			for (var y = 0; y < 8; y++)
			{
				for (var i = 0; i < Point.points[x][y].length; i++)
				{
					if (Point.points[x][y][i].id == id)
					{
						return Point.points[x][y][i];
					}
				}
			}
		}

		return null;
	}

	// Is any point selected?
	static isSelected ()
	{
		return (Point.currentPoint == 0) ? false : true;
	}

	// Get the currently selected point (if there is one)
	static getSelected ()
	{
		if (Point.currentPoint != 0)
		{
			for (var x = 0; x < 8; x++)
			{
				for (var y = 0; y < 8; y++)
				{
					const r = Point.points[x][y].find ((p) => { return p.id == Point.currentPoint; });

					if (r !== undefined)
					{
						return r;
					}
				}
			}
		}

		return null;
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
	// TODO: Optimize this mess
	static unselect ()
	{
		for (var x = 0; x < 8; x++)
		{
			for (var y = 0; y < 8; y++)
			{
				const r = Point.points[x][y].find ((p) => { return p.id == Point.currentPoint; });

				if (r !== undefined)
				{
					r.unselect ();
					Point.currentPoint = 0;

					return;
				}
			}
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
			if (this.id != Point.currentPoint)
			{
				Point.unselect ();
				Point.currentPoint = this.id;
			}

			this.selected = true;
		}
	}

	// Unselect this point
	unselect ()
	{
		this.selected = false;
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
	}

	// Set new position relative to old position
	setRelPos (x, y)
	{
		this.x += x;
		this.y += y;
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

		const i = Point.points[this.arrayX][this.arrayY].indexOf (this);

		if (i == -1)
		{
			return;
		}

		Point.points[this.arrayX][this.arrayY].splice (i, 1);

		this.arrayX = Point.getPointIndex (this.x, Point.contextWidth);
		this.arrayY = Point.getPointIndex (this.y, Point.contextHeight);

		Point.points[this.arrayX][this.arrayY].push (this);

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
		Point.context.fillText (this.drawX + ", " + this.drawY, this.drawX + 20, this.drawY + 5);
/*
		Point.context.fillText (((this.drawX / Grid.getSpanX ()) * Grid.getSize ()).toString () + ", "
								+ ((this.drawY / Grid.getSpanY ()) * Grid.getSize ()).toString (),
								this.drawX + 20, this.drawY + 5);
*/
	}
}