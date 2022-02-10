#!/bin/bash
set -ex

if [ -z "$GCP_LOAD_BALANCER_NAME" ]; then
    echo "The load balancer name is not set. Failing."
    exit 1
fi

gcloud compute url-maps invalidate-cdn-cache "$GCP_LOAD_BALANCER_NAME" --path "/*"
