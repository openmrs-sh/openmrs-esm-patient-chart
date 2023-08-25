#!/bin/sh

# Function to publish a package
publish_package() {
  cd "$1"
  npm version --legacy-peer-deps --no-git-tag-version "$(node -e "console.log(require('semver').inc(require('./package.json').version, 'patch'))")-pre.$CI_PIPELINE_ID"
  yarn npm publish --tag next
}

# Update the system and install git
apk update && apk add git

# Publish the esm-patient-chart-app package
(publish_package "./packages/esm-patient-chart-app/") &

# Publish the esm-patient-attachments-app package
(publish_package "./packages/esm-patient-attachments-app/") &

wait