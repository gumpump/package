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

	static createNode (event)
	{
		const f = Face.getSelected ();
		var l = f.length;

		if (l > 0)
		{
			for (var i = 0; i < l; i++)
			{
				// ONLY FOR TEST PURPOSES
				// MAY THE UNIVERSE FORGIVE US
				// TODO: Rework this
				if (f[i].isLine () == true)
				{
					f[i].addNode (1);
				}
			}
		}

		else
		{
			const middleWidth = Manager.canvasWidth / 2;
			const middleHeight = Manager.canvasHeight / 2;
			const node = new Node (middleWidth, middleHeight, false, false);
			node.select (false);
			Node.addNode (node);
		}
	}
	
	static createLine (event)
	{
		if (Node.isSelected () == true)
		{
			const n = Node.getSelected ();
			const l = n.length;

			for (var i = 0; i < l; i++)
			{
				var nArray = [];
				n[i].setConnected (true);
				nArray.push (n[i]);

				const nX = n[i].getX ();
				const nY = n[i].getY ();
				const offX = (nX + 50 > Manager.canvasWidth) ? -50 : 50;
				const offY = (nY + 50 > Manager.canvasHeight) ? -50 : 50;

				nArray.push (new Node (nX + offX, nY + offY));
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

			if (Manager.multipleSelect == false)
			{
				Face.unselect ();
			}

			return;
		}

		const f = Face.getFaceByPos (event.offsetX, event.offsetY);

		if (f != null)
		{
			f.select (Manager.multipleSelect);

			if (Face.getNumSelected () == 1)
			{
				Properties.buildFaceView (f);
			}

			else
			{
				Properties.clear ();
			}

			if (Manager.multipleSelect == false)
			{
				Node.unselect ();
			}

			return;
		}

		Properties.clear ();

		if (Manager.multipleSelect == false)
		{
			Node.unselect ();
			Face.unselect ();
		}
	}

	static update ()
	{
		Face.update ();
		Node.update ();

		// Position of Grid.update unclear
	}
}