#! /bin/bash

# canvas-sketch src/index.js --dir docs --build --no-compress
canvas-sketch src/index.js --dir docs --build
sed -i 's/src\/assets/g20generator\/src\/assets/g' docs/index.js