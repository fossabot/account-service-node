#!/bin/bash
echo "\n";

DOCKER_NAME="gx-acc-redis-test-enviroment"

docker kill $DOCKER_NAME >&- 2>&-
docker rm $DOCKER_NAME >&- 2>&-
docker run --name $DOCKER_NAME -d redis >&- 2>&-

export REDISHOST=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $DOCKER_NAME) &&

echo "*** Redis host: $REDISHOST ***\n";

firebase serve --only firestore & firestore_emulator_pid=$!

node ./test/seed.js & 

echo "*** Press enter to close the services ***\n"
echo "Firestore emulator PID: $firestore_emulator_pid\n"
read any

echo "killing firestore emulator process"
kill $(ps aux | grep "firestore-emulator" | grep -v 'grep' | awk '{print $2}')
docker kill $DOCKER_NAME >&- 2>&-

exit;