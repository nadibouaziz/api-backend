#!/bin/bash

# Set the configuration file path
CNF_FILE="kafka-config.cnf"

# Folder where your files will be generated 
FOLDER=secrets

# Certificate password
PASSWORD=password

# Create the certificate authority (CA)
openssl genrsa -out ${FOLDER}/ca-key.pem 2048
openssl req -x509 -new -nodes -key ${FOLDER}/ca-key.pem -days 3650 -out ${FOLDER}/ca-cert.pem -config $CNF_FILE

# Create the keystore and truststore
keytool -keystore ${FOLDER}/kafka.keystore.jks -alias kafka -validity 3650 -genkey -keyalg RSA -dname "CN=kafka,OU=My Department,O=My Company,L=San Francisco,ST=California,C=US" -storepass ${PASSWORD} -keypass ${PASSWORD}

# Create a certificate signing request (CSR)
keytool -keystore ${FOLDER}/kafka.keystore.jks -alias kafka -certreq -file ${FOLDER}/cert-file.csr -storepass ${PASSWORD}

# Sign the certificate with the CA
openssl x509 -req -CA ${FOLDER}/ca-cert.pem -CAkey ${FOLDER}/ca-key.pem -in ${FOLDER}/cert-file.csr -out ${FOLDER}/cert-signed.pem -days 3650 -CAcreateserial -passin pass:${PASSWORD}

# Import the CA certificate into the keystore
keytool -keystore ${FOLDER}/kafka.keystore.jks -alias CARoot -import -file ${FOLDER}/ca-cert.pem -storepass ${PASSWORD} -noprompt

# Import the signed certificate into the keystore
keytool -keystore ${FOLDER}/kafka.keystore.jks -alias kafka -import -file ${FOLDER}/cert-signed.pem -storepass ${PASSWORD} -noprompt

# Create the truststore and import the CA certificate
keytool -keystore ${FOLDER}/kafka.truststore.jks -alias CARoot -import -file ${FOLDER}/ca-cert.pem -storepass ${PASSWORD} -noprompt

# Create file containing the private key
openssl pkcs12 -in ${FOLDER}/kafka.keystore.jks -nocerts -out ${FOLDER}/client-key.pem -passin pass:${PASSWORD} -passout pass:${PASSWORD}


# Create the secret file for keystore and truststore passwords
echo ${PASSWORD} > ${FOLDER}/kafka.secret.txt
