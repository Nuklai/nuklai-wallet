#!/usr/bin/env bash
# Copyright (C) 2024, Nuklai. All rights reserved.
# See the file LICENSE for licensing terms.

set -o errexit
set -o nounset
set -o pipefail

# Set the CGO flags to use the portable version of BLST
export CGO_CFLAGS="-O -D__BLST_PORTABLE__"  CGO_ENABLED=1

# Install wails
go install -v github.com/wailsapp/wails/v2/cmd/wails@v2.8.2
