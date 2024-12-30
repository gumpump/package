import { Grid } from "./grid.js"
import { Point } from "./point.js"
import { Line } from "./line.js"
import { Face } from "./face.js"

export class Manager
{
	static canvasWidth = 0;
	static canvasHeight = 0;

	static setDimension (w, h)
	{
		Manager.canvasWidth = w;
		Manager.canvasHeight = h;
	}

	// Event handlers
	static createLine (event)
	{
		if (Point.isSelected () == true)
		{
			const p = Point.getSelected ();
			const l = p.length;

			for (var i = 0; i < l; i++)
			{
				const pX = p[i].getX ();
				const pY = p[i].getY ();
				const offX = (pX + 50 > Manager.canvasWidth) ? -50 : 50;
				const offY = (pY + 50 > Manager.canvasHeight) ? -50 : 50;
				Line.addLine (new Line (p[i], new Point (pX + offX, pY + offY)));
			}
		}

		Manager.update ();
	}

	static createRectangle (event)
	{
		const middleWidth = Manager.canvasWidth / 2;
		const middleHeight = Manager.canvasHeight / 2;

		const pUpperLeft = new Point (middleWidth - 50, middleHeight - 50);
		const pUpperRight = new Point (middleWidth - 50, middleHeight + 50);
		const pLowerRight = new Point (middleWidth + 50, middleHeight + 50);
		const pLowerLeft = new Point (middleWidth + 50, middleHeight - 50);

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

	static update ()
	{
		Face.update ();
		Line.update ();
		Point.update ();

		// Position of Grid.update unclear
	}
}