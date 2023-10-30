FROM node:18

RUN npm i -g @nestjs/cli

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

RUN npm run build

CMD [ "npm", "run", "start:dev" ]

# CMD ["nest", "start"]