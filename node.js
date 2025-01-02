import { Grid } from "./grid.js"

export class Node
{
	//////////////////////
	// STATIC VARIABLES //
	//////////////////////

	// Makes sure everyone has an unique id
	static idCounter = 1;

	// Context for drawing on the canvas
	static context = null;

	// Dimensions of the canvas
	static contextWidth = 0;
	static contextHeight = 0;

	// All nodes sorted by id
	static nodes = [];

	// 3D-Array of all existing nodes
	// [X-Axis][Y-Axis][Nodes]
	static coordinateSystem = [];

	// Currently selected nodes
	static currentNodes = [];

	// Show all nodes
	// Only showing, not selecting
	static show = false;

	////////////////////////////////////
	// STATIC METHODS: INITIALIZATION //
	////////////////////////////////////

	// Set context for all nodes to use
	static setContext (ctx, w, h)
	{
		Node.context = ctx;
		Node.contextWidth = w;
		Node.contextHeight = h;
	}

	// Allocate the "coordinate system"
	// TODO: Rename this
	static createCoordinateSystem ()
	{
		Node.coordinateSystem = new Array (8);

		for (var x = 0; x < 8; x++)
		{
			Node.coordinateSystem[x] = new Array (8);

			for (var y = 0; y < 8; y++)
			{
				Node.coordinateSystem[x][y] = [];
			}
		}

		console.log ("Coordinate system array created");
	}

	////////////////////////////////////////////////
	// STATIC METHODS: MANIPULATION OF THE ARRAYS //
	////////////////////////////////////////////////

	// Add a node to the arrays
	static addNode (p)
	{
		Node.nodes.push (p);

		if (Node.coordinateSystem.length == 0)
		{
			Node.createCoordinateSystem ();
		}

		var targetX = Node.getNodeIndex (p.getX (), Node.contextWidth);
		var targetY = Node.getNodeIndex (p.getY (), Node.contextHeight);

		Node.coordinateSystem[targetX][targetY].push (p);

		console.log ("Node " + p.id + " added");
	}

	// Remove a node out of the arrays
	static removeNode (p)
	{
		if (Node.nodes.length > 0)
		{
			const i = Node.nodes.indexOf (p);

			if (i != -1)
			{
				Node.nodes.splice (i, 1);
				console.log ("Node " + p.id + " removed in .nodes");
			}
		}

		if (Node.coordinateSystem.length > 0)
		{
			const targetX = p.getCoordX ();
			const targetY = p.getCoordY ();
			const j = Node.coordinateSystem[targetX][targetY].indexOf (p);

			if (j != -1)
			{
				Node.coordinateSystem[targetX][targetY].splice (j, 1);
				console.log ("Node " + p.id + " removed in .coordinateSystem");
			}
		}
	}

	// Remove nodes signed as deprecated
	static removeDeprecated ()
	{
		for (var i = 0; i < Node.nodes.length; i++)
		{
			if (Node.nodes[i].isDeprecated () == true)
			{
				Node.removeNode (Node.nodes[i]);
				i--;
			}
		}
	}

	// Remove all nodes from the arrays
	static clear ()
	{
		const l = Node.nodes.length;

		if (l == 0)
		{
			return 0;
		}

		for (var i = 0; i < l; i++)
		{
			Node.nodes[i].setNewId (-1);
		}
	}

	// Unselect the current node
	static unselect ()
	{
		const l = Node.currentNodes.length;

		if (l > 0)
		{
			for (var i = 0; i < l; i++)
			{
				Node.currentNodes[i].unselect ();
			}
		}

		Node.currentNodes = [];
	}

	// Draw all nodes
	static showAll ()
	{
		Node.show = true;
	}

	// Draw the selected node only
	static hideAll ()
	{
		Node.show = false;
	}

	// Update all existing nodes
	static update ()
	{
		Node.removeDeprecated ();

		for (var i = 0; i < Node.nodes.length; i++)
		{
			Node.nodes[i].update ();
		}
	}

	///////////////////////////////
	// STATIC METHODS: GET NODES //
	///////////////////////////////

