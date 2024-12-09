import { Point } from "./point.js"
import { Line } from "./line.js"

const hButtonAdd = document.getElementById ("Add");
hButtonAdd.addEventListener ("click", buttonAdd);

const hButtonShow = document.getElementById ("Show");
hButtonShow.addEventListener ("mousedown", showAll);
hButtonShow.addEventListener ("mouseup", hideAll);
hButtonShow.addEventListener ("mouseleave", hideAll);

const canvas = document.getElementsByTagName ("canvas")[0];
canvas.addEventListener ("click", pointClick);
canvas.addEventListener ("mousedown", pointDown);
canvas.addEventListener ("mouseup", pointUp);
canvas.addEventListener ("mousemove", pointMove);
canvas.width = canvas.getBoundingClientRect().width;
canvas.height = canvas.getBoundingClientRect().height;
const ctx = canvas.getContext ("2d");

var l = [];
Point.setContext (ctx, canvas.width, canvas.height);
l.push (new Line (ctx, new Point (50, 50), new Point (500, 500)));
var down = false;

function animate ()
{
	requestAnimationFrame (animate);
	ctx.clearRect (0, 0, canvas.width, canvas.height);
	l.forEach ((x, i) => { x.draw (); })
}

animate ();

function buttonAdd (event)
{
	if (Point.isSelected () == true)
	{
		const p = Point.getSelected ();
		const pX = p.getX ();
		const pY = p.getY ();
		const offX = (pX + 50 > canvas.width) ? -50 : 50;
		const offY = (pY + 50 > canvas.height) ? -50 : 50;
		l.push (new Line (ctx, p, new Point (pX + offX, pY + offY)));
	}
}

function showAll (event)
{
	Point.showAll ();
}

function hideAll (event)
{
	Point.hideAll ();
}

function pointClick (event)
{
	const p = Point.getPoint (event.offsetX, event.offsetY, 15);

	if (p != null)
	{
		p.select ();
	}

	else
	{
		Point.unselect ();
	}
}

function pointDown (event)
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
	down = true;
}

function pointUp (event)
{
	const p = Point.getSelected ();

	if (p != null)
	{
		Point.hideAll ();
		p.update ();
	}

	down = false;
}

function pointMove (event)
{
	if (down == false)
	{
		return;
	}

	Point.getSelected().setRelPos (event.movementX, event.movementY);
}
