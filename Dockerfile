FROM node

RUN rm -rf /app
RUN mkdir /app
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

EXPOSE 3000

CMD [ "node", "dist/main" ]
