#!/usr/bin/env sh
# Pull the myownokf ontology submodule up to the latest published main.
set -e
cd "$(git rev-parse --show-toplevel)"
git submodule update --init --remote ontology/myownokf
echo "ontology now at $(git -C ontology/myownokf rev-parse --short HEAD)"
