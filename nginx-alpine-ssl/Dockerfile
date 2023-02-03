# BASE
FROM alpine

RUN apk add nginx; \
    mkdir -p /run/nginx/; \
    echo "<h1>Default</h1>" > /var/www/localhost/htdocs/index.html;

# CONFIGUTATIONS
# nginx configuration
ADD ./config/default.conf /etc/nginx/http.d/default.conf
ADD ./config/*.key /etc/ssl/private/
ADD ./config/*.crt /etc/ssl/certs/
WORKDIR /var/www/localhost/htdocs

# ENTRYPOINT
COPY ./config/entrypoint.sh /usr/local/bin
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/bin/sh", "/usr/local/bin/entrypoint.sh"]
# EXPOSE PORTS
EXPOSE 80
EXPOSE 443

# RUN COMMAND
CMD ["/bin/sh", "-c", "nginx -g 'daemon off;'; nginx -s reload;"]
