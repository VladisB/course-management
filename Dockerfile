######################
## DEVELOPMENT STAGE ##
######################
# Build the development image
FROM node:18.17.1 AS development

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# build the app to the dist folder
RUN npm run build

######################
## TESTING STAGE ##
######################
# Build the testing image
FROM node:18.17.1 AS testing

# Set node env to production
ARG NODE_ENV=testing
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

# Copy all from development stage
COPY --from=development /app .

# Update packages
RUN apt-get update

# Install PostgreSQL Client
RUN apt-get install -y postgresql-client

EXPOSE 8080

ENTRYPOINT [ "/bin/sh", "-c" ]
CMD [ "npm test && npm run migration:run" ]

######################
## PRODUCTION STAGE ##
######################
# Build the production image
FROM node:18.17.1 AS production

# Set node env to production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

# Copy all from development stage
COPY --from=development /app .

EXPOSE 8080

CMD [ "node", "dist/main" ]



