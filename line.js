import { Node } from "./node.js"

export class Line
{
	// Makes sure everyone has an unique id
	static idCounter = 1;

	// Context for drawing on the canvas
	static context = null;

	static lines = [];

	static nodeIds = [];

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

		if (Line.nodeIds.includes (startId) == false)
		{
			Line.nodeIds.push (startId);
		}

		const endId = l.end.getId ();

		if (Line.nodeIds.includes (endId) == false)
		{
			Line.nodeIds.push (endId);
		}

		else
		{
			console.log ("Potential face detected");

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
		var nextL = Line.getLineByStartNode (p);

		if (nextL === null)
		{
			return null;
		}

		lArray.push (nextL);

		while (nextL.end != p)
		{
			var nextL = Line.getLineByStartNode (nextL.end);
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

	// If there is more than one line with this starting node,
	// shit will hit the fan
	// TODO: Create a solution for that, maybe return an array
	static getLineByStartNode (p)
	{
		const l = Line.lines.length;

		if (l == 0)
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

	// If there is more than one line with this ending node,
	// shit will hit the fan
	// TODO: Create a solution for that, maybe return an array
	static getLineByEndNode (p)
	{
		const l = Line.lines.length;

		if (l == 0)
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
	constructor (nodeStart, nodeEnd, add = true)
	{
		// Start node
		this.start = nodeStart;

		// End node
		this.end = nodeEnd;

		this.faceId = 0;

		this.id = Line.idCounter++;

		if (add == true)
		{
			Line.addLine (this);
		}
	}

	// Set start node (actual reference to a new or existing node)
	setStartNode (p)
	{
		this.start = p;
	}

	// Set position of start node
	setStartNodePos (x, y)
	{
		this.start.setPos (x, y);
	}

	// Set end node (actual reference to a new or existing node)
	setEndNode (p)
	{
		this.end = p;
	}

	// Set position of end node
	setEndNodePos (x, y)
	{
		this.end.setPos (x, y);
	}

	// Get the length of the line (distance between start node and end node)
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

	// Check if one of the nodes has been deprecated and have to be removed
	update ()
	{
		if (this.isDeprecated () == true)
		{
			return;
		}

		if (this.start.isDeprecated () == true)
		{
			console.log ("Starting node " + this.start.getId () + " of line " + this.id + " is deprecated");
			const idStart = this.start.getNewId ();
			console.log ("New starting node of line " + this.id + " has the id: " + idStart);
			this.start = null;

			console.log ("Starting node of line " + this.id + " removed");

			if (idStart == -1)
			{
				return;
			}

			this.start = Node.getNodeById (idStart);

			console.log ("New starting node " + idStart + " of line " + this.id + " set");
		}

		if (this.end.isDeprecated () == true)
		{
			console.log ("Ending node " + this.end.getId () + " of line " + this.id + " is deprecated");
			const idEnd = this.end.getNewId ();
			console.log ("New ending node of line " + this.id + " has the id: " + idEnd);
			this.end = null;

			console.log ("Ending node of line " + this.id + " removed");

			if (idEnd == -1)
			{
				return;
			}

			this.end = Node.getNodeById (idEnd);

			console.log ("New ending node of line " + this.id + " set");
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