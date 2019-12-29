# Setup
Become the data-collection-tool user

    su data-collection-tool

Clone the repo. 

In the repo, install the node environment

    nodeenv env
   
Point nginx to the dir (there is no need for a process manager since it's running static at this point).

```nginx data-collection-tool
server {
    listen 80;
    server_name data.titco.org;
    include /etc/nginx/snippets/letsencrypt.conf;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;

    server_name data.titco.org;
    include /etc/nginx/snippets/letsencrypt.conf;

    include ssl-harden.conf;

    ssl_certificate_key /etc/nginx/certs/data.titco.org.key;
    ssl_certificate     /etc/nginx/certs/data.titco.org-fullchain.crt;

    root /var/www/data-collection-tool/cockroach_react/build;

    index index.html;

    location / {
        satisfy any;
        auth_basic "Authentication Required";
        auth_basic_user_file /etc/nginx/auth/data;

        try_files $uri $uri/ $uri.html =404;
    }
}
```
  
# Pre-reqs for the server

The server needs pip/nodeenv/pm2

    pip install nodeenv
    npm install pm2 -g
    
    
