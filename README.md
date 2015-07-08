serve-https
===========

Serves HTTPS using TLS (SSL) certs.

Bundles a valid certificate for localhost.daplie.com - great for testing and development.

Also great for testing ACME certs from letsencrypt.org.

Install
-------

```bash
npm install --global serve-https
serve-https
```

```
Serving /Users/foo/ at https://localhost.daplie.com:8443
```

Usage
-----

* `-p <port>` - i.e. `sudo serve-https -p 443` (defaults to 8443)
* `-d <dirpath>` - i.e. `serve-https -d /tmp/` (defaults to `pwd`)
* `-c <content>` - i.e. `server-https -c 'Hello, World! '` (defaults to directory index)
* `--insecure-port <port>` - run an http server that redirects to https (off by default)

Specifying a custom HTTPS certificate:

* `--key /path/to/privkey.pem`
* `--cert /path/to/cert.pem`
* `--chain /path/to/chain.pem`

Note: you may specify a file containing all certificate authorities or use even `--chain` multiple times such as `--chain /path/to/intermediate-ca-1.pem --chain /path/to/intermediate-ca-2.pem`

Examples
--------

```bash
serve-https -p 1443 -c 'Hello from 1443' &
serve-https -p 2443 -c 'Hello from 2443' &
serve-https -p 3443 -d /tmp --insecure-port 4080 &

curl https://localhost.daplie.com:1443
> Hello from 1443

curl --insecure https://localhost:2443
> Hello from 2443

curl https://localhost.daplie.com:3443
> [html index listing of /tmp]
```

And if you tested <http://localhost.daplie.com:4080> in a browser,
it would redirect to <https://localhost.daplie.com:3443>.

(in curl it would just show an error message)

### Testing ACME Let's Encrypt certs

You can get free https certificates from letsencrypt.org (ACME letsencrypt)
and even a free domain from https://freedns.afraid.org.

```bash
serve-https -p 8443 \
  --key /etc/letsencrypt/live/test.mooo.com/privkey.pem \
  --cert /etc/letsencrypt/live/test.mooo.com/cert.pem \
  --chain /etc/letsencrypt/live/test.mooo.com/chain.pem \
  -c "$(cat '/etc/letsencrypt/live/test.mooo.com/chain.pem')"
```

```bash
curl --insecure https://test.mooo.com:8443 > ./chain.pem
curl https://test.mooo.com:8843 --cacert ./chain.pem
```

* [QuickStart Guide for Let's Encrypt](https://coolaj86.com/articles/lets-encrypt-on-raspberry-pi/)
* [QuickStart Guide for FreeDNS](https://coolaj86.com/articles/free-dns-hosting-with-freedns-afraid-org.html)
