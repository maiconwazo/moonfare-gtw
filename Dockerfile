FROM node:18-alpine
 
WORKDIR /user/src/app
ADD secrets /user/src/app/
RUN mkdir temp 
COPY . .
RUN npm ci --omit=dev
RUN npm run build

CMD ["npm", "run", "start:prod"]