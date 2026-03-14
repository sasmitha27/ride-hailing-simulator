Steps to connect `ceylontravo.grewhouse.com` to this server and enable HTTPS

1) Point DNS
- Create an A record for `ceylontravo.grewhouse.com` pointing to your server's public IP.
- Wait for DNS to propagate (can take minutes to hours).

2) Install Nginx & Certbot on the host (Ubuntu/Debian example)

```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx
```

3) Create webroot directory for ACME challenge

```bash
sudo mkdir -p /var/www/letsencrypt
sudo chown -R $USER:www-data /var/www/letsencrypt
sudo chmod 755 /var/www/letsencrypt
```

4) Copy the provided Nginx site file
- Copy `deploy/nginx/ceylontravo.grewhouse.com.conf` to `/etc/nginx/sites-available/ceylontravo.grewhouse.com`

```bash
sudo cp deploy/nginx/ceylontravo.grewhouse.com.conf /etc/nginx/sites-available/ceylontravo.grewhouse.com
sudo ln -s /etc/nginx/sites-available/ceylontravo.grewhouse.com /etc/nginx/sites-enabled/
```

5) Test and reload Nginx

```bash
sudo nginx -t
sudo systemctl reload nginx
```

6) Obtain TLS certificate with Certbot (automatically edits nginx conf)

```bash
sudo certbot --nginx -d ceylontravo.grewhouse.com
```

If `--nginx` fails, use the webroot method:

```bash
sudo certbot certonly --webroot -w /var/www/letsencrypt -d ceylontravo.grewhouse.com
# Then create an ssl-enabled nginx server block pointing to the cert files:
# /etc/letsencrypt/live/ceylontravo.grewhouse.com/fullchain.pem
# /etc/letsencrypt/live/ceylontravo.grewhouse.com/privkey.pem
```

7) Open firewall ports

```bash
# UFW example
sudo ufw allow 80
sudo ufw allow 443
sudo ufw reload
```

8) Verify

- Open https://ceylontravo.grewhouse.com in the browser. The site should load (frontend served by docker on host port 8081).
- Check backend API at https://ceylontravo.grewhouse.com/api/ (proxied to host port 3001).

Optional: Use a Docker-based reverse proxy (Caddy or Traefik) instead of host Nginx. If you want this, I can add a `caddy` service to `docker-compose.yml` and route domain directly inside the docker network (automated TLS).
