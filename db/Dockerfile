# FROM postgres:12.3-alpine
FROM postgres:9.6.22-alpine3.14
# FROM ntboes/postgres-uuid:latest

COPY migrations/*.sql /docker-entrypoint-initdb.d/

RUN chmod a+r /docker-entrypoint-initdb.d/*.sql