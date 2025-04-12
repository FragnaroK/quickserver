#!/usr/bin/bash


function handle_dist() {
    if [ -d "./dist" ]; then
        echo "directory \"./dist\" exists - removing it"
        rm -rf ./dist
    fi
}



handle_dist && \
tsc
# sleep 2 && \
# pnpm build:types
