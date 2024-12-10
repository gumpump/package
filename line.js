import { Point } from "./point.js"

export class Line
{
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
			const id = this.start.getNewId ();
			Point.removePoint (this.start);
			this.start = Point.getPointById (id);
		}

		if (this.end.isDeprecated () == true)
		{
			const id = this.end.getNewId ();
			Point.removePoint (this.end);
			this.end = Point.getPointById (id);
		}
	}

	// Draw the line
	draw ()
	{
		this.start.draw ();
		this.end.draw ();

		this.context.beginPath ();
		this.context.moveTo (this.start.getDrawnX (), this.start.getDrawnY ());
		this.context.lineTo (this.end.getDrawnX (), this.end.getDrawnY ());
		this.context.stroke ();
	}
}