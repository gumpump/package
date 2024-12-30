import { Grid } from "./grid.js"
import { Node } from "./node.js"
import { Line } from "./line.js"
import { Face } from "./face.js"
import { Properties } from "./properties.js"

export class Manager
{
	static canvasWidth = 0;
	static canvasHeight = 0;

	static multipleSelect = false;

	static setDimension (w, h)
	{
		Manager.canvasWidth = w;
		Manager.canvasHeight = h;
	}

	///////////////////////////////////
	// BUTTON-RELATED EVENT HANDLERS //
	///////////////////////////////////
	
	static createLine (event)
	{
		if (Node.isSelected () == true)
		{
			const p = Node.getSelected ();
			const l = p.length;

			for (var i = 0; i < l; i++)
			{
				const pX = p[i].getX ();
				const pY = p[i].getY ();
				const offX = (pX + 50 > Manager.canvasWidth) ? -50 : 50;
				const offY = (pY + 50 > Manager.canvasHeight) ? -50 : 50;
				const newP = new Node (pX + offX, pY + offY);

				Node.unselect ();
				newP.select ();

				Line.addLine (new Line (p[i], newP));
			}
		}

		Manager.update ();
	}

	static createRectangle (event)
	{
		const middleWidth = Manager.canvasWidth / 2;
		const middleHeight = Manager.canvasHeight / 2;

		const pUpperLeft = new Node (middleWidth - 50, middleHeight - 50);
		const pUpperRight = new Node (middleWidth - 50, middleHeight + 50);
		const pLowerRight = new Node (middleWidth + 50, middleHeight + 50);
		const pLowerLeft = new Node (middleWidth + 50, middleHeight - 50);

		Line.addLine (new Line (pUpperLeft, pUpperRight, false));
		Line.addLine (new Line (pUpperRight, pLowerRight, false));
		Line.addLine (new Line (pLowerRight, pLowerLeft, false));
		const lArray = Line.addLine (new Line (pLowerLeft, pUpperLeft, false));

		if (lArray != null)
		{
			Face.addFace (new Face (lArray, false));
		}

		Manager.update ();
	}

	//////////////////////////////////
	// MOUSE-RELATED EVENT HANDLERS //
	//////////////////////////////////

	static mouseClick (event)
	{
		const p = Node.getNodeByPos (event.offsetX, event.offsetY, 15);

		if (p != null)
		{
			p.select (Manager.multipleSelect);

			if (Node.getNumSelected () == 1)
			{
				Properties.buildNodeView (p);
			}

			else
			{
				Properties.clear ();
			}

			Face.unselect ();

			return;
		}

		Face.unselect ();

		const f = Face.getFaceByPos (event.offsetX, event.offsetY);

		if (f != null)
		{
			f.select ();

			Properties.buildFaceView (f);

			Node.unselect ();

			return;
		}

		Face.unselect ();

		if (Manager.multipleSelect == false)
		{
			Node.unselect ();
		}

		Properties.clear ();
	}

	static update ()
	{
		Face.update ();
		Line.update ();
		Node.update ();

		// Position of Grid.update unclear
	}
}