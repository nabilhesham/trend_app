# Trend - Django, Postgres & Docker

- This project is about a trend search engine world wide with Django and Docker
- Uses [Pytrend](https://pypi.org/project/pytrends/) to get data of trends
- Uses [AMChart](https://www.amcharts.com/docs/v4/) to make charts and maps

## Dependencies

- Django 3.8
- Rest FrameWork
- Pytrend
- AMChart
- Django CorsHeaders
- Postgres 12
- Docker

To run the Docker Image, run:

```json
docker-compose up -d --build
docker-compose exec web python manage.py migrate --noinput
docker-compose exec web python manage.py createsuperuser
```
