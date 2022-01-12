#!/bin/bash

if [ -z "$CODE_DIR" ]; then echo "var is unset"; fi


if [ -z "$CODE_DIR" ]; then echo "var is unset"; fi

if [ ! -d "$CODE_DIR" ]; then
  echo "Can't find $CODE_DIR/ directory. Are you running"\
       "from the correct root directory?"
  exit 1
fi


echo "found"