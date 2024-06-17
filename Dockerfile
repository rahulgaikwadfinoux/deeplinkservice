FROM node:19-alpine

EXPOSE 8000

WORKDIR /templateEs6Express

COPY . /templateEs6Express

RUN npm install

CMD ["npm", "run", "start"]