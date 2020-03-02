#!/bin/bash
echo "\n";

green=$(tput setaf 2)
bold=$(tput bold)
normal=$(tput sgr0)

REDIS_NAME="gx-acc-redis-test-enviroment"
GCS_NAME="gx-acc-fakegcs"

initDocker() {
  NAME=$1
  IMAGE=$2
  CMD=$3

  docker kill $NAME >&- 2>&-
  docker rm $NAME >&- 2>&-
  if [ -z "$CMD" ]
  then
    docker run --name $NAME -d $IMAGE >&- 2>&-
  else
    $(docker run --name $NAME $CMD -d $IMAGE) >&- 2>&-
  fi
 
  HOST=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $NAME) &&

  echo "$bold*** $NAME host:$bold$green $HOST $normal$bold***$normal\n";
}

initDocker $REDIS_NAME "redis"
# initDocker $GCS_NAME "fsouza/fake-gcs-server" "-p 4443:4443 -v $PWD/data"

curl --insecure -X POST -d '{"name": "ppictures"}' \
     -H "Content-Type: application/json" \
     "https://172.17.0.3:4443/storage/v1/b?project=gx-account-service" >&- 2>&-

firebase serve --only firestore & firestore_emulator_pid=$!

# node ./test/seed.js & 

echo "${bold}Firestore emulator PID: $firestore_emulator_pid ${normal}\n"
echo "*** Press enter to close the services ***\n"

read any

echo "killing firestore emulator process"
kill $(ps aux | grep "firestore-emulator" | grep -v 'grep' | awk '{print $2}')

docker kill $REDIS_NAME >&- 2>&-
docker kill $GCS_NAME >&- 2>&-

exit;