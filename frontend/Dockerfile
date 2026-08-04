# Use uma imagem base oficial do Node
FROM node:20-alpine AS build

# Define o diretório de trabalho no container
WORKDIR /app

# Copia o package.json e package-lock.json para o diretório de trabalho
COPY ./package*.json ./

# Instala as dependências
RUN npm ci 

# Copia o restante do código da aplicação para o diretório de trabalho
COPY . .

# Executa o build do frontend
RUN npm run build

FROM caddy:2.11.4-alpine

COPY Caddyfile /etc/caddy/Caddyfile

COPY --from=build /app/build /usr/share/caddy

EXPOSE 80