export class Point
{
	static idCounter = 1;
	static context = null;
	static contextWidth = 0;
	static contextHeight = 0;
	static points = [];
	static currentPoint = 0;
	static show = false;

	static setContext (ctx, w, h)
	{
		Point.context = ctx;
		Point.contextWidth = w;
		Point.contextHeight = h;
	}

	static getPointIndex (v, l)
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

	static addPoint (p)
	{
		if (Point.points.length == 0)
		{
			Point.points = new Array (8);
			for (var i = 0; i < 8; i++)
			{
				Point.points[i] = new Array (8);

				for (var j = 0; j < 8; j++)
				{
					Point.points[i][j] = [];
				}
			}
		}

		var targetX = Point.getPointIndex (p.getX (), Point.contextWidth);
		var targetY = Point.getPointIndex (p.getY (), Point.contextHeight);

		Point.points[targetX][targetY].push (p);
	}

	static getPoint (x, y, r)
	{
		var targetX = Point.getPointIndex (x, Point.contextWidth);
		var targetY = Point.getPointIndex (y, Point.contextHeight);

		Point.points[targetX][targetY].sort ((a, b) => { a.getDistance (x, y) - b.getDistance (x, y); });

		const p = Point.points[targetX][targetY][0];

		if (p == undefined)
		{
			return null;
		}

		if (p.getDistance (x, y) > r)
		{
			return null;
		}

		return Point.points[targetX][targetY][0];
	}

	static isSelected ()
	{
		return (Point.currentPoint == 0) ? false : true;
	}

	static getSelected ()
	{
		if (Point.currentPoint != 0)
		{
			for (var x = 0; x < 8; x++)
			{
				for (var y = 0; y < 8; y++)
				{
					const r = Point.points[x][y].find ((p) => { return p.id == Point.currentPoint; });

					if (r !== undefined)
					{
						return r;
					}
				}
			}
		}

		return null;
	}

	static showAll ()
	{
		for (var x = 0; x < 8; x++)
		{
			for (var y = 0; y < 8; y++)
			{
				const r = Point.points[x][y].find ((p) => { console.log (p); });
			}
		}
		Point.show = true;
	}

	static hideAll ()
	{
		Point.show = false;
	}

	static unselect ()
	{
		for (var x = 0; x < 8; x++)
		{
			for (var y = 0; y < 8; y++)
			{
				const r = Point.points[x][y].find ((p) => { return p.id == Point.currentPoint; });

				if (r !== undefined)
				{
					r.unselect ();
					Point.currentPoint = 0;

					return;
				}
			}
		}
	}

	constructor (x, y)
	{
		this.x = x;
		this.y = y;
		this.arrayX = Point.getPointIndex (x, Point.contextWidth);
		this.arrayY = Point.getPointIndex (y, Point.contextHeight);
		this.distance = -1;
		this.selected = false;
		this.color = "yellow";
		this.id = Point.idCounter;
		Point.idCounter++;
		Point.addPoint (this);
	}

	select ()
	{
		if (this.selected == false)
		{
			if (this.id != Point.currentPoint)
			{
				Point.unselect ();
				Point.currentPoint = this.id;
			}

			this.selected = true;
		}
	}

	unselect ()
	{
		this.selected = false;
	}

	move ()
	{
		this.color = "blue";
	}

	setPos (x, y)
	{
		this.x = x;
		this.y = y;
	}

	setRelPos (x, y)
	{
		this.x += x;
		this.y += y;
	}

	update ()
	{
		const i = Point.points[this.arrayX][this.arrayY].indexOf (this);

		if (i == -1)
		{
			console.log ("What the duck?");

			return;
		}

		Point.points[this.arrayX][this.arrayY].splice (i, 1);

		this.arrayX = Point.getPointIndex (this.x, Point.contextWidth);
		this.arrayY = Point.getPointIndex (this.y, Point.contextHeight);

		Point.points[this.arrayX][this.arrayY].push (this);

		this.color = "yellow";
	}

	getX ()
	{
		return this.x;
	}

	getY ()
	{
		return this.y;
	}

	getDistance (x, y)
	{
		this.distance = Math.hypot (x - this.x, y - this.y);

		return this.distance;
	}

	getLastDistance ()
	{
		return this.distance;
	}

	draw ()
	{
		if (this.selected == false && Point.show == false)
		{
			return;
		}

		Point.context.beginPath ();
		Point.context.arc (this.x, this.y,
						  10, 0, 2 * Math.PI);
		Point.context.fillStyle = this.color;
		Point.context.fill ();
		Point.context.stroke ();
	}
}
