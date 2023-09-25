#!/bin/sh

set -e -x

printenv

# start fe
nginx &

# start be
./main
