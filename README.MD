## How to start
Linux:
```shell script
sudo su
apt-get install -y docker docker-compose
docker-compose -f docker-compose.yml up --force-recreate --build -d
xdg-open http://127.0.0.1:8368
``` 