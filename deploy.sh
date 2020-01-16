#!/bin/bash
## usage
##     deploy public-url config-path ssh-url 
## arguments
##     public-url      The URL where the tool should be deployed
##     config-path     The path to the directory where codebook.csv and config.json live
##     ssh-url         The ssh-addres where the tool should be deployed
## example
##     deploy /test/data-collection-tool/ ~/projects/data-collection-tool-config/ example@ssh.example.org:/test/data-collection-tool/
PUBLIC_URL="$1" npm run build # build for specific directory
cp "$2/codebook.csv" build/ # copy instance specific codebook
cp "$2/config.json" build/ # copy instance specicic config
(cd build; scp -r * "$3") # deploy code 
cp public/codebook.csv public/config.json build/ # overwrite instance specific codebook and config



