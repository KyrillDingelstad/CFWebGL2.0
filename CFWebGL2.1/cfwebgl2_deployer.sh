#!/bin/bash

ip="52.16.102.140"

# Deploys a file to the galssfish server
echo "Trying to deploy $1 as CFWebGL2 on server."
echo "If you see the message \"Command undeploy failed. remote failure: Application CFWebGL2 is not deployed on this target\", ignore it"
echo "" 
echo "It succeeds if you see the message \"Command deploy executed successfully\""
echo "The appliaction should then be available on $ip:8080/CFWebGL2/index.html"

inWarFile=$1
destination=CFWebGL2


scp -i cfwebgl2_test.pem $inWarFile ubuntu@$ip:~/$destination.war

ssh -i cfwebgl2_test.pem ubuntu@$ip "./glassfish4/bin/asadmin undeploy $destination"
ssh -i cfwebgl2_test.pem ubuntu@$ip "./glassfish4/bin/asadmin   deploy $destination.war"

