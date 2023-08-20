FROM node:14

WORKDIR /app/backend

COPY package*.json ./
RUN npm install

COPY . .

COPY .env.local .env

EXPOSE 3001

CMD [ "node", "app.js" ]
