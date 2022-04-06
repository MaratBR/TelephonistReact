#!/bin/sh

/bin/dockerize -template index.html.tmpl:/dist/index.html
/bin/confd -onetime -backend env

if [ $? -ne 0 ] 
then
  echo "CONFD failed"
  exit 1
fi

exec /usr/sbin/nginx -g 'daemon off;'