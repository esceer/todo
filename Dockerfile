######## Build backend #######
FROM golang:1.21 as builder-backend

WORKDIR /app

COPY backend/ .
RUN go mod download
RUN CGO_ENABLED=1 GOOS=linux go build -o main ./cmd/

######## Build frontend #######
FROM node:20.7.0-slim as builder-frontend

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ .

######## Build runtime image #######
FROM nginx:1.25.2

WORKDIR /app

# Handle Backend
COPY --from=builder-backend /app/main .

# Handle Frontend
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder-frontend /app/ /usr/share/nginx/html/todo

RUN apt -y install curl

COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

EXPOSE 80
EXPOSE 8081

ENTRYPOINT [ "./docker-entrypoint.sh" ]