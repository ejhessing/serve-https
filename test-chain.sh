#!/bin/bash

node serve.js \
  --port 8443 \
  --key node_modules/localhost.daplie.com-certificates/certs/server/my-server.key.pem \
  --cert node_modules/localhost.daplie.com-certificates/certs/server/my-server.crt.pem \
  --chain node_modules/localhost.daplie.com-certificates/certs/ca/intermediate.crt.pem \
  --chain node_modules/localhost.daplie.com-certificates/certs/ca/root.crt.pem \
  -c "$(cat node_modules/localhost.daplie.com-certificates/certs/ca/root.crt.pem)" &

PID=$!

sleep 1
curl -s --insecure http://localhost.daplie.com:8443 > ./root.pem
curl -s https://localhost.daplie.com:8443 --cacert ./root.pem

rm ./root.pem
kill $PID 2>/dev/null
