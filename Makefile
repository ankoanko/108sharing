.PHONY: all

ROOT_DIRNAME:=$(shell basename $(CURDIR))

new:
	rails new ${ARG} -T --database postgresql -m template.rb --skip-spring --skip-turbolinks --skip-bundle --skip-coffee
testnew:
	rails new ${ARG} -T --database postgresql -m template.rb --skip-spring --skip-turbolinks --skip-bundle --skip-coffee
dev:
	bundle exec foreman start -f Procfile.dev
deploy-staging:
	git push staging master
lint:
	rubocop -a
rubocop:
	bin/rails rubocop
rspec:
	bin/rails rspec
setup:
	bundle install
	yarn
	bin/rails db:drop db:create db:migrate db:seed
migrate:
	bin/rails db:migrate
reset:
	bin/rails db:environment:set RAILS_ENV=development
	bin/rails db:drop db:create db:migrate db:seed

docker-build:
	docker-compose build
docker-bundle-install:
	docker-compose run --rm web bundle install --binstubs=/var/binstubs
docker-yarn-install:
	docker-compose run --rm web yarn install
docker-assets-precompile:
	docker-compose run --rm web rails assets:precompile
	docker-compose down
docker-setup: docker-build docker-bundle-install docker-yarn-install docker-assets-precompile
	docker-compose up -d db
	docker-compose run --rm web rails db:drop db:create db:migrate
	docker-compose run --rm web rails db:seed
	# docker-compose run --rm web bundle exec ridgepole -c config/database.yml --apply -f db/Schemafile
	docker-compose down
docker-cleanup:
	docker-compose down --rmi local --volumes --remove-orphans
up:
	docker-compose up
attach:
	docker attach (docker-compose ps -q web)
down:
	docker-compose down
system_prune:
	docker system prune
build-prod:
	docker build -t ${ROOT_DIRNAME} -f Dockerfile.production --build-arg SECRET_KEY_BASE=abcd1234abcd1234 .
build-demo:
	docker build -t ${ROOT_DIRNAME}_demo -f Dockerfile.production --build-arg SECRET_KEY_BASE=abcd1234abcd1234 .
setup-demo:
	# docker build -t 108sharing_demo -f Dockerfile.production --build-arg SECRET_KEY_BASE=abcd1234abcd1234 .
	docker-compose -f docker-compose.demo.yml -p ${ROOT_DIRNAME}_demo up -d db
	docker-compose -f docker-compose.demo.yml -p ${ROOT_DIRNAME}_demo run --rm web rails db:drop db:create
	docker-compose -f docker-compose.demo.yml -p ${ROOT_DIRNAME}_demo run --rm web rails db:migrate
	docker-compose -f docker-compose.demo.yml -p ${ROOT_DIRNAME}_demo run --rm web rails db:seed
	docker-compose -f docker-compose.demo.yml -p ${ROOT_DIRNAME}_demo up -d web
	docker-compose -f docker-compose.demo.yml -p ${ROOT_DIRNAME}_demo down
up-demo:
	docker-compose -f docker-compose.demo.yml -p ${ROOT_DIRNAME}_demo up
down-demo:
	docker-compose -f docker-compose.demo.yml -p ${ROOT_DIRNAME}_demo down
clean-demo:
	docker-compose -f docker-compose.demo.yml -p ${ROOT_DIRNAME}_demo down --rmi local --volumes --remove-orphans
cred-edit:
	bin/rails credentials:edit --environment production
heroku-staging-setup:
	heroku buildpacks:add -i 1 https://github.com/heroku/heroku-buildpack-activestorage-preview --remote staging
	heroku plugins:install heroku-config
	heroku config:push --remote staging
	heroku run rails db:migrate --remote staging
	heroku run rails db:seed --remote staging
	heroku addons:create sendgrid:starter --remote staging
	heroku addons:create heroku-redis:hobby-dev --remote staging
	heroku addons:create scheduler:standard --remote staging
	heroku addons:create papertrail --remote staging
	heroku releases:output --remote staging
	
heroku-production-setup:
	heroku-production-setup:
	heroku buildpacks:add -i 1 https://github.com/heroku/heroku-buildpack-activestorage-preview --remote production
	heroku plugins:install heroku-config
	heroku config:push --remote production
	heroku run rails db:migrate --remote production
	heroku run rails db:seed --remote production
	heroku addons:create sendgrid:starter --remote production
	heroku addons:create heroku-redis:hobby-dev --remote production
	heroku addons:create scheduler:standard --remote production
	heroku addons:create papertrail --remote production
	heroku releases:output --remote production
