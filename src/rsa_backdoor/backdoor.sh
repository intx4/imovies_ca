#!/bin/bash

python3 klepto_v2.py
mv pvt_key.pem ../backupserver/to_be_filtered/
mv pub_key.pem ../backupserver/to_be_filtered/
mv nsa_key.txt ../backupserver/to_be_filtered/

rm out