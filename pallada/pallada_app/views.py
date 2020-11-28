from django.http import JsonResponse
from . import forms
# Create your views here.
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def upload(request):
    if request.method != 'POST':
        return JsonResponse({})
    form = forms.UploadForm(request.POST)
    if not form.is_valid():
        return JsonResponse({'data': form.errors})
    return JsonResponse({})
