FROM node:18-buster-slim
LABEL maintainer="Jimmy Yeh <chienfeng0719@hotmail.com>"

# Prepare packages
ARG PRODUCT_NAME="app"
ENV ENV="/root/.bashrc"
RUN mkdir -p /${PRODUCT_NAME}
RUN apt update && apt install -y vim python3
RUN yarn global add @vue/cli
WORKDIR /${PRODUCT_NAME}
