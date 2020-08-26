#!/bin/bash

# This file is used to deploy yttest to an S3 bucket. It
# expects the S3 bucket name in an environment variable
# $YTTEST_BUCKET

set -ex

main() {
  # For short-lived assets; in seconds
  FIVE_DAYS="432000"

  # For long-lived assets; in seconds
  ONE_YEAR="31536000"

  CSPSTATIC="\"content-security-policy\": \"default-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors: 'none'; object-src 'none'\""
  CSP="\"content-security-policy\": \"default-src 'none'; img-src 'self' data:; script-src 'self' 'unsafe-inline'; font-src 'self'; frame-ancestors 'none'; base-uri 'none'; style-src 'self' 'unsafe-inline'; connect-src 'self'\""
  HSTS="\"strict-transport-security\": \"max-age=${ONE_YEAR}; includeSubDomains; preload\""
  TYPE="\"x-content-type-options\": \"nosniff\""
  XSS="\"x-xss-protection\": \"1; mode=block\""
  REFERRER="\"referrer-policy\": \"no-referrer-when-downgrade\""

  if [ -z "$YTTEST_BUCKET" ]; then
      echo "The S3 bucket is not set. Failing."
      exit 1
  fi

  # We deploy different code based on the branch name.
  # See https://github.com/mozilla/perf-youtube-playback/issues/19 for the background.
  case "$CIRCLE_BRANCH" in
    raptor)
      CODE_DIR=2019
    ;;
    raptor-2020)
      CODE_DIR=2020
    ;;
    * )
      echo "Unrecognized branch name \`$CIRCLE_BRANCH'." 1>&2
      exit 1
  esac

  case "$1" in
    code)
      if [ -z "$CODE_DIR" ]; then
        echo "The CODE_DIR value is not set, unknown branch: '$CIRCLE_BRANCH'."
        exit 1
      fi
      deploy_code
    ;;
    media)
      deploy_media_files
    ;;
    *)
      echo "Unrecognized deploying target \`$1'. Try 'code' or 'media'." 1>&2
      exit 1
    ;;
  esac
}

deploy_code() {

  # The basic strategy is to sync all the files that need special attention
  # first, and then sync everything else which will get defaults

  # HTML; short cache
  aws s3 sync \
    --cache-control "max-age=${FIVE_DAYS}" \
    --content-type "text/html; charset=utf-8" \
    --exclude "*" \
    --include "*.html" \
    --metadata "{${CSP}, ${HSTS}, ${TYPE}, ${XSS}, ${REFERRER}}" \
    --metadata-directive "REPLACE" \
    --acl "public-read" \
    "." "s3://$YTTEST_BUCKET/$CODE_DIR/"

  # JS; short cache
  aws s3 sync \
    --cache-control "max-age=${FIVE_DAYS}" \
    --content-type "text/javascript" \
    --exclude "*" \
    --include "*.js" \
    --metadata "{${CSP}, ${HSTS}, ${TYPE}, ${XSS}, ${REFERRER}}" \
    --metadata-directive "REPLACE" \
    --acl "public-read" \
    "." "s3://$YTTEST_BUCKET/$CODE_DIR/"

  # Everything else; long cache
  aws s3 sync \
    --delete \
    --exclude "test-materials/*" \
    --cache-control "max-age=${ONE_YEAR}, immutable" \
    --metadata "{${CSPSTATIC}, ${HSTS}, ${TYPE}, ${XSS}, ${REFERRER}}" \
    --metadata-directive "REPLACE" \
    --acl "public-read" \
    "." "s3://$YTTEST_BUCKET/$CODE_DIR/"
}

_download_and_prepare_media_files() {

  TO_BE_DOWNLOADED=(
    'https://storage.googleapis.com/ytlr-cert.appspot.com/test-materials/YTS-media-files.tar.gz'
  )

  for i in "${TO_BE_DOWNLOADED[@]}"; do
    wget -c "$i"
    tar zxvf "${i##*/}"
    rm -fv "${i##*/}"
  done

}

deploy_media_files() {

  _download_and_prepare_media_files

  # Media files; long cache
  aws s3 sync \
    --delete \
    --cache-control "max-age=${ONE_YEAR}, immutable" \
    --metadata "{${CSPSTATIC}, ${HSTS}, ${TYPE}, ${XSS}, ${REFERRER}}" \
    --metadata-directive "REPLACE" \
    --acl "public-read" \
    test-materials/ "s3://$YTTEST_BUCKET/$CODE_DIR/test-materials/"
}

main "$@"
