import { Grid } from "./grid.js"
import { Point } from "./point.js"
import { Line } from "./line.js"

export class GUI
{
	// Buttons
	static hButtonShow = null;
	static hButtonLine = null;
	static hButtonRect = null;

	// Canvas
	static canvas = null;
	static canvasRect = null;
	static ctx = null;

	// Helper
	static drag = false;

	// Debug infos
	static debugPoints = null;

	static create ()
	{
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
			const p = Point.getSelected ();
			const pX = p.getX ();
			const pY = p.getY ();
			const offX = (pX + 50 > GUI.canvas.width) ? -50 : 50;
			const offY = (pY + 50 > GUI.canvas.height) ? -50 : 50;
			Line.addLine (new Line (GUI.ctx, p, new Point (pX + offX, pY + offY)));
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

	static pointClick (event)
	{
		const p = Point.getPointByPos (event.offsetX, event.offsetY, 15);

		if (p != null)
		{
			p.select ();
		}

		else
		{
			Point.unselect ();
		}
	}

	static pointDown (event)
	{
		const p = Point.getSelected ();

		if (p == null)
		{
			return;
		}

		if (p.getDistance (event.offsetX, event.offsetY) > 15)
		{
			return;
		}

		p.move ();
		Point.showAll ();
		GUI.drag = true;
	}

	static pointUp (event)
	{
		const p = Point.getSelected ();

		if (p != null)
		{
			Point.hideAll ();
			p.update ();
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

		Point.getSelected().setRelPos (event.movementX, event.movementY);
	}
}