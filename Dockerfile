# Using official node runtime base image
FROM node:14

# Set the application directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install application dependencies inside the container
RUN npm install

# Copy the application source code from the current directory to the working directory in the container
COPY . .

# Back4App uses port 3000, so let Docker know about it
EXPOSE 3000

# Define the command that should be executed
# This should start our application.
CMD [ "npm", "start" ]
