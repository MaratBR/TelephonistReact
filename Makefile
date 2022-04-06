VERSION ?= 0.1.0dev
IMAGE = maratbr/telephonist-admin

docker-image:
	docker build -t $(IMAGE):latest -t $(IMAGE):$(VERSION) -f ./docker/Dockerfile .

run-docker-image:
	docker run \
		-p 5000:80 \
		-e API_URL=https://google.com \
		-e NGINX_SERVER_NAME=localhost \
		$(IMAGE):$(VERSION)

publish: 
	docker push $(IMAGE):$(VERSION)