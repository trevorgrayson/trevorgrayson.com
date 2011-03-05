#!/bin/bash
read -p "What domain would you like to deploy to?" DOMAIN

WAR=deployment-`date +%Y%m%d-%k%M`.tar 
DIR=`basename $PWD`
PUT_DIR=/srv/www/vhosts/
tar -C .. -cf /tmp/$WAR $DIR
scp /tmp/$WAR root@$DOMAIN:$PUT_DIR
ssh root@$DOMAIN "cd $PUT_DIR; tar xf $WAR"
