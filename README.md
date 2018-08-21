## By KayVee

# Build a react app on Docker



Build the docker image using the command: docker build -t <imagename> .

Run the container: docker run -it --net=host -d -v codesourcedir:/app -p 9000:9000 --name react-container <DockerImage>:latest

Open your browser and go to http://localhost:9000
