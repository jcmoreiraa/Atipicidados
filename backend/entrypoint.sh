#!/bin/sh
set -e

echo "Gerando Prisma Client..."
npx prisma generate

echo "Executando migrações..."
npx prisma migrate deploy



echo "Iniciando o servidor..."
exec npx ts-node src/server.ts
