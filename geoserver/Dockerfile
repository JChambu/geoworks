FROM tomcat:9-jre17

LABEL maintainer="Oscar Fonts <oscar.fonts@geomati.co>"

ENV GEOSERVER_VERSION 2.26.1
ENV GEOSERVER_DATA_DIR /var/local/geoserver
ENV GEOSERVER_INSTALL_DIR /usr/local/geoserver
ENV GEOSERVER_EXT_DIR /var/local/geoserver-exts

ENV GEOSERVER_PATH=/geoserver

# Uncomment to use APT cache (requires apt-cacher-ng on host)
#RUN echo "Acquire::http { Proxy \"http://`/sbin/ip route|awk '/default/ { print $3 }'`:3142\"; };" > /etc/apt/apt.conf.d/71-apt-cacher-ng

# Microsoft fonts
RUN echo ttf-mscorefonts-installer msttcorefonts/accepted-mscorefonts-eula select true | debconf-set-selections
RUN set -x \
	&& apt-get update \
	&& apt-get install -yq ttf-mscorefonts-installer unzip \
	&& rm -rf /var/lib/apt/lists/*

# GeoServer
RUN mkdir -p /usr/local/tomcat/conf/Catalina/localhost/ && \
    echo "<Context path=\"${GEOSERVER_PATH}\" docBase=\"/usr/local/geoserver\"></Context>" > /usr/local/tomcat/conf/Catalina/localhost/geoserver.xml
RUN mkdir ${GEOSERVER_DATA_DIR} \
    && mkdir ${GEOSERVER_INSTALL_DIR} \
	&& cd ${GEOSERVER_INSTALL_DIR} \
	&& wget http://sourceforge.net/projects/geoserver/files/GeoServer/${GEOSERVER_VERSION}/geoserver-${GEOSERVER_VERSION}-war.zip \
	&& unzip geoserver-${GEOSERVER_VERSION}-war.zip \
	&& unzip geoserver.war \
    && mv data/* ${GEOSERVER_DATA_DIR} \
	&& rm -rf geoserver-${GEOSERVER_VERSION}-war.zip geoserver.war target *.txt

# Tomcat environment
ENV CATALINA_OPTS "-server -Djava.awt.headless=true \
	-Xms128m -Xmx1560m -XX:NewSize=48m \
	-DGEOSERVER_DATA_DIR=${GEOSERVER_DATA_DIR}"

# Create tomcat user to avoid root access.
RUN addgroup --gid 1099 tomcat && useradd -m -u 1099 -g tomcat tomcat \
    && chown -R tomcat:tomcat . \
    && chown -R tomcat:tomcat ${GEOSERVER_DATA_DIR} \
    && chown -R tomcat:tomcat ${GEOSERVER_INSTALL_DIR}

# Copiar el archivo web.xml con los CORS habilitados
COPY web.xml ${GEOSERVER_INSTALL_DIR}/WEB-INF/web.xml

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

# index.html is used for health check; ensure build fails early if not present
RUN cat ${GEOSERVER_INSTALL_DIR}/index.html

ADD start.sh /usr/local/bin/start.sh
ENTRYPOINT [ "/bin/sh", "/usr/local/bin/start.sh"]

VOLUME ["${GEOSERVER_DATA_DIR}", "${GEOSERVER_EXT_DIR}"]

EXPOSE 8080

HEALTHCHECK --start-period=10s --interval=10s --timeout=5s --retries=50 \
    CMD curl -f "http://localhost:8080${GEOSERVER_PATH}/index.html" || exit 1
