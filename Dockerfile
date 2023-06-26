FROM node:18.16.0 AS development

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# build the app to the dist folder
RUN npm run build

######################
## PRODUCTION STAGE ##
######################
# Build the production image
FROM node:18.16.0 AS production

# Set node env to production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

# Copy all from development stage
COPY --from=development /app .

EXPOSE 8080

CMD [ "node", "dist/main" ]

# docker build -t course-management-api .


