#!/bin/bash

set -e

YTTEST_BUCKET=${{ secrets.YTTEST_BUCKET_PROD }} 

# Define variables
TO_BE_DOWNLOADED=(
  "https://storage.googleapis.com/ytlr-cert.appspot.com/test-materials/YTS-media-files.tar.gz"
)

YTTEST_BUCKET="your-bucket-name" # Replace with your actual bucket name
ONE_YEAR=$((365*24*60*60))  # Cache duration
CSPSTATIC="Content-Security-Policy header"
HSTS="Strict-Transport-Security header"
TYPE="Content-Type header"
XSS="X-XSS-Protection header"
REFERRER="Referrer-Policy header"

# Function to download and prepare media files
_download_and_prepare_media_files() {
  for i in "${TO_BE_DOWNLOADED[@]}"; do
    echo "Downloading $i..."
    curl -O -C - "$i"
    tar zxvf "${i##*/}"
    rm -fv "${i##*/}"
  done
}

# Function to deploy media files to Google Cloud Storage
deploy_media_files() {
  _download_and_prepare_media_files

  echo "Deploying media files to Google Cloud Storage..."
  
  gsutil \
    -h "cache-control: max-age=${ONE_YEAR}, immutable" \
    -h "$CSPSTATIC" \
    -h "$HSTS" \
    -h "$TYPE" \
    -h "$XSS" \
    -h "$REFERRER" \
    -m \
    rsync \
    -R \
    -d \
    "./test-materials/" "gs://$YTTEST_BUCKET/test-materials/"
}

# Run the deployment
deploy_media_files
