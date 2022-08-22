FROM node:16-alpine
# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /sarApp
# Installing dependencies
COPY package.json package-lock.json ./
RUN npm cache clean --force
RUN npm config set legacy-peer-deps true
RUN npm install
# Copying source files
COPY . .
# Building app
RUN npm run build
EXPOSE 8080
# Running the app
CMD [ "npm", "start" ]