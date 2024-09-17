FROM httpd:2.4
 
# Diretório de trabalho no contêiner
WORKDIR /usr/local/apache2/htdocs

COPY ./src .

# Expõe a porta 80 (porta padrão do Apache)
EXPOSE 80
