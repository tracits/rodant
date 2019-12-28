# Deployment
Become the data-collection-tool user

    su data-collection-tool

Clone the repo. 

In the repo, install the node environment

    nodeenv env
    
Now follow the readme's instruction on build and deploy, then start the application with pm2

    pm2 start node_modules/react-scripts/scripts/start.js --name "data-collection-tool"

Create systemd config for restarts

    pm2 startup systemd
    
Then run the output as root.
  
# Monitoring
Bonus points on connecting it to pm2.io for monitoring

    pm2 link <secret> <key> pantanal
  
# Pre-reqs for the server

The server needs pip/nodeenv/pm2

    pip install nodeenv
    npm install pm2 -g
    
    
