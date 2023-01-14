#!/bin/bash

# Storing input
DB="$1"
SRV=$DB

echo "Mongo backup in progress..."

# Backing up mongo database:
# 1. Creating mongo backup folder in  a tmp directory
#mongodump --db $DB --out /home/backupScripts/backupTmp/`date +"db-%m-%d-%y"`

# 2. Zipping the mongo directory into the backup folder and deleting the tmp directory
#tar -cvzpf /home/backupScripts/arvandBackup/`date +"db-%m-%d-%y.tar.gz"` /home/backupScripts/backupTmp/`date +"db-%m-%d-%y"`

#rm -rf /home/backupScripts/backupTmp/`date +"db-%m-%d-%y"`

#echo "Mongo backup done."

#echo "Server files backup in progress..."

# Backing up server files

tar --exclude="node_modules" -cvzpf ../nodeeweb-server.tar  ./*

echo "Server files backup done."

# Transfering files to the other server
echo "Transfering files to the other server..."
source sftpTest.sh root 194.147.142.65 /home/nodeeweb_modules/node_modules/@nodeeweb/server/


echo "Removing backup files on client server..."
#rm -rf arvandBackup
#mkdir arvandBackup
echo "Backup files removal done."

DATE=`date +"db-%m-%d-%y"`

#echo "This backup was created on $DATE" >> backupLogs/backupLog${DATE}.txt

exit 0
