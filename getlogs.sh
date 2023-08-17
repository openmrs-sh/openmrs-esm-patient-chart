#!/bin/bash

# Run yarn install command and capture its output
yarn_output=$(yarn install --immutable 2>&1)

# Extract the build log file path from the yarn output
all_logs=$(echo "$yarn_output" | sed -n 's/.*logs can be found here: \(.*\))/\1/p'| cut -d ' ' -f 5)
log_file_path=$(echo "$all_logs" | grep -m 1 '\S*\.log$')

echo $log_file_path

if [ -z "$log_file_path" ]; then
  echo "Log file path not found."
  exit 1
fi

# Read and print the contents of the build log file
if [ -f "$log_file_path" ]; then
  cat "$log_file_path"
else
  echo "Log file not found."
fi

