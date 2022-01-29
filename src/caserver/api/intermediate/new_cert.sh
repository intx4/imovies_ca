#!/bin/bash
# use new_cert.sh <uid> <serial> <first_run>
conf=/etc/ca/intermediate/private/intermediate_TptH4q9UHLsF85hGGASK.cnf
rm /etc/ca/intermediate/serial
rm /etc/ca/intermediate/serial*
rm /etc/ca/intermediate/index.txt
rm /etc/ca/intermediate/index.txt*intermediate_TptH4q9UHLsF85hGGASK.cnf
rm -r /etc/ca/intermediate/newcerts
mkdir -p /etc/ca/intermediate/newcerts
echo "$2" > /etc/ca/intermediate/serial
touch /etc/ca/intermediate/index.txt
openssl genrsa -out /etc/ca/intermediate/certificates/client.key
openssl req -config "$conf" -key /etc/ca/intermediate/certificates/client.key -new -sha256 -out /etc/ca/intermediate/certificates/client.csr -subj "/C=CH/ST=VD/L=Lausanne/O=IMovies/OU=CA/CN=$1_$2/emailAddress=$3"
openssl ca -config "$conf" -extensions usr_cert -days 365 -notext -md sha256 -in /etc/ca/intermediate/certificates/client.csr -out /etc/ca/intermediate/certificates/client.pem -batch
openssl pkcs12 -export -in /etc/ca/intermediate/certificates/client.pem -inkey /etc/ca/intermediate/certificates/client.key -out /etc/ca/intermediate/certificates/tmp_cert.p12 -password pass:pass
openssl rsautl -encrypt -inkey /etc/ca/intermediate/backup.pem -pubin -in /etc/ca/intermediate/certificates/client.key -out /etc/ca/intermediate/certificates/tmp_cert.enc
rm /etc/ca/intermediate/certificates/client.key
rm /etc/ca/intermediate/certificates/client.pem
rm /etc/ca/intermediate/certificates/client.csr
