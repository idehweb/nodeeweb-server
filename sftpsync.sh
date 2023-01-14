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

timestamp="$source_dir/.timestamp"

# Without source and remote dir, the script cannot be executed
if [[ -z $remote_dir ]] || [[ -z $source_dir ]]; then
   echo "Provide source and remote directory both"
   exit 1
fi

echo "cd $remote_dir" >> $tempfile
# timestamp file will not be available when executed for the very first time
if [ ! -f $timestamp ] ; then
  # no timestamp file, upload all files
  for filename in $source_dir/*
  do
    if [ -f "$filename" ] ; then
      # Place the command to upload files in sftp batch file
      echo "put -P \"$filename\"" >> $tempfile
      # Increase the count value for every file found
      count=$(( $count + 1 ))
    fi
  done
else
  # If timestamp file found then it means it is not the first execution so look out for newer files only
  # Check for newer files based on the timestamp
  for filename in $(find $source_dir -newer $timestamp -type f -print)
  do
    # If found newer files place the command to upload these files in batch file
    echo "put -P \"$filename\"" >> $tempfile
    # Increase the count based on the new files
    count=$(( $count + 1 ))
  done
fi
# If no new files found the do nothing
if [ $count -eq 0 ] ; then
  echo "$0: No files require uploading to $server" >&2
  exit 1
fi
# Place the command to exit the sftp connection in batch file
echo "quit" >> $tempfile

echo "Synchronizing: Found $count files in local folder to upload."
# Main command to use batch file with SFTP shell script without prompting password
sftp -b $tempfile -oPort=2222 "$user@$server"
echo "Done. All files synchronized up with $server"
# Create timestamp file once first set of files are uploaded
touch $timestamp

# Remove the sftp batch file
rm -f $tempfile

