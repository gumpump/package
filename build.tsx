await Bun.build ({
  entrypoints: ['./main.js'],
  outdir: './out',
  target: "browser",
  minify: true,
})