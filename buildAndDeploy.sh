#! /bin/bash

bash build.sh

#deploying
git commit -a -m "building ..."
git push
