import { Point } from "./point.js"

export class Line
{
	// Makes sure everyone has an unique id
	static idCounter = 1;

	// Context for drawing on the canvas
	static context = null;

	static lines = [];

	static pointIds = [];

	// Set context for all lines to use
	static setContext (ctx)
	{
		Line.context = ctx;
	}

	static addLine (l)
	{
		Line.lines.push (l);

		console.log ("Line added");

		const startId = l.start.getId ();

		if (Line.pointIds.includes (startId) == false)
		{
			Line.pointIds.push (startId);
		}

		const endId = l.end.getId ();

		if (Line.pointIds.includes (endId) == false)
		{
			Line.pointIds.push (endId);
		}

		else
		{
			console.log ("Potential area detected by ending point");
		}
	}

	static removeLine (l)
	{
		const i = Line.lines.indexOf (l);

		if (i != -1)
		{
			Line.lines.splice (i, 1);
		}

		console.log ("Line removed");
	}

	static update ()
	{
		const l = Line.lines.length;

		if (l == 0)
		{
			return;
		}

		for (var i = 0; i < Line.lines.length; i++)
		{
			const r = Line.lines[i].update ();

			if (r == -1)
			{
				i--;
			}
		}
	}

	static draw ()
	{
		if (Point.hasChanged () == true)
		{
			Line.update ();
			Point.setChange (false);
		}

		const l = Line.lines.length;

		if (l == 0)
		{
			return;
		}

		for (var i = 0; i < l; i++)
		{
			Line.lines[i].draw ();
		}
	}

	/////////////////////////////////////////
	// BEGINNING OF THE INSTANCEABLE CLASS //
	/////////////////////////////////////////

	// Constructor
	constructor (pointStart, pointEnd)
	{
		// Start point
		this.start = pointStart;

		// End point
		this.end = pointEnd;

		this.id = Line.idCounter;
		Line.idCounter++;
	}

	// Set start point (actual reference to a new or existing point)
	setStartPoint (p)
	{
		this.start = p;
	}

	// Set position of start point
	setStartPointPos (x, y)
	{
		this.start.setPos (x, y);
	}

	// Set end point (actual reference to a new or existing point)
	setEndPoint (p)
	{
		this.end = p;
	}

	// Set position of end point
	setEndPointPos (x, y)
	{
		this.end.setPos (x, y);
	}

	// Get the length of the line (distance between start point and end point)
	getLength ()
	{
		return Math.hypot (this.end.getX () - this.start.getX (), this.end.getY () - this.start.getY ());
	}

	// Check if one of the points has been deprecated and have to be removed
	update ()
	{
		if (this.start.isDeprecated () == true)
		{
			console.log ("Starting point " + this.start.getId () + " of line " + this.id + " is deprecated");
			const idStart = this.start.getNewId ();
			console.log ("New starting point of line " + this.id + " has the id: " + idStart);
			Point.removePoint (this.start);
			this.start = null;

			console.log ("Starting point of line " + this.id + " removed");

			if (idStart == -1)
			{
				Line.removeLine (this);

				return -1;
			}

			this.start = Point.getPointById (idStart);

			console.log ("New starting point " + idStart + " of line " + this.id + " set");
		}

		if (this.end.isDeprecated () == true)
		{
			console.log ("Ending point " + this.end.getId () + " of line " + this.id + " is deprecated");
			const idEnd = this.end.getNewId ();
			console.log ("New ending point of line " + this.id + " has the id: " + idEnd);
			Point.removePoint (this.end);
			this.end = null;

			console.log ("Ending point of line " + this.id + " removed");

			if (idEnd == -1)
			{
				Line.removeLine (this);

				return -1;
			}

			this.end = Point.getPointById (idEnd);

			console.log ("New ending point of line " + this.id + " set");
		}
	}

	// Draw the line
	draw ()
	{
		const startX = this.start.getDrawnX ();
		const startY = this.start.getDrawnY ();
		const endX = this.end.getDrawnX ();
		const endY = this.end.getDrawnY ();

		Line.context.beginPath ();
		Line.context.moveTo (startX, startY);
		Line.context.lineTo (endX, endY);
		Line.context.stroke ();

		Line.context.fillStyle = "black";
		Line.context.font = "24px sanserif";

		Line.context.fillText (this.id, startX + ((endX - startX) / 2) + 5, startY + ((endY - startY) / 2) + 5);
	}
}