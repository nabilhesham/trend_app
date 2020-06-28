# pull official base image
FROM python:3.8.3-alpine

# set work directory
RUN mkdir /code
WORKDIR /code

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1


RUN apk update \
    && apk add postgresql-dev gcc python3-dev musl-dev

# RUN apt build-dev python-lxml
RUN apk add --update --no-cache g++ gcc libxslt-dev libxml2-dev

# RUN python3 -m pip install libxml2 libxslt

# install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt

# copy project
COPY . /code/