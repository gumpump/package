import { Node } from "./node.js"
import { Face } from "./face.js"

export class Properties
{
	static clear ()
	{
		console.log ("Property view cleared");

		const hTarget = document.getElementById ("sidebar-object_properties");

		if (hTarget == null)
		{
			console.error ("Could not find target");

			return;
		}

		hTarget.innerHTML = "";
	}

	//////////////
	// BUILDERS //
	//////////////

	static buildNodeView (object)
	{
		if (object == null)
		{
			console.error ("Invalid object");

			return;
		}

		if ((object instanceof Node) == false)
		{
			console.error ("Object is not a Node");

			return;
		}

		const hTarget = document.getElementById ("sidebar-object_properties");

		if (hTarget == null)
		{
			console.log ("Could not find target");

			return;
		}

		var propHTML = "";
		propHTML += '<div>Type: <span id="sidebar-object_properties_type">' + "Node" + '</span></div>';
		propHTML += '<div>ID: <span id="sidebar-object_properties_id">' + object.getId () + '</span></div>';

		hTarget.innerHTML = propHTML;

		console.log ("Property view built");
	}

	static buildFaceView (object)
	{
		if (object == null)
		{
			console.error ("Invalid object");

			return;
		}

		if ((object instanceof Face) == false)
		{
			console.error ("Object is not a Face");

			return;
		}

		const hTarget = document.getElementById ("sidebar-object_properties");

		if (hTarget == null)
		{
			console.error ("Could not find target");

			return;
		}

		var propHTML = "";
		propHTML += '<div>Type: <span id="sidebar-object_properties_type">' + "Face" + '</span></div>';
		propHTML += '<div>ID: <span id="sidebar-object_properties_id">' + object.getId () + '</span></div>';
		propHTML += '<div>Nodes: <span id="sidebar-object_properties_num_nodes">' + object.getNumNodes () + '</span></div>';

		hTarget.innerHTML = propHTML;

		console.log ("Property view built");
	}
}