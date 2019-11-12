FROM node:10.13-alpine
ENV NODE_ENV production
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
# copy package-lock.json and package.json to Working dir
COPY package*.json ./
RUN npm install
RUN apk update && apk add nodejs && npm i -g nodemon
# Bundle app source
COPY . /usr/src/app
EXPOSE 9006
CMD ["npm", "start"]