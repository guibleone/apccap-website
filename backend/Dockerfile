# Use uma imagem base oficial do Node
FROM node:20-slim

# Define o diretório de trabalho no container
WORKDIR /app

# Copia o package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instala as dependências
RUN npm ci --only=production && npm cache clean --force

# Copia o restante do código da aplicação para o diretório de trabalho
COPY . .

EXPOSE 3000

# Comando para rodar a aplicação
CMD ["node", "index.js"]