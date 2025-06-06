FROM docker.io/library/node:latest AS build
WORKDIR /build
ARG gpr_token

COPY package.json package.json
COPY package-lock.json package-lock.json
COPY tsconfig.json tsconfig.json
COPY .npmrc .npmrc
RUN echo "//npm.pkg.github.com/:_authToken=${gpr_token}" > ~/.npmrc
RUN npm ci --legacy-peer-deps

COPY .env .env
COPY .env.production .env.production
COPY public/ public
COPY src/ src
COPY rsbuild.config.ts rsbuild.config.ts
RUN npm run build

FROM docker.io/library/httpd:2.4-alpine
COPY ./httpd.conf /usr/local/apache2/conf/httpd.conf
WORKDIR /usr/local/apache2/htdocs/
COPY --from=build /build/build/ .
