#!/bin/bash

#  AUTOMATED CODE PULLER

set -ex


cd /home/ubuntu/sampler_infinite-frontend || {
 echo "Failed to cd into repo directory"
 exit 1
}

echo "Current directory: $(pwd)"
echo "Running git pull..."

REMOTE=prod
BRANCH=main

while true; do
    git fetch $REMOTE $BRANCH

    LOCAL_HASH=$(git rev-parse $BRANCH)
    REMOTE_HASH=$(git rev-parse $REMOTE/$BRANCH)

    echo "Local hash: $LOCAL_HASH"
    echo "Remote hash: $REMOTE_HASH"

        if [ "$LOCAL_HASH" != "$REMOTE_HASH" ]; then
        echo "[$(date)] New commit detected. Pulling..."
        git pull --ff-only $REMOTE $BRANCH

        cd frontend || {
            echo "Failed to cd into frontend"
            exit 1
        }

        echo "Installing dependencies..."
        npm install

        echo "Running build..."
        npm run build

        echo "Finished!"

        cd ..
    fi

    sleep 60
done
