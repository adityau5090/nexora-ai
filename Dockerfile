FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN mkdir -p src/generated/prisma

RUN npx prisma generate

RUN ls -la src/generated/prisma

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]