#!/bin/bash
db="PGDATABASE=nc_news"
prepend="AUTHTOKEN="
file=.env.developmentttt

echo Please enter the token you\'d like to use for your \local development instance:

read token

echo $db > $file
echo -n $prepend >> $file

hash=`echo -n $token | sha256sum | head -c 64`

echo -n $hash >> $file