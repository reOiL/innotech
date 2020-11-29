FROM python:3.8

MAINTAINER reOiL
ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update -y && \
    apt-get upgrade -y && \
    apt-get install -y python-dev libpq-dev libssl-dev packagekit-gtk3-module \
    libx11-xcb1 libdbus-glib-1-2

RUN wget -O ~/FirefoxSetup.tar.bz2 "https://download.mozilla.org/?product=firefox-latest&os=linux64"
RUN tar xjf ~/FirefoxSetup.tar.bz2 -C /opt/
RUN mkdir -p /usr/lib/firefox/
RUN ln -s /opt/firefox/firefox /usr/lib/firefox/firefox

WORKDIR /app/
RUN apt-get instal -y cmake gcc g++

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