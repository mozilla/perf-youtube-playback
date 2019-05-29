#!/bin/bash

set -ex

TO_BE_DOWNLOADED=(
  'https://storage.googleapis.com/ytlr-cert.appspot.com/test-materials/YTS-media-files.tar.gz'
)

for i in "${TO_BE_DOWNLOADED[@]}"; do
  wget -c "$i"
  tar zxvf "${i##*/}"
  rm -fv "${i##*/}"
done

