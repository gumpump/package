import { Grid } from "./grid.js"
import { Node } from "./node.js"
import { Face } from "./face.js"
import { ContextMenu } from "./contextmenu.js"
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
				var nArray = [];
				nArray.push (p[i]);

				const pX = p[i].getX ();
				const pY = p[i].getY ();
				const offX = (pX + 50 > Manager.canvasWidth) ? -50 : 50;
				const offY = (pY + 50 > Manager.canvasHeight) ? -50 : 50;

				nArray.push (new Node (pX + offX, pY + offY));
				Node.unselect ();
				nArray[1].select ();

				Face.addFace (new Face (nArray, false));
			}
		}

		Manager.update ();
	}

	static createRectangle (event)
	{
		const middleWidth = Manager.canvasWidth / 2;
		const middleHeight = Manager.canvasHeight / 2;

		var nArray = [];

		nArray.push (new Node (middleWidth - 50, middleHeight - 50));
		nArray.push (new Node (middleWidth - 50, middleHeight + 50));
		nArray.push (new Node (middleWidth + 50, middleHeight + 50));
		nArray.push (new Node (middleWidth + 50, middleHeight - 50));

		Face.addFace (new Face (nArray, false));

		Manager.update ();
	}

	//////////////////////////////////
	// MOUSE-RELATED EVENT HANDLERS //
	//////////////////////////////////

	static mouseClick (event)
	{
		ContextMenu.close ();

		const n = Node.getNodeByPos (event.offsetX, event.offsetY, 15);

		if (n != null)
		{
			n.select (Manager.multipleSelect);

			if (Node.getNumSelected () == 1)
			{
				Properties.buildNodeView (n);
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
		Node.update ();

		// Position of Grid.update unclear
	}
}