ARG GEOSERVER_VERSION=2.18.2

FROM oscarfonts/geoserver:${GEOSERVER_VERSION}

# Instala los plugins
RUN mkdir -p /var/local/geoserver-exts \
    && wget -q -O /tmp/authkey-plugin.zip \
       https://sourceforge.net/projects/geoserver/files/GeoServer/${GEOSERVER_VERSION}/extensions/geoserver-${GEOSERVER_VERSION}-authkey-plugin.zip/download \
    && unzip /tmp/authkey-plugin.zip -d /var/local/geoserver-exts/authkey-plugin \
    && rm /tmp/authkey-plugin.zip \
    \
    && wget -q -O /tmp/control-flow-plugin.zip \
       https://sourceforge.net/projects/geoserver/files/GeoServer/${GEOSERVER_VERSION}/extensions/geoserver-${GEOSERVER_VERSION}-control-flow-plugin.zip/download \
    && unzip /tmp/control-flow-plugin.zip -d /var/local/geoserver-exts/control-flow-plugin \
    && rm /tmp/control-flow-plugin.zip \
    \
    && wget -q -O /tmp/querylayer-plugin.zip \
       https://sourceforge.net/projects/geoserver/files/GeoServer/${GEOSERVER_VERSION}/extensions/geoserver-${GEOSERVER_VERSION}-querylayer-plugin.zip/download \
    && unzip /tmp/querylayer-plugin.zip -d /var/local/geoserver-exts/querylayer-plugin \
    && rm /tmp/querylayer-plugin.zip

EXPOSE 8080
