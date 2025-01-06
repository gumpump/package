import { Grid } from "./grid.js"
import { Node } from "./node.js"
import { Face } from "./face.js"
import { Manager } from "./manager.js"
import { ContextMenu } from "./contextmenu.js"

export class GUI
{
	// Buttons
	static hButtonShow = null;
	static hButtonNode = null;
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
	static drag = "o";

	// General infos
	static status = null;

	// Debug infos
	static debugNodes = null;
	static debugFaces = null;

	static create ()
	{
		document.body.addEventListener ("keydown", GUI.keyDown);
		document.body.addEventListener ("keyup", GUI.keyUp);

		// Buttons
		GUI.hButtonShow = document.getElementById ("navbar-buttons_show");
		GUI.hButtonShow.addEventListener ("mousedown", GUI.showAll);
		GUI.hButtonShow.addEventListener ("mouseup", GUI.hideAll);
		GUI.hButtonShow.addEventListener ("mouseleave", GUI.hideAll);

		GUI.hButtonNode = document.getElementById ("sidebar-buttons_add_node");
		GUI.hButtonNode.addEventListener ("click", Manager.createNode);

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
		GUI.canvas.addEventListener ("mousedown", GUI.mouseDown);
		GUI.canvas.addEventListener ("mouseup", GUI.mouseUp);
		GUI.canvas.addEventListener ("mouseleave", GUI.mouseUp);
		GUI.canvas.addEventListener ("mousemove", GUI.mouseMove);
		GUI.canvas.addEventListener ("contextmenu", ContextMenu.open);

		GUI.canvasRect = GUI.canvas.getBoundingClientRect ();
		GUI.canvas.width = GUI.canvasRect.width;
		GUI.canvas.height = GUI.canvasRect.height;
		GUI.ctx = GUI.canvas.getContext ("2d");

		Manager.setDimension (GUI.canvas.width, GUI.canvas.height);

		Grid.setContext (GUI.ctx, GUI.canvas.width, GUI.canvas.height);
		Node.setContext (GUI.ctx, GUI.canvas.width, GUI.canvas.height);
		Face.setContext (GUI.ctx);

		GUI.debugNodes = document.getElementById ("navbar-message_nodes");
		GUI.debugNodes.innerText = Node.getNumNodes().toString ();

		GUI.debugFaces = document.getElementById ("navbar-message_faces");
		GUI.debugFaces.innerText = Face.getNumFaces().toString ();

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
		Node.draw ();
		requestAnimationFrame (GUI.draw);
		// Debug infos
		GUI.debugNodes.innerText = Node.getNumNodes().toString ();
		GUI.debugFaces.innerText = Face.getNumFaces().toString ();
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
		Node.showAll ();
	}

	static hideAll (event)
	{
		Node.hideAll ();
	}

	static buttonClear ()
	{
		Node.clear ();
		Node.update ();
		Face.update ();
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

	static mouseDown (event)
	{
		const p = Node.getSelected ();
		const l = p.length;

		if (l > 0)
		{
			for (var i = 0; i < l; i++)
			{
				if (p[i].getDistance (event.offsetX, event.offsetY) > 15)
				{
					continue;
				}

				GUI.drag = "n";

				return;
			}
		}

		else
		{
			const f = Face.getSelected ();

			if (f != null)
			{
				if (f.intersect (event.offsetX, event.offsetY) == true)
				{
					GUI.drag = "f";

					return;
				}
			}
		}

		//Node.showAll ();
		GUI.drag = "o";
	}

	static mouseUp (event)
	{
		const p = Node.getSelected ();
		const l = p.length;

		if (l == 0)
		{
			Node.hideAll ();
		}

		GUI.drag = "o";

		Manager.update ();
	}

	static mouseMove (event)
	{
		switch (GUI.drag)
		{
			case "o":
			{
				return;
			} break;

			case "n":
			{
				const p = Node.getSelected ();
				const l = p.length;

				if (l > 0)
				{
					for (var i = 0; i < l; i++)
					{
						p[i].setRelPos (event.movementX, event.movementY);
					}

					return;
				}
			} break;

			case "f":
			{
				const f = Face.getSelected ();

				if (f != null)
				{
					f.setRelPos (event.movementX, event.movementY);
				}

				return;
			} break;
		}
	}
}