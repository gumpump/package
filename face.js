import { Node } from "./node.js"

export class Face
{
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
			console.error ("Could not add face to list. Given object is null");

			return;
		}

		if (Face.exists (f.id) == true)
		{
			console.error ("Could not add face to list. ID already exists");

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

	static exists (id)
	{
		const l = Face.faces.length;

		for (var i = 0; i < l; i++)
		{
			if (Face.faces[i].id == id)
			{
				return true;
			}
		}

		return false;
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

	static getNumFaces ()
	{
		return Face.faces.length;
	}

	static update ()
	{
		console.log ("Faces updated");

		for (var i = 0; i < Face.faces.length; i++)
		{
			Face.faces[i].update ();

			if (Face.faces[i].isDeprecated () == true)
			{
				Face.removeFace (Face.faces[i]);
				i--;
			}
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

	constructor (nArray, add = true)
	{
		this.nodes = nArray;

		this.selected = false;
		this.color = "lightgray";
		this.deprecated = false;

		const l = this.nodes.length;

		var tId = "";

		for (var i = 0; i < l; i++)
		{
			tId += this.nodes[i].getId().toString ();
		}

		this.id = parseInt (tId);

		if (add == true && Face.exists (this.id) == false)
		{
			Face.addFace (this);
		}
	}

	setRelPos (x, y)
	{
		for (var i = 0; i < this.nodes.length; i++)
		{
			this.nodes[i].setRelPos (x, y);
		}
	}

	intersect (x, y)
	{
		var r = false;

		for (var i = 0, j = this.nodes.length - 1; i < this.nodes.length; j = i++)
		{
			var xI = this.nodes[i].getX ();
			var yI = this.nodes[i].getY ();

			var xJ = this.nodes[j].getX ();
			var yJ = this.nodes[j].getY ();

			var intersect = ((yI > y) != (yJ > y)) && (x < (xJ - xI) * (y - yI) / (yJ - yI) + xI);

			if (intersect)
			{
				r = !r;
			}
		}

		return r;
	}

	updateId ()
	{
		const l = this.nodes.length;

		if (l > 0)
		{
			console.log ("Old face ID: " + this.id);

			var tId = "";

			for (var i = 0; i < l; i++)
			{
				tId += this.nodes[i].getId().toString ();
			}

			this.id = parseInt (tId);

			console.log ("New face ID: " + this.id);
		}
	}

	getId ()
	{
		return this.id;
	}

	isDeprecated ()
	{
		return this.deprecated;
	}

	getNumNodes ()
	{
		return this.nodes.length;
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
		console.log ("Face " + this.id + " updated");
		for (var i = 0; i < this.nodes.length; i++)
		{
			if (this.nodes[i].isDeprecated () == true)
			{
				console.log ("Deprecated node in surface " + this.id + " at index " + i + " found");
				const newId = this.nodes[i].getNewId ();

				if (newId == -1)
				{
					console.error ("New id is invalid. Remove surface from list");

					this.deprecated = true;

					return;
				}

				const newNode = Node.getNodeById (newId);

				if (newNode == null)
				{
					console.error ("Could not find new node. Remove surface from list");

					this.deprecated = true;
				}

				this.nodes[i] = null;
				this.nodes[i] = newNode;
				this.updateId ();
			}

			if (this.nodes[i] == null)
			{
				console.error ("Node at index " + i + " is null. Remove surface from list");

				this.deprecated = true;

				return;
			}
		}
	}

	draw ()
	{
		const l = this.nodes.length;

		if (l > 0)
		{
			Face.context.beginPath ();

			Face.context.moveTo (this.nodes[l-1].getDrawnX (), this.nodes[l-1].getDrawnY ());

			for (var i = 0; i < l; i++)
			{
				Face.context.lineTo (this.nodes[i].getDrawnX (), this.nodes[i].getDrawnY ());
			}

			Face.context.fillStyle = this.color;
			Face.context.fill ();
			Face.context.stroke ();

			Face.context.closePath ();
		}

		else
		{
			console.error ("Face has no nodes");
		}
	}
}