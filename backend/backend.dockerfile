FROM node:20
WORKDIR /backend
COPY package*.json ./
RUN npx prisma generate
RUN npm install
COPY prisma ./prisma
COPY . .
EXPOSE 3002
CMD ["npx", "ts-node", "src/server.ts"]
