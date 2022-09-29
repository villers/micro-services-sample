# micro-services-sample

## Start with docker

```bash
docker-compose up
```

## Start with k8s

```bash
kubectl apply -f utils
skaffold dev
```

## Bench k8s

scale to 3 pods

```bash
echo "GET http://localhost:2000/ping" | vegeta attack -rate=180/s | vegeta encode >! results.json
vegeta report results.json
vegeta plot results.json >! result.html && open result.html
```

## Resources

[skaffold](https://skaffold.dev/)
