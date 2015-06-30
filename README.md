localhost.daplie.com-server
===========================

Serves HTTPS using TLS (SSL) certs for localhost.daplie.com - great for testing and development.

Install
-------

```bash
npm install --global serve-https
serve-https
```

```
Serving /Users/foo/ at https://localhost.daplie.com:1443
```

Usage
-----

* `-p <port>` - i.e. `sudo serve-https -p 443`
* `-d <dirpath>` - i.e. `serve-https -d /tmp/`
* `-c <content>` - i.e. `server-https -c 'Hello, World!'`

Examples
--------

```bash
serve-https -p 1443 -c 'Hello from 1443' &
serve-https -p 2443 -c 'Hello from 2443' &
serve-https -p 3443 -d /tmp &

curl https://localhost.daplie.com:1443
> Hello from 1443

curl --insecure https://localhost:2443
> Hello from 2443

curl https://localhost.daplie.com:3443
> [html index listing of /tmp]
```
