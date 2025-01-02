export class Grid
{
	// 1 => 1cm
	static size = 1;

	// Span between grid lines
	static spanX = 50;
	static spanY = 50;

	// Context of the main canvas
	static context = null;

	// Canvas containing the grid
	static grid = null;

	// Context of the grid canvas
	static gridContext = null;

	// Set main context and its dimensions
	static setContext (ctx, w, h)
	{
		Grid.context = ctx;
		Grid.grid = document.createElement ("canvas");
		Grid.grid.width = w;
		Grid.grid.height = h;
		Grid.gridContext = Grid.grid.getContext ("2d");

		Grid.update ();
	}

	// Set the real life dimension of one span
	// 1 => 1cm
	static setSize (s)
	{
		Grid.size = s;

		Grid.update ();
	}

	// Get the real life dimension of one span
	// 1 => 1cm
	static getSize ()
	{
		return Grid.size;
	}

	static setSpanX (x)
	{
		Grid.spanX = x;
	}

	// Get the span size on the x-axis (in pixel)
	static getSpanX ()
	{
		return Grid.spanX;
	}

	static setSpanY (y)
	{
		Grid.spanY = y;
	}

	// Get the span size on the y-axis (in pixel)
	static getSpanY ()
	{
		return Grid.spanY;
	}

	// (Re-)Create the grid canvas once its settings have changed
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
			Grid.gridContext.closePath ();
		}

		for (var y = Grid.spanY; y < Grid.grid.height; y += Grid.spanY)
		{
			Grid.gridContext.beginPath ();
			Grid.gridContext.strokeStyle = "lightgray";
			Grid.gridContext.moveTo (0, y);
			Grid.gridContext.lineTo (Grid.grid.width, y);
			Grid.gridContext.stroke ();
			Grid.gridContext.closePath ();
		}
	}

	// Draw the grid canvas on the main canvas
	static draw ()
	{
		Grid.context.drawImage (Grid.grid, 0, 0);
	}
}