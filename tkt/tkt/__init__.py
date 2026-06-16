from .celery import app as celery_app

__all__ = ('celery_app',)


#code above tells django to automatically run celery