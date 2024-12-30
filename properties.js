import { Point } from "./point.js"
//import { Line } from "./line.js"
import { Face } from "./face.js"

export class Properties
{
	static clear ()
	{
		console.log ("Property view cleared");

		const hTarget = document.getElementById ("sidebar-object_properties");

		if (hTarget == null)
		{
			console.log ("Could not find target");

			return;
		}

		hTarget.innerHTML = "";
	}

	//////////////
	// BUILDERS //
	//////////////

	static buildPointView (object)
	{
		if (object == null)
		{
			console.log ("Invalid object");

			return;
		}

		if ((object instanceof Point) == false)
		{
			console.log ("Object is not a Point");

			return;
		}

		const hTarget = document.getElementById ("sidebar-object_properties");

		if (hTarget == null)
		{
			console.log ("Could not find target");

			return;
		}

		var propHTML = "";
		propHTML += '<p>Type: <span id="sidebar-object_properties_type">' + "Point" + '</span></p>';
		propHTML += '<p>ID: <span id="sidebar-object_properties_id">' + object.getId () + '</span></p>';

		hTarget.innerHTML = propHTML;

		console.log ("Property view built");
	}

	static buildFaceView (object)
	{
		if (object == null)
		{
			console.log ("Invalid object");

			return;
		}

		if ((object instanceof Face) == false)
		{
			console.log ("Object is not a Face");

			return;
		}

		const hTarget = document.getElementById ("sidebar-object_properties");

		if (hTarget == null)
		{
			console.log ("Could not find target");

			return;
		}

		var propHTML = "";
		propHTML += '<p>Type: <span id="sidebar-object_properties_type">' + "Face" + '</span></p>';
		propHTML += '<p>ID: <span id="sidebar-object_properties_id">' + object.getId () + '</span></p>';

		hTarget.innerHTML = propHTML;

		console.log ("Property view built");
	}
}