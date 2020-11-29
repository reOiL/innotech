FROM python:3.8

MAINTAINER reOiL
ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update -y && \
    apt-get upgrade -y && \
    apt-get install -y python-dev libpq-dev libssl-dev nmap

WORKDIR /app/

# Copy requirement files
COPY requirements.txt /app
RUN pip3 install -r requirements.txt
COPY run.sh /app
RUN chmod +x run.sh

# Copy app
COPY manage.py /app
COPY scraplenium /app/scraplenium
COPY apiboost /app/apiboost
COPY pallada /app/pallada
COPY pallada_app /app/pallada_app

EXPOSE 8000
ENTRYPOINT ["/app/run.sh"]