# package
I was in need of an application to create die cuts for packaging products, but I couldn't find one.
So I decided to create one on my own.
## Why Javascript?
At first I wanted to use C, but with it I would have to build the GUI with an additional library and I would have to care about platform independence. So I chose HTML, CSS and Javascript so the only thing you would need is an http server on your machine or a webserver to host it.

## Existing features

 - Creating rectangles
 - Add lines to existing nodes (named "points" in the code)
 - Show all existing nodes
 - Clear the canvas
 - Move single nodes or multiple nodes at once

## Planned features

 - Creating single nodes independently from lines
 - Creating round lines
 - Select whole areas
 - Interactive input fields for changing coordinates of nodes
 - Export to image or even pdf
 - Interactive input fields for changing resolution of grid
 - Toggling grid on and off

 ## Known bugs
 - If you move multiple nodes at once over multiple other nodes to merge them, they are all gone and it messes up the internal nodes list.
 The counter shows more nodes than you can see on the canvas and the "Show all"-button doesn't work.
 - If you move multiple nodes at once they snap to the grid differently so their surface become "corrupted".