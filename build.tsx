await Bun.build ({
	entrypoints: ['./main.js'],
	outdir: './out',
	target: "browser",
	minify: true,
})

function copyFileError (err)
{
	if (err)
	{
		console.log ("Couldn't copy file");
	}
}

const fs = require ("fs");
fs.copyFile ("./index.html", "./out/index.html", copyFileError);
fs.copyFile ("./style.css", "./out/style.css", copyFileError);
fs.copyFile ("./contextmenu.css", "./out/contextmenu.css", copyFileError);