import { Grid } from "./grid.js"
import { Point } from "./point.js"
import { Line } from "./line.js"
import { Face } from "./face.js"
import { Manager } from "./manager.js"

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
		GUI.hButtonShow = document.getElementById ("navbar-buttons_show");
		GUI.hButtonShow.addEventListener ("mousedown", GUI.showAll);
		GUI.hButtonShow.addEventListener ("mouseup", GUI.hideAll);
		GUI.hButtonShow.addEventListener ("mouseleave", GUI.hideAll);

		GUI.hButtonLine = document.getElementById ("sidebar-buttons_add_line");
		GUI.hButtonLine.addEventListener ("click", Manager.createLine);

		GUI.hButtonRect = document.getElementById ("sidebar-buttons_add_rect");
		GUI.hButtonRect.addEventListener ("click", Manager.createRectangle);

		GUI.hButtonClear = document.getElementById ("sidebar-buttons_clear");
		GUI.hButtonClear.addEventListener ("click", GUI.buttonClear);

		// Input fields
		// - Numbers
		GUI.hNumberGridSpanX = document.getElementById ("sidebar-grid_properties_span_x");
		GUI.hNumberGridSpanX.value = Grid.getSpanX ();
		GUI.hNumberGridSpanX.addEventListener ("change", GUI.gridSpanXChange);

		GUI.hNumberGridSpanY = document.getElementById ("sidebar-grid_properties_span_y");
		GUI.hNumberGridSpanY.value = Grid.getSpanY ();
		GUI.hNumberGridSpanY.addEventListener ("change", GUI.gridSpanYChange);

		// Canvas
		GUI.canvas = document.getElementsByTagName ("canvas")[0];
		GUI.canvas.addEventListener ("click", Manager.mouseClick);
		GUI.canvas.addEventListener ("mousedown", GUI.pointDown);
		GUI.canvas.addEventListener ("mouseup", GUI.pointUp);
		GUI.canvas.addEventListener ("mouseleave", GUI.pointUp);
		GUI.canvas.addEventListener ("mousemove", GUI.pointMove);

		GUI.canvasRect = GUI.canvas.getBoundingClientRect ();
		GUI.canvas.width = GUI.canvasRect.width;
		GUI.canvas.height = GUI.canvasRect.height;
		GUI.ctx = GUI.canvas.getContext ("2d");

		Manager.setDimension (GUI.canvas.width, GUI.canvas.height);

		Grid.setContext (GUI.ctx, GUI.canvas.width, GUI.canvas.height);
		Point.setContext (GUI.ctx, GUI.canvas.width, GUI.canvas.height);
		Line.setContext (GUI.ctx);
		Face.setContext (GUI.ctx);

		GUI.debugPoints = document.getElementById ("navbar-message_points");
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
		Face.draw ();
		Line.draw ();
		Point.draw ();
		requestAnimationFrame (GUI.draw);
		// Debug infos
		GUI.debugPoints.innerText = Point.getNumPoints().toString ();
	}

	// Event handler
	static keyDown (event)
	{
		if (event.ctrlKey == true && Manager.multipleSelect == false)
		{
			Manager.multipleSelect = true;
			GUI.status.innerText = "Multi select";
		}
	}

	static keyUp (event)
	{
		if (event.ctrlKey == false)
		{
			Manager.multipleSelect = false;
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

	static buttonClear ()
	{
		Point.clear ();
		Manager.update ();
	}

	static gridSpanXChange (event)
	{
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

		Manager.update ();
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