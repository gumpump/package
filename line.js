import { Point } from "./point.js"

export class Line
{
	// Constructor
	constructor (ctx, pointStart, pointEnd)
	{
		this.start = pointStart;
		this.end = pointEnd;
		this.context = ctx;
		this.previous = null;
		this.next = null;
	}

	setStartPoint (p)
	{
		this.start = p;
	}

	// Set position of start point
	setStartPointPos (x, y)
	{
		this.start.setPos (x, y);
	}

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
