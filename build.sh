#! /bin/bash

# canvas-sketch src/index.js --dir docs --build --no-compress
canvas-sketch src/index.js --dir docs --build --html=src/page.html --no-compress

#this is only necessary for github pages
sed -i 's/src\/assets/g20generator\/src\/assets/g' docs/index.js
