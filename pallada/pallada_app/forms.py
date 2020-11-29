from django import forms


class UploadForm(forms.Form):
    photo = forms.FileField(
        required=True
    )
