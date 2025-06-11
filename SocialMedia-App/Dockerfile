FROM node:22.11.0 as base
WORKDIR /app
COPY package.json  . 


FROM base as dev
RUN npm i
COPY . .
CMD ["npm", "run", "start:dev"]


FROM base as prod
RUN npm i --only=production
COPY . .
CMD ["npm", "run","start"]