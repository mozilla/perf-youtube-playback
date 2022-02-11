#!/bin/bash

# This file is used to deploy yttest to an GCS bucket. It
# expects the GCS bucket name in the environment variable
# $YTTEST_BUCKET

set -ex

main() {
  # For short-lived assets; in seconds
  FIVE_DAYS="432000"

  # For long-lived assets; in seconds
  ONE_YEAR="31536000"

  CSPSTATIC="x-goog-meta-content-security-policy: default-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors: 'none'; object-src 'none'"
  CSP="x-goog-meta-content-security-policy: default-src 'none'; img-src 'self' data:; media-src 'self' blob:; script-src 'self' 'unsafe-inline'; font-src 'self'; frame-ancestors 'none'; base-uri 'none'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://dash-mse-test.appspot.com"
  HSTS="x-goog-meta-strict-transport-security: max-age=${ONE_YEAR}; includeSubDomains; preload"
  TYPE="x-goog-meta-x-content-type-options: nosniff"
  XSS="x-goog-meta-x-xss-protection: 1; mode=block"
  REFERRER="x-goog-meta-referrer-policy: no-referrer-when-downgrade"

  if [ -z "$YTTEST_BUCKET" ]; then
      echo "The GCS bucket is not set. Failing."
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
    add-gcp-deploy)
      CODE_DIR=2020
    ;;
    * )
      echo "Unrecognized branch name \`$CIRCLE_BRANCH'." 1>&2
      exit 1
  esac

  case "$1" in
    code)
      if [ -z "$CODE_DIR" ]; then
        echo "The CODE_DIR value is not set, unknown branch: \`$CIRCLE_BRANCH'."
        exit 1
      fi
      deploy_code
    ;;
    media)
      deploy_media_files
    ;;
    *)
      echo "Unrecognized deploying target \`$1'. Try \"code\" or \"media\"." 1>&2
      exit 1
    ;;
  esac
}

deploy_code() {

  # The basic strategy is to sync all the files that need special attention
  # first, and then sync everything else which will get defaults
  #
  # Note that we use single quotes below for the regex pattern so that we don't
  # have to deal with history expansion in shell.

  # HTML; short cache
  gsutil                                        \
    -h "cache-control: max-age=${FIVE_DAYS}"    \
    -h "content-type: text/html; charset=utf-8" \
    -h "$CSP"                                   \
    -h "$HSTS"                                  \
    -h "$TYPE"                                  \
    -h "$XSS"                                   \
    -h "$REFERRER"                              \
    -m                                          \
    rsync                                       \
    -R                                          \
    -J                                          \
    -a public-read                              \
    -x '.*(?<!\.html)$'                         \
    "./$CODE_DIR/" "gs://$YTTEST_BUCKET/$CODE_DIR/"

  # JS; short cache
  gsutil                                        \
    -h "cache-control: max-age=${FIVE_DAYS}"    \
    -h "content-type: text/javascript"          \
    -h "$CSP"                                   \
    -h "$HSTS"                                  \
    -h "$TYPE"                                  \
    -h "$XSS"                                   \
    -h "$REFERRER"                              \
    -m                                          \
    rsync                                       \
    -R                                          \
    -J                                          \
    -a public-read                              \
    -x '.*(?<!\.js)$'                           \
    "./$CODE_DIR/" "gs://$YTTEST_BUCKET/$CODE_DIR/"

  # Everything else; long cache
  gsutil                                                \
    -h "cache-control: max-age=${ONE_YEAR}, immutable"  \
    -h "$CSPSTATIC"                                     \
    -h "$HSTS"                                          \
    -h "$TYPE"                                          \
    -h "$XSS"                                           \
    -h "$REFERRER"                                      \
    -m                                                  \
    rsync                                               \
    -R                                                  \
    -J                                                  \
    -d                                                  \
    -a public-read                                      \
    -x "test-materials/"                                \
    "./$CODE_DIR/" "gs://$YTTEST_BUCKET/$CODE_DIR/"
}

_download_and_prepare_media_files() {

  TO_BE_DOWNLOADED=(
    "https://storage.googleapis.com/ytlr-cert.appspot.com/test-materials/YTS-media-files.tar.gz"
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
  gsutil                                                \
    -h "cache-control: max-age=${ONE_YEAR}, immutable"  \
    -h "$CSPSTATIC"                                     \
    -h "$HSTS"                                          \
    -h "$TYPE"                                          \
    -h "$XSS"                                           \
    -h "$REFERRER"                                      \
    -m                                                  \
    rsync                                               \
    -R                                                  \
    -d                                                  \
    -a public-read                                      \
    ./test-materials/ "gs://$YTTEST_BUCKET/$CODE_DIR/test-materials/"
}

main "$@"
