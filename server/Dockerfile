#  Dockerfile for Matcha Backend

FROM node:12

WORKDIR /server

# copy json files inside container
COPY package*.json ./

# Install Dependencies
RUN npm install

# Copy server source code
COPY . .

# ENV PORT
ENV PORT 5000

# Expose port
EXPOSE 5000

# Run server

CMD ["npm", "run", "dev"]


# How to Build
# docker build -t matcha/server:1.0 .

# How to run
# docker run -p 5001:5000 --name matcha_backend matcha/server:1.0