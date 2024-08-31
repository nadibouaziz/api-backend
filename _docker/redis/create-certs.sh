folder=certs

mkdir ${folder}

openssl genrsa -out ${folder}/ca.key 2048
openssl req -x509 -new -nodes -key ${folder}/ca.key -sha256 -days 365 -out ${folder}/ca.crt -config openssl.cnf
openssl genrsa -out ${folder}/redis-server.key 2048
openssl req -new -key ${folder}/redis-server.key -out ${folder}/redis-server.csr -config server.cnf
openssl x509 -req -in ${folder}/redis-server.csr -CA ${folder}/ca.crt -CAkey ${folder}/ca.key -CAcreateserial -out ${folder}/redis-server.crt -days 365 -sha256 -extfile server.cnf -extensions v3_req

chmod 600 ${folder}/*.key
chmod 644 ${folder}/*.crt
