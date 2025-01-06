import { Node } from "./node.js"

export class Face
{
	//////////////////////
	// STATIC VARIABLES //
	//////////////////////

	static context = null;

	static faces = [];
	static currentFaces = [];

	////////////////////////////////////
	// STATIC METHODS: INITIALIZATION //
	////////////////////////////////////

	static setContext (ctx)
	{
		Face.context = ctx;
	}

	////////////////////////////////////////////////
	// STATIC METHODS: MANIPULATION OF THE ARRAYS //
	////////////////////////////////////////////////

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
			var i = Face.currentFaces.indexOf (this);

			if (i != -1)
			{
				Face.currentFaces[i].unselect ();
				Face.currentFaces.splice (i, 1);
			}

			i = Face.faces.indexOf (f);

			if (i != -1)
			{
				Face.faces.splice (i, 1);
				console.log ("Face " + f.id + " removed");
			}
		}
	}

	static unselect ()
	{
		const l = Face.currentFaces.length;

		if (l > 0)
		{
			for (var i = 0; i < l; i++)
			{
				Face.currentFaces[i].unselect ();
			}
		}

		Face.currentFaces = [];
	}

	static update ()
	{
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

	///////////////////////////////
	// STATIC METHODS: GET NODES //
	///////////////////////////////

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

	static getSelected ()
	{
		return Face.currentFaces;
	}

	///////////////////////////////////////////
	// STATIC METHODS: GET INFOS ABOUT NODES //
	///////////////////////////////////////////

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

	static getNumFaces ()
	{
		return Face.faces.length;
	}

	// Is any face selected?
	static isSelected ()
	{
		return (Face.currentFaces.length > 0) ? true : false;
	}

	static getNumSelected ()
	{
		return Face.currentFaces.length;
	}

	/////////////////////////////
	// STATIC METHODS: DRAWING //
	/////////////////////////////

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
		this.fillColor = "lightgray";
		this.borderColor = "black";
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

		if (this.nodes.length == 2)
		{
			const d1 = Node.getDistance (x, y, this.nodes[0].getDrawnX (), this.nodes[0].getDrawnY ());
			const d2 = Node.getDistance (x, y, this.nodes[1].getDrawnX (), this.nodes[1].getDrawnY ());
			const length = Node.getDistance (this.nodes[0].getDrawnX (), this.nodes[0].getDrawnY (), this.nodes[1].getDrawnX (), this.nodes[1].getDrawnY ());
			const buf = 1;

			if (d1 + d2 >= length - buf && d1 + d2 <= length + buf)
			{
				console.log ("Intersection with line");
				r = true;
			}
		}

		else
		{
			for (var i = 0, j = this.nodes.length - 1; i < this.nodes.length; j = i++)
			{
				var xI = this.nodes[i].getX ();
				var yI = this.nodes[i].getY ();

				var xJ = this.nodes[j].getX ();
				var yJ = this.nodes[j].getY ();

				var intersect = ((yI > y) != (yJ > y)) && (x < (xJ - xI) * (y - yI) / (yJ - yI) + xI);

				if (intersect)
				{
					console.log ("Intersection with face");
					r = !r;
				}
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

	select (multi)
	{
		if (this.selected == false)
		{
			if (multi == false)
			{
				Face.unselect ();
			}

			Face.currentFaces.push (this);
			this.selected = true;
			this.fillColor = "gray";

			if (this.nodes.length == 2)
			{
				this.borderColor = "yellow";
			}

			console.log ("Face " + this.id + " selected");
		}

		else
		{
			const i = Face.currentFaces.indexOf (this);
			Face.currentFaces.splice (i, 1);
			this.unselect ();
		}
	}

	unselect ()
	{
		this.selected = false;
		this.fillColor = "lightgray";
		this.borderColor = "black";
	}

	isSelected ()
	{
		return this.selected;
	}

	update ()
	{
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

			Face.context.fillStyle = this.fillColor;
			Face.context.fill ();
			Face.context.strokeStyle = this.borderColor;
			Face.context.stroke ();

			Face.context.closePath ();
		}

		else
		{
			console.error ("Face has no nodes");
		}
	}
}