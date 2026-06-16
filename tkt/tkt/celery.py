import os
from celery import Celery
 
os.environ.setdefault('DJANGO_SETTINGS_MODULE','tkt.settings') #tells config directory to celery

app = Celery('tkt') #creates celery instance app called tkt

app.config_from_object('django.conf:settings',namespace='CELERY') #only look for variables in settings that start with CELERY_

app.autodiscover_tasks() #autodiscover tasks 