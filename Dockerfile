FROM node:alpine
RUN mkdir /ambianic-pnp
WORKDIR /ambianic-pnp
COPY bin ./bin
COPY package.json .
COPY src ./src
COPY config ./config
COPY app.json .
RUN npm install
EXPOSE 9779
ENTRYPOINT ["node", "bin/ambianic-pnp"]
CMD [ "--port", "9779", "--path", "/myapp" ]
