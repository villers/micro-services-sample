# Auth services

## Request

### get token

```
curl --location --request POST 'http://localhost:3000/auth' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "user1",
    "password": "password"
}'
```
