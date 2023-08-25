#!/bin/sh

# Function to build a package
build_package() {
    cd "$1"
    yarn install
    yarn run build
}

yarn config set -H enableImmutableInstalls false

yarn install
yarn up @openmrs/openmrs-form-engine-lib@next

(build_package "./packages/esm-patient-chart-app/") &
(build_package "./packages/esm-patient-attachments-app/") &

# Wait for background build processes to finish
wait
