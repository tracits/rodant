# Deployment

Clone the repo. In the repo, install the node environment

    nodeenv env
    
Now follow the readme's instruction on build and deploy, then start the application with pm2

    pm2 start build/
  
# Monitoring
Bonus points on connecting it to pm2.io for monitoring

  pm2 link <secret> <key> pantanal
  
# Pre-reqs for the server

The server needs pip/nodeenv/pm2

    pip install nodeenv
    npm install pm2 -g
    
    
