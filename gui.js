import { Grid } from "./grid.js"
import { Point } from "./point.js"
import { Line } from "./line.js"

export class GUI
{
	// Buttons
	static hButtonShow = null;
	static hButtonLine = null;
	static hButtonRect = null;

	// Input fields
	// - Numbers
	static hNumberGridSpanX = null;
	static hNumberGridSpanY = null;

	// Canvas
	static canvas = null;
	static canvasRect = null;
	static ctx = null;

	// Helper
	static multipleSelect = false;
	static drag = false;

	// General infos
	static status = null;

	// Debug infos
	static debugPoints = null;

	static create ()
	{
		document.body.addEventListener ("keydown", GUI.keyDown);
		document.body.addEventListener ("keyup", GUI.keyUp);

		// Buttons
		GUI.hButtonShow = document.getElementById ("Show");
		GUI.hButtonShow.addEventListener ("mousedown", GUI.showAll);
		GUI.hButtonShow.addEventListener ("mouseup", GUI.hideAll);
		GUI.hButtonShow.addEventListener ("mouseleave", GUI.hideAll);

		GUI.hButtonLine = document.getElementById ("Line");
		GUI.hButtonLine.addEventListener ("click", GUI.buttonLine);

		GUI.hButtonRect = document.getElementById ("Rect");
		GUI.hButtonRect.addEventListener ("click", GUI.buttonRect);

		GUI.hButtonClear = document.getElementById ("Clear");
		GUI.hButtonClear.addEventListener ("click", GUI.buttonClear);

		// Input fields
		// - Numbers
		GUI.hNumberGridSpanX = document.getElementById ("grid_span-x");
		GUI.hNumberGridSpanX.value = Grid.getSpanX ();
		GUI.hNumberGridSpanX.addEventListener ("change", GUI.gridSpanXChange);

		GUI.hNumberGridSpanY = document.getElementById ("grid_span-y");
		GUI.hNumberGridSpanY.value = Grid.getSpanY ();
		GUI.hNumberGridSpanY.addEventListener ("change", GUI.gridSpanYChange);

		// Canvas
		GUI.canvas = document.getElementsByTagName ("canvas")[0];
		GUI.canvas.addEventListener ("click", GUI.pointClick);
		GUI.canvas.addEventListener ("mousedown", GUI.pointDown);
		GUI.canvas.addEventListener ("mouseup", GUI.pointUp);
		GUI.canvas.addEventListener ("mouseleave", GUI.pointUp);
		GUI.canvas.addEventListener ("mousemove", GUI.pointMove);

		GUI.canvasRect = GUI.canvas.getBoundingClientRect ();
		GUI.canvas.width = GUI.canvasRect.width;
		GUI.canvas.height = GUI.canvasRect.height;
		GUI.ctx = GUI.canvas.getContext ("2d");

		Grid.setContext (GUI.ctx, GUI.canvas.width, GUI.canvas.height);
		Point.setContext (GUI.ctx, GUI.canvas.width, GUI.canvas.height);
		Line.setContext (GUI.ctx);

		GUI.debugPoints = document.getElementById ("Points");
		GUI.debugPoints.innerText = Point.getNumPoints().toString ();

		GUI.status = document.getElementById ("Multi");
		GUI.status.innerText = "Single select";
	}

	static getContext ()
	{
		return ctx;
	}

	static draw ()
	{
		GUI.ctx.clearRect (0, 0, GUI.canvas.width, GUI.canvas.height);
		Grid.draw ();
		Line.draw ();
		Point.draw ();
		requestAnimationFrame (GUI.draw);
		// Debug infos
		GUI.debugPoints.innerText = Point.getNumPoints().toString ();
	}

	// Event handler
	static keyDown (event)
	{
		if (event.ctrlKey == true && GUI.multipleSelect == false)
		{
			GUI.multipleSelect = true;
			GUI.status.innerText = "Multi select";
		}
	}

	static keyUp (event)
	{
		if (event.ctrlKey == false)
		{
			GUI.multipleSelect = false;
			GUI.status.innerText = "Single select";
		}
	}

	static showAll (event)
	{
		Point.showAll ();
	}

	static hideAll (event)
	{
		Point.hideAll ();
	}

	static buttonLine (event)
	{
		if (Point.isSelected () == true)
		{
			// Broken because of the new return value of Point.getSelected
			// TODO: Change to array
			const p = Point.getSelected ();
			const l = p.length;

			if (l == 0)
			{
				return;
			}

			for (var i = 0; i < l; i++)
			{
				const pX = p[i].getX ();
				const pY = p[i].getY ();
				const offX = (pX + 50 > GUI.canvas.width) ? -50 : 50;
				const offY = (pY + 50 > GUI.canvas.height) ? -50 : 50;
				Line.addLine (new Line (GUI.ctx, p[i], new Point (pX + offX, pY + offY)));
			}
		}
	}

	static buttonRect (event)
	{
		const middleWidth = GUI.canvas.width / 2;
		const middleHeight = GUI.canvas.height / 2;

		const pUpperLeft = new Point (middleHeight - 50, middleWidth - 50);
		const pUpperRight = new Point (middleHeight - 50, middleWidth + 50);
		const pLowerRight = new Point (middleHeight + 50, middleWidth + 50);
		const pLowerLeft = new Point (middleHeight + 50, middleWidth - 50);

		Line.addLine (new Line (GUI.ctx, pUpperLeft, pUpperRight));
		Line.addLine (new Line (GUI.ctx, pUpperRight, pLowerRight));
		Line.addLine (new Line (GUI.ctx, pLowerRight, pLowerLeft));
		Line.addLine (new Line (GUI.ctx, pLowerLeft, pUpperLeft));
	}

	static buttonClear ()
	{
		Point.clear ();
		Line.update ();
	}

	static gridSpanXChange (event)
	{
		console.log (event);
		Grid.setSpanX (event.target.valueAsNumber);
		Grid.update ();
	}

	static gridSpanYChange (event)
	{
		Grid.setSpanY (event.target.valueAsNumber);
		Grid.update ();
	}

	static pointClick (event)
	{
		const p = Point.getPointByPos (event.offsetX, event.offsetY, 15);

		if (p != null)
		{
			p.select (GUI.multipleSelect);
		}

		else
		{
			if (GUI.multipleSelect == false)
			{
				Point.unselect ();
			}
		}
	}

	static pointDown (event)
	{
		const p = Point.getSelected ();
		const l = p.length;

		if (l == 0)
		{
			return;
		}

		for (var i = 0; i < l; i++)
		{
			if (p[i].getDistance (event.offsetX, event.offsetY) > 15)
			{
				continue;
			}

			p[i].move ();
		}

		//Point.showAll ();
		GUI.drag = true;
	}

	static pointUp (event)
	{
		const p = Point.getSelected ();
		const l = p.length;

		if (l == 0)
		{
			Point.hideAll ();

			for (var i = 0; i < l; i++)
			{
				p[i].update ();
			}
		}

		GUI.drag = false;

		Line.update ();
	}

	static pointMove (event)
	{
		if (GUI.drag == false)
		{
			return;
		}

		const p = Point.getSelected();
		const l = p.length;

		if (l == 0)
		{
			return;
		}

		for (var i = 0; i < l; i++)
		{
			p[i].setRelPos (event.movementX, event.movementY);
		}
	}
}