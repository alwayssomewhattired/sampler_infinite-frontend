#!/bin/bash

cd ./sampler_infinite-frontend || exit

REMOTE=prod
BRANCH=main

while true; do
    git fetch $REMOTE $BRANCH

    LOCAL_HASH=$(git rev-parse $BRANCH)
    REMOTE_HASH=$(git rev-parse $REMOTE/$BRANCH)

    if [ "$LOCAL_HASH" != "$REMOTE_HASH" ]; then
        echo "[$(date)] New commit detected. Pulling..."
        git pull $REMOTE $BRANCH
    fi

    sleep 60
done
