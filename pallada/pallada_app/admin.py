from django.contrib import admin

# Register your models here.
from pallada_app import models


@admin.register(models.ScrappedData)
class ScrappedDataAdmin(admin.ModelAdmin):
    pass
