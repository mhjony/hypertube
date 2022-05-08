# Dockerfile for Match Frontend

FROM node:12

WORKDIR /client

# copy Dependencies
COPY package*.json ./

# intall dependencies
RUN npm install

# Copy app source code
COPY . .

# Exports
EXPOSE 3000

# Run app

CMD ["npm", "run", "start"]

# How to Build
# docker build -t hypertube/client:1.0 .

# How to run
# docker run -p 3002:3000 --name hypertube_frontend hypertube/client:1.0