	// Get the nearest node (if there is one in reach)
	static getNodeByPos (x, y, r)
	{
		var targetX = Node.getNodeIndex (x, Node.contextWidth);
		var targetY = Node.getNodeIndex (y, Node.contextHeight);

		if (Node.coordinateSystem.length == 0)
		{
			return null;
		}

		const l = Node.coordinateSystem[targetX][targetY].length;

		if (l == 0)
		{
			return null;
		}

		var p = null;

		for (var i = 0; i < l; i++)
		{
			if (p == null)
			{
				p = Node.coordinateSystem[targetX][targetY][i];
				continue;
			}

			if (p.getDistance (x, y) > Node.coordinateSystem[targetX][targetY][i].getDistance (x, y))
			{
				p = Node.coordinateSystem[targetX][targetY][i];
				continue;
			}
		}

		if (p == null)
		{
			return null;
		}

		if (p.getDistance (x, y) > r)
		{
			return null;
		}

		console.log ("Nearest node found: " + p.id);

		return p;
	}

	// Get a node by its ID
	static getNodeById (id)
	{
		const p = Node.nodes.find ((e) => e.id == id);

		if (p === undefined)
		{
			console.log ("Could not find node with id: " + id);

			return null;
		}

		return p;
	}

	// Get the currently selected node (if there is one)
	static getSelected ()
	{
		return Node.currentNodes;
	}

	///////////////////////////////////////////
	// STATIC METHODS: GET INFOS ABOUT NODES //
	///////////////////////////////////////////

	// Helper for getting the index values for the nodes array
	static getNodeIndex (v, l)
	{
		const length = l / 8;

		for (var i = 0; i < 8; i++)
		{
			if (v < (length + (length * i)))
			{
				return i;
			}
		}

		return -1;
	}

	// Get the number of currently existing nodes
	static getNumNodes ()
	{
		return Node.nodes.length;
	}

	// Is any node selected?
	static isSelected ()
	{
		return (Node.currentNodes.length > 0) ? true : false;
	}

	// Get the numer of currently selected nodes
	static getNumSelected ()
	{
		return Node.currentNodes.length;
	}

	/////////////////////////////
	// STATIC METHODS: DRAWING //
	/////////////////////////////

	// Draw all nodes
	static draw ()
	{
		const l = Node.nodes.length;

		if (l == null)
		{
			return;
		}

		for (var i = 0; i < Node.nodes.length; i++)
		{
			Node.nodes[i].draw ();
		}
	}

	/////////////////////////////////////////
	// BEGINNING OF THE INSTANCEABLE CLASS //
	/////////////////////////////////////////

	// Constructor of a single node
	constructor (x, y, add = true)
	{
		// Currently accepted coordinates
		this.x = x;
		this.y = y;

		// Current coordinates on the screen (while moving)
		this.drawX = x;
		this.drawY = y;

		this.realX = (this.drawX / Grid.getSpanX ()) * Grid.getSize ();
		this.realY = (this.drawY / Grid.getSpanY ()) * Grid.getSize ();

		// Own indices for the 3D-node-array
		// Only for the first two dimensions, the third one is determined by its distance to the mouse
		this.arrayX = Node.getNodeIndex (x, Node.contextWidth);
		this.arrayY = Node.getNodeIndex (y, Node.contextHeight);

		// Last measured distance to given coordinates
		this.distance = -1;

		// Is the node selected?
		this.selected = false;

		// Color to use when the node is drawn
		this.color = "yellow";

		// Own unique id (should be unique)
		this.id = Node.idCounter++;

		// If deprecated, replace with the node owning this id
		this.newId = this.id;

		if (add == true)
		{
			Node.addNode (this);
		}
	}

	// Select this node
	select (multi)
	{
		if (this.selected == false)
		{
			if (multi == false)
			{
				Node.unselect ();
			}

			Node.currentNodes.push (this);
			this.selected = true;
		}
	}

	// Unselect this node
	unselect ()
	{
		this.selected = false;
		console.log ("Node unselected");
	}

	// Set new position
	setPos (x, y)
	{
		this.x = x;
		this.y = y;

		this.realX = (this.drawX / Grid.getSpanX ()) * Grid.getSize ();
		this.realY = (this.drawY / Grid.getSpanY ()) * Grid.getSize ();
	}

	// Set new position relative to old position
	setRelPos (x, y)
	{
		this.x += x;
		this.y += y;

		this.realX = (this.drawX / Grid.getSpanX ()) * Grid.getSize ();
		this.realY = (this.drawY / Grid.getSpanY ()) * Grid.getSize ();
	}

