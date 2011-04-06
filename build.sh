#!/bin/bash
cd /srv/www/vhosts/trevorgrayson.com
curl https://feeds.foursquare.com/history/1049fd6217aedd34625ab9db9644f0ef.kml > foursquare.kml
xsltproc --xinclude trevorgrayson.html.xsl trevorgrayson.xml > index.html
