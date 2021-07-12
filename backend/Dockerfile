FROM node:16

RUN mkdir /app
WORKDIR /app
ADD . /app

COPY start.sh /usr/bin/
RUN chmod +x /usr/bin/start.sh

ENTRYPOINT ["start.sh"]