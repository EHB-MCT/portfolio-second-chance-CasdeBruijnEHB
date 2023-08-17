FROM node:16

WORKDIR /app/frontend

COPY package*.json ./
RUN npm install

COPY . .

RUN npm install

RUN npm run build

CMD ["npm", "start"]