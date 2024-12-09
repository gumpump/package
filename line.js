import { Point } from "./point.js"

export class Line
{
	constructor (ctx, pointStart, pointEnd)
	{
		this.start = pointStart;
		this.end = pointEnd;
		this.context = ctx;
		this.previous = null;
		this.next = null;
	}

	setStart (x, y)
	{
		this.start.setPos (x, y);
	}

	setEnd (x, y)
	{
		this.end.setPos (x, y);
	}

	getLength ()
	{
		return Math.hypot (this.end.getX () - this.start.getX (), this.end.getY () - this.start.getY ());
	}

	draw ()
	{
		this.start.draw ();
		this.end.draw ();

		this.context.beginPath ();
		this.context.moveTo (this.start.getX (), this.start.getY ());
		this.context.lineTo (this.end.getX (), this.end.getY ());
		this.context.stroke ();
	}
}
