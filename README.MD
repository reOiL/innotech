## How to start

Linux:

```shell script
sudo su
apt-get install -y docker docker-compose
at << EOF > .env
VK_LOG='<Ваш логин в вк>'
VK_PAS='<Ваш пароль в вк>'
FNS_TOKEN='<Токен налоговой службый>'
EOF
docker-compose -f docker-compose.yml up --force-recreate --build -d
xdg-open http://127.0.0.1:8368
``` 

_**Страница в вк должна быть на русском языке!**_