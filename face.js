// THIS FILE IS HIGHLY EXPERIMENTAL
import { Line } from "./line.js"

export class Face
{
	static idCounter = 1;

	static context = null;

	static faces = [];

	static setContext (ctx)
	{
		Face.context = ctx;
	}

	static addFace (f)
	{
		if (f == null)
		{
			return;
		}

		Face.faces.push (f);

		console.log ("Face added");
	}

	static removeFace (f)
	{
		if (Face.faces.length > 0)
		{
			const i = Face.faces.indexOf (f);

			if (i != -1)
			{
				Face.faces.splice (i, 1);
				console.log ("Face " + f.id + " removed");
			}
		}
	}

	static update ()
	{
		for (var i = 0; i > Face.faces.length; i++)
		{
			Face.faces[i].update ();
		}
	}

	static draw ()
	{
		const l = Face.faces.length;

		for (var i = 0; i < l; i++)
		{
			Face.faces[i].draw ();
		}
	}

	/////////////////////////////////////////
	// BEGINNING OF THE INSTANCEABLE CLASS //
	/////////////////////////////////////////

	constructor (lArray, add = true)
	{
		this.lines = lArray;

		this.id = Face.idCounter++;

		const l = this.lines.length;

		if (l > 0)
		{
			for (var i = 0; i < l; i++)
			{
				this.lines[i].setFaceId (this.id);
			}
		}

		if (add == true)
		{
			Face.addFace (this);
		}
	}

	addLine (l)
	{
		l.setFaceId (this.id);
		this.lines.push (l);
	}

	update ()
	{
		for (var i = 0; i < this.lines.length; i++)
		{
			if (this.lines[i] == null)
			{
				Face.removeFace (this);

				return;
			}
		}
	}

	draw ()
	{
		const l = this.lines.length;

		if (l > 0)
		{
			if (Line.lines[0] == null)
			{
				return;
			}

			Line.context.beginPath ();

			if (this.lines[0].isDeprecated () == true)
			{
				return;
			}

			Line.context.moveTo (this.lines[0].start.getDrawnX (), this.lines[0].start.getDrawnY ());

			for (var i = 0; i < l; i++)
			{
				Line.context.lineTo (this.lines[i].end.getDrawnX (), this.lines[i].end.getDrawnY ());
			}

			Face.context.fillStyle = "lightgray";
			Face.context.fill ();
			Line.context.stroke ();
		}
	}
}