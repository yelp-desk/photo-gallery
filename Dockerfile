FROM node:latest

RUN mkdir -p /src/app

WORKDIR /src/app

COPY . /src/app

COPY package.json .

RUN npm install --quiet

RUN yarn global add nodemon

EXPOSE 3003

# RUN npm run make

CMD [ "npm", "run", "start:andSeed" ]