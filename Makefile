.PHONY: buildgateway dev deploy deployAPI

buildgateway:
	docker build --build-arg APP=api-gateway -t api-gateway .

deployAPI:
	kubectl apply -f ./dist/apps/api-gateway/src/deployment.json
	kubectl apply -f ./dist/apps/api-gateway/src/services.json
	minikube service api-gateway-service --url

dev:
	docker-compose -f docker-compose-dev.yaml up --build -V

deploy:
	docker-compose up -d