	// Accept the current coordinates used for drawing as official ones
	setSnappedPos ()
	{
		this.x = this.drawX;
		this.y = this.drawY;
	}

	// Check if another node already exists on the same spot
	checkForDuplicates ()
	{
		const p = Node.getNodeByPos (this.x, this.y, 0);

		if (p == null)
		{
			debugger;
			return false;
		}

		if (p.getId () == this.id)
		{
			return false;
		}

		if (p.getX () == this.x && p.getY () == this.y)
		{
			console.log ("Found existing node");
			p.setNewId (this.id);
			Node.setChange (true);

			return true;
		}

		return false;
	}

	// Get the currently accepted position on the x-axis
	getX ()
	{
		return this.x;
	}

	// Get the current position on the x-axis used for drawing
	getDrawnX ()
	{
		return this.drawX;
	}

	// Get the x position in the second array
	getCoordX ()
	{
		return this.arrayX;
	}

	// Get the currently accepted position on the y-axis
	getY ()
	{
		return this.y;
	}

	// Get the current position on the y-axis used for drawing
	getDrawnY ()
	{
		return this.drawY;
	}

	//Get the y position in the second array
	getCoordY ()
	{
		return this.arrayY;
	}

	// Get the distance between the given coordinates and the node
	getDistance (x, y)
	{
		this.distance = Math.hypot (x - this.x, y - this.y);

		return this.distance;
	}

	// Get the last calculated distance
	getLastDistance ()
	{
		return this.distance;
	}

	// Get the id of the node
	getId ()
	{
		return this.id;
	}

	// Set the new id
	// As soon as newId is set to something different than the own id, the node is seen as deprecated
	setNewId (id)
	{
		this.newId = id;
		console.log ("Node " + this.id + " will be replaced by node " + this.newId);
	}

	// Get the new id
	// If the new id does not match the id given to the node, the node is seen as deprecated
	getNewId ()
	{
		return this.newId;
	}

	// Is the node deprecated or not?
	isDeprecated ()
	{
		return (this.id != this.newId) ? true : false;
	}

	// Update the node
	update ()
	{
		if (this.isDeprecated () == true)
		{
			return;
		}

		this.setSnappedPos ();

		const r = this.checkForDuplicates ();

		if (r == true)
		{
			return;
		}

		const newArrayX = Node.getNodeIndex (this.x, Node.contextWidth);
		const newArrayY = Node.getNodeIndex (this.y, Node.contextHeight);

		if (newArrayX != this.arrayX || newArrayY != this.arrayY)
		{
			const i = Node.coordinateSystem[this.arrayX][this.arrayY].indexOf (this);

			if (i == -1)
			{
				return;
			}

			Node.coordinateSystem[this.arrayX][this.arrayY].splice (i, 1);

			this.arrayX = newArrayX;
			this.arrayY = newArrayY;

			Node.coordinateSystem[this.arrayX][this.arrayY].push (this);
		}

		this.color = "yellow";
	}

	// Draw the node (if selected)
	draw ()
	{
		const spanX = Grid.getSpanX ();
		const spanY = Grid.getSpanY ();

		var restX = this.x % spanX;
		var restY = this.y % spanY;

		if (restX < spanX * 0.2)
		{
			this.drawX = this.x - restX;
		}

		else if (restX > spanX * 0.8)
		{
			this.drawX = this.x + (spanX - restX);
		}

		else
		{
			this.drawX = this.x;
		}

		if (restY < spanY * 0.2)
		{
			this.drawY = this.y - restY;
		}

		else if (restY > spanY * 0.8)
		{
			this.drawY = this.y + (spanY - restY);
		}

		else
		{
			this.drawY = this.y;
		}

		if (this.selected == false && Node.show == false)
		{
			return;
		}

		Node.context.beginPath ();
		Node.context.arc (this.drawX, this.drawY, 8, 0, 2 * Math.PI);
		Node.context.fillStyle = this.color;
		Node.context.fill ();
		Node.context.stroke ();

		// These lines draws the coordinates of the node on the canvas
		//Node.context.fillStyle = "black";
		//Node.context.font = "24px sanserif";
		//Node.context.fillText (this.realX + ", " + this.realY, this.drawX + 20, this.drawY + 5);
	}
}