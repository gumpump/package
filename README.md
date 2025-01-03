# package
I was in need of an application to create die cuts for packaging products, but I couldn't find one.
So I decided to create one on my own.
## Why Javascript?
At first I wanted to use C, but with it I would have to build the GUI with an additional library and I would have to care about platform independence. So I chose HTML, CSS and Javascript so the only thing you would need is an ~~http server on your machine or a webserver to host it~~.
**Update:**
You can use Bun.js with build.tsx to bundle it and link it in an html file. The only thing that needed an active server was the fact, that modern browser don't let JavaScript include modules if they are coming from your local storage. In the future I want to add some kind of build script so you don't have to study to run this thing.

## Existing features

 - Creating rectangles
 - Add lines to existing nodes
 - Show all existing nodes
 - Clear the canvas
 - Move single nodes or multiple nodes at once
 - Select and move surfaces (Only rectangles at the moment)

## Planned features

 - Creating single nodes independently from lines
 - Add nodes into existing faces
 - Creating round lines
 - Interactive input fields for changing coordinates of nodes
 - Export to image or even pdf
 - Interactive input fields for changing resolution of grid
 - Toggling grid on and off

 ## Known bugs
 - If you move multiple nodes at once they snap to the grid differently so their surface become distorted.