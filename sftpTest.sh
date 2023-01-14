#!/bin/bash
#
# Description:
# Get user, remote server, source directory with absolute path and
# remote directory details as input to sync the latest added files
# with remote server
#
# Use batch file with SFTP shell script without prompting password
# using SFTP authorized_keys
#
##################################################################
# Create SFTP batch file
tempfile="./sftpsync.$$"
count=0

trap "/bin/rm -f $tempfile" 0 1 15

if [ $# -eq 0 ] ; then
  echo "Usage: $0 user host path_to_src_dir remote_dir" >&2
  exit 1
fi

# Collect User Input
user="$1"
server="$2"
remote_dir="$4"
source_dir="$3"
srv_name="$5"
# timestamp="$source_dir/.timestamp"

# Without source and remote dir, the script cannot be executed
if [[ -z $remote_dir ]] || [[ -z $source_dir ]]; then
   echo "Provide source and remote directory both"
   exit 1
fi

echo "cd $remote_dir" >> $tempfile

folder=${srv_name}backup
# Creating backup folder for the given server name
#if [ -d "$folder"  ] ; then

echo "cd $folder" >> $tempfile

#else
#	echo "mkdir $folder" >> $tempfile
#	echo "cd $folder" >> $tempfile
#fi

# create a directory based on date
DIRNAME=`date +"backup-%m-%d-%y"`
echo "mkdir $DIRNAME" >> $tempfile
echo "cd $DIRNAME" >> $tempfile

  # Upload all files
for filename in $source_dir/*
do
    if [ -f "$filename" ] ; then
      # Place the command to upload files in sftp batch file
      echo "put -P \"$filename\"" >> $tempfile
      # Increase the count value for every file found
      #count=$(( $count + 1 ))
    fi
done
# Place the command to exit the sftp connection in batch file
echo "quit" >> $tempfile

echo "Synchronizing: Found $count files in local folder to upload."
# Main command to use batch file with SFTP shell script without prompting password
sftp -b $tempfile -oPort=2222 "$user@$server"
echo "Done. All files synchronized up with $server"
# Create timestamp file once first set of files are uploaded
#touch $timestamp

# Remove the sftp batch file
rm -f $tempfile

