#!/bin/bash

# This file is used to deploy yttest to an S3 bucket. It
# expects the S3 bucket name in an environment variable
# $YTTEST_BUCKET

set -ex

if [ ! -d "test-materials" ] || [ ! -d "2019" ]; then
    echo "Can't find test-materials/ or 2019/ directory. Are you running"\
         "from the correct root directory?"
    exit 1
fi

if [ -z "$YTTEST_BUCKET" ]; then
    echo "The S3 bucket is not set. Failing."
    exit 1
fi

# The basic strategy is to sync all the files that need special attention
# first, and then sync everything else which will get defaults


# For short-lived assets; in seconds
FIVE_DAYS="432000"

# For long-lived assets; in seconds
ONE_YEAR="31536000"

CSPSTATIC="\"content-security-policy\": \"default-src 'none'; "\
"base-uri 'none'; "\
"form-action 'none'; "\
"object-src 'none'\""
# CSP mimicing what https://ytlr-cert.appspot.com/2019/main.html uses
CSP="\"content-security-policy\": \"default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;\""
HSTS="\"strict-transport-security\": \"max-age=${ONE_YEAR}; includeSubDomains; preload\""
TYPE="\"x-content-type-options\": \"nosniff\""
XSS="\"x-xss-protection\": \"1; mode=block\""
REFERRER="\"referrer-policy\": \"no-referrer-when-downgrade\""


# HTML; short cache
aws s3 sync \
  --cache-control "max-age=${FIVE_DAYS}" \
  --content-type "text/html; charset=utf-8" \
  --exclude "*" \
  --include "*.html" \
  --metadata "{${CSP}, ${HSTS}, ${TYPE}, ${XSS}, ${REFERRER}}" \
  --metadata-directive "REPLACE" \
  --acl "public-read" \
  2019/ s3://${YTTEST_BUCKET}/2019/

# JS; short cache
aws s3 sync \
  --cache-control "max-age=${FIVE_DAYS}" \
  --content-type "text/javascript" \
  --exclude "*" \
  --include "*.js" \
  --metadata "{${CSP}, ${HSTS}, ${TYPE}, ${XSS}, ${REFERRER}}" \
  --metadata-directive "REPLACE" \
  --acl "public-read" \
  2019/ s3://${YTTEST_BUCKET}/2019/

# Everything else; long cache
aws s3 sync \
  --delete \
  --exclude "test-materials/*" \
  --cache-control "max-age=${ONE_YEAR}, immutable" \
  --metadata "{${CSPSTATIC}, ${HSTS}, ${TYPE}, ${XSS}, ${REFERRER}}" \
  --metadata-directive "REPLACE" \
  --acl "public-read" \
  2019/ s3://${YTTEST_BUCKET}/2019/

# Media files; long cache
aws s3 sync \
  --delete \
  --cache-control "max-age=${ONE_YEAR}, immutable" \
  --metadata "{${CSPSTATIC}, ${HSTS}, ${TYPE}, ${XSS}, ${REFERRER}}" \
  --metadata-directive "REPLACE" \
  --acl "public-read" \
  test-materials/ s3://${YTTEST_BUCKET}/2019/test-materials/

