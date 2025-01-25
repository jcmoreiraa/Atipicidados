FROM node:20
WORKDIR /backend
COPY package*.json ./
RUN npm install
RUN npx prisma generate
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
EXPOSE 3002
CMD ["npx", "ts-node", "src/server.ts"]
