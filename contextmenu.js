import { Node } from "./node.js"
import { Face } from "./face.js"

export class ContextMenu
{
	static menu = null;

	static open (event)
	{
		event.preventDefault ();

		if (ContextMenu.menu == null)
		{
			ContextMenu.menu = document.getElementById ("context-menu");
		}

		ContextMenu.menu.style.top = event.clientY + "px";
		ContextMenu.menu.style.left = event.clientX + "px";

		ContextMenu.menu.style.visibility = "visible";
	}
}