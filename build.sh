#!/bin/bash
cd `dirname $0`
xsltproc --xinclude trevorgrayson.html.xsl trevorgrayson.xml > index.html
