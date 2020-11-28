from django.db import models
from django.utils.translation import gettext_lazy as _


# Create your models here.


class ScrappedData(models.Model):
    class Meta:
        verbose_name = _("Research data")
        verbose_name_plural = _("Research data")

    def __str__(self):
        return str(self.id)

    data = models.JSONField(
        max_length=1048576,
        default=dict,
        null=False,
        verbose_name=_("User data")
    )
