FROM node:21-alpine AS base

###
# DEV
###
FROM base AS development

WORKDIR /app

COPY . .

RUN npm i --ignore-scripts

EXPOSE 3000
ENTRYPOINT [ "npm", "run", "start:dev" ]

###
# BUILD
###
FROM base AS build

WORKDIR /app

COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=development /app/node_modules ./node_modules

# Install libraries as user node
RUN npm i --only=production --ignore-scripts

USER node

RUN npm run build

### 
# PRODUCTION
###
FROM build AS production

WORKDIR /app

COPY --chown=node:node --from=build /app/src/node_modules ./node_modules
COPY --chown=node:node --from=build /app/src/dist ./dist

USER node


CMD [ "node", "dist/main.js" ]

