openssl genrsa -out nginx-selfsigned.key 2048
openssl req -new -out nginx-selfsigned.csr -key nginx-selfsigned.key -config openssl.cnf
openssl x509 -req -days 3650 -in nginx-selfsigned.csr -signkey nginx-selfsigned.key -out nginx-selfsigned.crt -extensions v3_req -extfile openssl.cnf