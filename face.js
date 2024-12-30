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

		console.log ("Face " + f.id + " added");
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

	static getFaceByPos (x, y)
	{
		for (var i = 0; i < Face.faces.length; i++)
		{
			if (Face.faces[i].intersect (x, y) == true)
			{
				return Face.faces[i];
			}
		}

		return null;
	}

	static unselect ()
	{
		for (var i = 0; i < Face.faces.length; i++)
		{
			Face.faces[i].unselect ();
		}
	}

	static getSelected ()
	{
		for (var i = 0; i < Face.faces.length; i++)
		{
			if (Face.faces[i].isSelected () == true)
			{
				return Face.faces[i];
			}
		}

		return null;
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
		this.points = [];

		this.id = Face.idCounter++;

		const l = this.lines.length;

		if (l > 0)
		{
			for (var i = 0; i < l; i++)
			{
				this.lines[i].setFaceId (this.id);

				if (this.points.indexOf (this.lines[i].start) == -1)
				{
					this.points.push (this.lines[i].start);
				}

				if (this.points.indexOf (this.lines[i].end) == -1)
				{
					this.points.push (this.lines[i].end);
				}
			}
		}

		this.selected = false;
		this.color = "lightgray";

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

	setRelPos (x, y)
	{
		for (var i = 0; i < this.points.length; i++)
		{
			this.points[i].setRelPos (x, y);
		}
	}

	intersect (x, y)
	{
		var r = false;

		for (var i = 0, j = this.points.length - 1; i < this.points.length; j = i++)
		{
			var xI = this.points[i].getX ();
			var yI = this.points[i].getY ();

			var xJ = this.points[j].getX ();
			var yJ = this.points[j].getY ();

			var intersect = ((yI > y) != (yJ > y)) && (x < (xJ - xI) * (y - yI) / (yJ - yI) + xI);

			if (intersect)
			{
				r = !r;
			}
		}

		return r;
	}

	getId ()
	{
		return this.id;
	}

	select ()
	{
		console.log ("Face " + this.id + " selected");

		this.selected = true;
		this.color = "gray";
	}

	unselect ()
	{
		this.selected = false;
		this.color = "lightgray";
	}

	isSelected ()
	{
		return this.selected;
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

			Face.context.fillStyle = this.color;
			Face.context.fill ();
			Line.context.stroke ();
		}
	}
}