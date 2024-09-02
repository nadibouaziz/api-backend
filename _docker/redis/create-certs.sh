FOLDER=certs

mkdir ${FOLDER}

openssl genrsa -out ${FOLDER}/ca.key 2048
openssl req -x509 -new -nodes -key ${FOLDER}/ca.key -sha256 -days 365 -out ${FOLDER}/ca.crt -config openssl.cnf
openssl genrsa -out ${FOLDER}/redis-server.key 2048
openssl req -new -key ${FOLDER}/redis-server.key -out ${FOLDER}/redis-server.csr -config server.cnf
openssl x509 -req -in ${FOLDER}/redis-server.csr -CA ${FOLDER}/ca.crt -CAkey ${FOLDER}/ca.key -CAcreateserial -out ${FOLDER}/redis-server.crt -days 365 -sha256 -extfile server.cnf -extensions v3_req

chmod 600 ${FOLDER}/*.key
chmod 644 ${FOLDER}/*.crt
