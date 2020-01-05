# CCApiServer
## Configuration
`openssl genrsa -out var/jwt/private.pem -aes256 4096`
`openssl rsa -pubout -in var/jwt/private.pem -out var/jwt/public.pem`

## Start WEB SOCKET Server
`bin/console thruway:process start`