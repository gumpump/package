export class Point
{
	// Makes sure everyone has an unique id
	static idCounter = 1;

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
			for (var i = 0; i < 8; i++)
			{
				Point.points[i] = new Array (8);

				for (var j = 0; j < 8; j++)
				{
					Point.points[i][j] = [];
				}
			}
		}

		var targetX = Point.getPointIndex (p.getX (), Point.contextWidth);
		var targetY = Point.getPointIndex (p.getY (), Point.contextHeight);

		Point.points[targetX][targetY].push (p);
	}

	// Get the nearest point (if there is one in reach)
	static getPoint (x, y, r)
	{
		var targetX = Point.getPointIndex (x, Point.contextWidth);
		var targetY = Point.getPointIndex (y, Point.contextHeight);

		Point.points[targetX][targetY].sort ((a, b) => { a.getDistance (x, y) - b.getDistance (x, y); });

		const p = Point.points[targetX][targetY][0];

		if (p == undefined)
		{
			return null;
		}

		if (p.getDistance (x, y) > r)
		{
			return null;
		}

		return Point.points[targetX][targetY][0];
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

	// Constructor of a single point
	constructor (x, y)
	{
		this.x = x;
		this.y = y;
		this.arrayX = Point.getPointIndex (x, Point.contextWidth);
		this.arrayY = Point.getPointIndex (y, Point.contextHeight);
		this.distance = -1;
		this.selected = false;
		this.color = "yellow";
		this.id = Point.idCounter;
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

	// Update the point's position in the points array
	update ()
	{
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

	// Get the current position on the x-axis
	getX ()
	{
		return this.x;
	}

	// Get the current position on the y-axis
	getY ()
	{
		return this.y;
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

	// Draw the point (if selected)
	draw ()
	{
		if (this.selected == false && Point.show == false)
		{
			return;
		}

		Point.context.beginPath ();
		Point.context.arc (this.x, this.y,
						  10, 0, 2 * Math.PI);
		Point.context.fillStyle = this.color;
		Point.context.fill ();
		Point.context.stroke ();
	}
}
