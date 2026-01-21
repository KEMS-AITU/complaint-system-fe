#!/usr/bin/env bash

set -e

if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

source venv/bin/activate

pip install --upgrade pip

if [ -f requirements.txt ]; then
    pip install -r requirements.txt
else
    pip install django djangorestframework django-cors-headers
    pip freeze > requirements.txt
fi

python manage.py migrate
python manage.py runserver
