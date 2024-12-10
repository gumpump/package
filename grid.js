export class Grid
{
	// 1 => 1cm
	static size = 1;
	static spanX = 50;
	static spanY = 50;

	static context = null;
	static grid = null;
	static gridContext = null;

	static setContext (ctx, w, h)
	{
		Grid.context = ctx;
		Grid.grid = document.createElement ("canvas");
		Grid.grid.width = w;
		Grid.grid.height = h;
		Grid.gridContext = Grid.grid.getContext ("2d");

		Grid.update ();
	}

	static setSize (s)
	{
		Grid.size = s;

		Grid.update ();
	}

	static getSize ()
	{
		return Grid.size;
	}

	static getSpanX ()
	{
		return Grid.spanX;
	}

	static getSpanY ()
	{
		return Grid.spanY;
	}

	static update ()
	{
		Grid.gridContext.clearRect (0, 0, Grid.grid.width, Grid.grid.height);

		for (var x = Grid.spanX; x < Grid.grid.width; x += Grid.spanX)
		{
			Grid.gridContext.beginPath ();
			Grid.gridContext.strokeStyle = "lightgray";
			Grid.gridContext.moveTo (x, 0);
			Grid.gridContext.lineTo (x, Grid.grid.height);
			Grid.gridContext.stroke ();
		}

		for (var y = Grid.spanY; y < Grid.grid.height; y += Grid.spanY)
		{
			Grid.gridContext.beginPath ();
			Grid.gridContext.strokeStyle = "lightgray";
			Grid.gridContext.moveTo (0, y);
			Grid.gridContext.lineTo (Grid.grid.width, y);
			Grid.gridContext.stroke ();
		}
	}

	static draw ()
	{
		Grid.context.drawImage (Grid.grid, 0, 0);
	}
}