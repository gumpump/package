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

	// Set position of start point
	setStart (x, y)
	{
		this.start.setPos (x, y);
	}

	// Set position of end point
	setEnd (x, y)
	{
		this.end.setPos (x, y);
	}

	// Get the length of the line (distance between start point and end point)
	getLength ()
	{
		return Math.hypot (this.end.getX () - this.start.getX (), this.end.getY () - this.start.getY ());
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
