VERSION ?= 0.1.0dev
IMAGE = maratbr/telephonist-admin

docker-image:
	docker build \
		-t maratbr/telephonist-admin:latest-proxy \
		-t maratbr/telephonist-admin:$(VERSION)-proxy \
		-f ./docker/Dockerfile.proxy .
	docker build \
		-t maratbr/telephonist-admin:latest \
		-t maratbr/telephonist-admin:$(VERSION) \
		-f ./docker/Dockerfile .

run-docker-image:
	docker run \
		-p 5000:80 \
		-e API_URL=https://google.com \
		-e NGINX_SERVER_NAME=localhost \
		maratbr/telephonist-admin:$(VERSION)

publish: 
	docker push maratbr/telephonist-admin:$(VERSION)
	docker push maratbr/telephonist-admin:$(VERSION)-proxy
	docker push maratbr/telephonist-admin:latest-proxy
	docker push maratbr/telephonist-admin:latest