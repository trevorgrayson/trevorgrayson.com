HOST ?= amendment.io
DEPLOY_DIR:=/srv/vhosts/
SLUG:=tg.tgz
TEMP:=$(shell mktemp)
ARTIFACT:=dist/$(SLUG)

package:
	mkdir -p dist
	tar -J -C .. --exclude=dist --exclude=.git --exclude=*.sw* -cvf $(TEMP) trevorgrayson.com
	mv $(TEMP) $(ARTIFACT)

publish: package
	scp $(ARTIFACT) $(HOST):$(DEPLOY_DIR)
	# should have blue/green dirs and a symlink
	ssh $(HOST) "tar Jxf $(DEPLOY_DIR)$(SLUG) -C $(DEPLOY_DIR)"

deploy:
	scp nginx.conf $(HOST):/etc/nginx/sites-available/
	ln -s /etc/nginx/sites-available/$(PROJECT).conf $(DEPLOY_DIR)/$(PROJECT)/nginx.conf
	# restart nginx

clean:
	rm -rf dist
