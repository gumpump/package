import { Point } from "./point.js"

export class Line
{
	// Makes sure everyone has an unique id
	static idCounter = 1;

	// Context for drawing on the canvas
	static context = null;

	static lines = [];

	// Set context for all lines to use
	static setContext (ctx)
	{
		Line.context = ctx;
	}

	static addLine (l)
	{
		Line.lines.push (l);
	}

	static removeLine (l)
	{
		const i = Line.lines.indexOf (l);

		if (i != -1)
		{
			Line.lines.splice (i, 1);
			console.log ("Line removed");
		}
	}

	static update ()
	{
		const l = Line.lines.length;

		if (l == 0)
		{
			return;
		}

		for (var i = 0; i < l; i++)
		{
			Line.lines[i].update ();
		}
	}

	static draw ()
	{
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
	constructor (ctx, pointStart, pointEnd)
	{
		// Start point
		this.start = pointStart;

		// End point
		this.end = pointEnd;

		// Main context
		this.context = ctx;
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
			const idStart = this.start.getNewId ();
			Point.removePoint (this.start);
			this.start = null;

			if (idStart == -1)
			{
				Line.removeLine (this);

				return;
			}

			this.start = Point.getPointById (idStart);
		}

		if (this.end.isDeprecated () == true)
		{
			const idEnd = this.end.getNewId ();
			Point.removePoint (this.end);
			this.end = null;

			if (idEnd == -1)
			{
				Line.removeLine (this);

				return;
			}

			this.end = Point.getPointById (idEnd);
		}
	}

	// Draw the line
	draw ()
	{
		this.context.beginPath ();
		this.context.moveTo (this.start.getDrawnX (), this.start.getDrawnY ());
		this.context.lineTo (this.end.getDrawnX (), this.end.getDrawnY ());
		this.context.stroke ();
	}
}