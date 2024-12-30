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

	// If a face is detected, this function returns a list of lines representing said face
	static addLine (l)
	{
		Line.lines.push (l);

		console.log ("Line " + l.id + " added");

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
			console.log ("Potential face detected by ending point");

			return Line.buildingFace (l.end);
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

	static removeDeprecated ()
	{
		for (var i = 0; i < Line.lines.length; i++)
		{
			if (Line.lines[i].isDeprecated () == true)
			{
				Line.removeLine (Line.lines[i]);
				i--;
			}
		}
	}

	static buildingFace (p)
	{
		var lArray = [];
		var nextL = Line.getLineByStartPoint (p);

		if (nextL === null)
		{
			return null;
		}

		lArray.push (nextL);

		while (nextL.end != p)
		{
			var nextL = Line.getLineByStartPoint (nextL.end);
			lArray.push (nextL);
		}

		if (lArray.length > 0)
		{
			return lArray;
		}

		else
		{
			console.log ("Could not collect lines for face");

			return null;
		}
	}

	static getLineByStartPoint (p)
	{
		const l = Line.lines.length;

		if (l == -1)
		{
			return;
		}

		for (var i = 0; i < l; i++)
		{
			if (Line.lines[i].start == p)
			{
				return Line.lines[i];
			}
		}

		return null;
	}

	static getLineByEndPoint (p)
	{
		const l = Line.lines.length;

		if (l == -1)
		{
			return;
		}

		for (var i = 0; i < l; i++)
		{
			if (Line.lines[i].end == p)
			{
				return Line.lines[i];
			}
		}

		return null;
	}

	static update ()
	{
		Line.removeDeprecated ();
		for (var i = 0; i < Line.lines.length; i++)
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
	constructor (pointStart, pointEnd, add = true)
	{
		// Start point
		this.start = pointStart;

		// End point
		this.end = pointEnd;

		this.faceId = 0;

		this.id = Line.idCounter++;

		if (add == true)
		{
			Line.addLine (this);
		}
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

	setFaceId (id)
	{
		this.faceId = id;
	}

	getFaceId ()
	{
		return this.faceId;
	}

	isDeprecated ()
	{
		if (this.start == null || this.end == null)
		{
			return true;
		}

		return false;
	}

	// Check if one of the points has been deprecated and have to be removed
	update ()
	{
		if (this.isDeprecated () == true)
		{
			return;
		}

		if (this.start.isDeprecated () == true)
		{
			console.log ("Starting point " + this.start.getId () + " of line " + this.id + " is deprecated");
			const idStart = this.start.getNewId ();
			console.log ("New starting point of line " + this.id + " has the id: " + idStart);
			this.start = null;

			console.log ("Starting point of line " + this.id + " removed");

			if (idStart == -1)
			{
				return;
			}

			this.start = Point.getPointById (idStart);

			console.log ("New starting point " + idStart + " of line " + this.id + " set");
		}

		if (this.end.isDeprecated () == true)
		{
			console.log ("Ending point " + this.end.getId () + " of line " + this.id + " is deprecated");
			const idEnd = this.end.getNewId ();
			console.log ("New ending point of line " + this.id + " has the id: " + idEnd);
			this.end = null;

			console.log ("Ending point of line " + this.id + " removed");

			if (idEnd == -1)
			{
				return;
			}

			this.end = Point.getPointById (idEnd);

			console.log ("New ending point of line " + this.id + " set");
		}
	}

	// Draw the line
	draw ()
	{
		if (this.isDeprecated () == true)
		{
			return;
		}

		if (this.faceId != 0)
		{
			return;
		}

		const startX = this.start.getDrawnX ();
		const startY = this.start.getDrawnY ();
		const endX = this.end.getDrawnX ();
		const endY = this.end.getDrawnY ();

		Line.context.beginPath ();
		Line.context.moveTo (startX, startY);
		Line.context.lineTo (endX, endY);
		Line.context.stroke ();

		// Only if shit hits the fan
		//Line.context.fillStyle = "black";
		//Line.context.font = "24px sanserif";

		//Line.context.fillText (this.id, startX + ((endX - startX) / 2) + 5, startY + ((endY - startY) / 2) + 5);
	}
}