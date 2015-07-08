serve-https
===========

A simple HTTPS static file server with valid TLS (SSL) certs.

Comes bundled a valid certificate for localhost.daplie.com,
which is great for testing and development, and you can specify your own.

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

* `--key /path/to/privkey.pem` specifies the server private key
* `--cert /path/to/cert.pem` specifies the server certificate
* `--chain /path/to/chain.pem` specifies the certificate authorities

Note: `--chain` may specify single cert, a bundle, and may be used multiple times like so:

```
--chain /path/to/intermediate-ca-1.pem --chain /path/to/intermediate-ca-2.pem
```

Other options:

* `--serve-chain true` alias for `-c` with the contents of chain.pem
* `--servername example.com` changes the servername logged to the console
* `--letsencrypt-certs example.com` sets and key, cert, and chain to standard letsencrypt locations

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

In case you didn't know, you can get free https certificates from
[letsencrypt.org](https://letsencrypt.org)
(ACME letsencrypt)
and even a free subdomain from <https://freedns.afraid.org>.

If you want to quickly test the certificates you installed,
you can do so like this:

```bash
sudo serve-https -p 8443 \
  --letsencrypt-certs test.mooo.com \
  --serve-chain true
```

which is equilavent to

```bash
sudo serve-https -p 8443 \
  --servername test.mooo.com
  --key /etc/letsencrypt/live/test.mooo.com/privkey.pem \
  --cert /etc/letsencrypt/live/test.mooo.com/cert.pem \
  --chain /etc/letsencrypt/live/test.mooo.com/chain.pem \
  -c "$(cat 'sudo /etc/letsencrypt/live/test.mooo.com/chain.pem')"
```

and can be tested like so

```bash
curl --insecure https://test.mooo.com:8443 > ./chain.pem
curl https://test.mooo.com:8843 --cacert ./chain.pem
```

* [QuickStart Guide for Let's Encrypt](https://coolaj86.com/articles/lets-encrypt-on-raspberry-pi/)
* [QuickStart Guide for FreeDNS](https://coolaj86.com/articles/free-dns-hosting-with-freedns-afraid-org.html)
