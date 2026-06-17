FROM nginx:1.25.2

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY ./build .

COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]