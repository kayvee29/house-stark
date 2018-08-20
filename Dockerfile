FROM centos:latest
MAINTAINER Kalyan Penmetsa "penmetsa29@gmail.com"
RUN yum update -y
RUN curl -sL https://rpm.nodesource.com/setup_8.x | bash -
RUN yum -y install nodejs
RUN npm install -g start-react-app
EXPOSE 9000
COPY . /app
WORKDIR /app
RUN start-react-app myblog
ENTRYPOINT ["npm"]
CMD ["start"]