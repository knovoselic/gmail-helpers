#!/usr/bin/env bash

# Exit on error. Append || true if you expect an error.
set -o errexit
# Exit on error inside any functions or subshells.
set -o errtrace
# Do not allow use of undefined vars. Use ${VAR:-} to use an undefined VAR
set -o nounset
# Catch the error in case mysqldump fails (but gzip succeeds) in `mysqldump |gzip`
set -o pipefail

__dir="$(cd "$(dirname "${BASH_SOURCE[${__b3bp_tmp_source_idx:-0}]}")" && pwd)"
__file="${__dir}/$(basename "${BASH_SOURCE[${__b3bp_tmp_source_idx:-0}]}")"
__base="$(basename ${__file} .sh)"
__chrome_binary="/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome"

echo 'Packing extension...'
eval "$__chrome_binary" --pack-extension="$__dir/src/" --pack-extension-key="$__dir/build/gmail-helpers.pem"
echo 'Moving packed extension to the build directory...'
mv "$__dir/src.crx" "$__dir/build/gmail-helpers.crx"
echo 'All done.'
