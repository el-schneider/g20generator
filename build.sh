#! /bin/bash

# canvas-sketch src/index.js --dir docs --build --no-compress
canvas-sketch src/index.js --dir docs --build

#this is only necessary for github pages
sed -i 's/src\/assets/g20generator\/src\/assets/g' docs/index.js

#deploying
git commit -a -m "building ..."
git push
