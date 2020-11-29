import json
import os

from django.http import JsonResponse, HttpResponse
from . import forms
# Create your views here.
from django.views.decorators.csrf import csrf_exempt
from scraplenium.parser import VkScrapping
from apiboost import fns
import Levenshtein
import pandas as pd
from .models import ScrappedData


@csrf_exempt
def upload(request):
    if request.method != 'POST':
        return JsonResponse({})
    form = forms.UploadForm(request.POST)
    if not form.is_valid():
        return JsonResponse({'data': form.errors})
    return JsonResponse({})


def lev_dist(w, b):
    ret = 0
    for kw in w:
        for kb in b:
            Levenshtein.distance(kw, kb)
    return ret // len(w) + len(b)


def check(request, _id):
    class Wrap:
        def __init__(self):
            self.vk = VkScrapping()
            self.vk.login(os.environ.get('VK_LOG'), os.environ.get('VK_PAS'))
            self.vk.invoke(_id)

        def __call__(self, *args, **kwargs):
            return self.vk.invoke(_id)

        def __del__(self):
            self.vk.close()

    try:
        return HttpResponse(ScrappedData.objects.get(social_id=_id).data, content_type='application/json')
    except ScrappedData.DoesNotExist:
        pass
    data = Wrap()()
    naming = data['profile.name'].split(' ')
    company = fns.fetch_all(fns.find_info, '+'.join(naming), os.environ.get('FNS_TOKEN'))
    if not company['items'] and len(naming) >= 2:
        company = fns.fetch_all(fns.find_info, naming[1],  os.environ.get('FNS_TOKEN'))

    company_out = [d for l in [[x[y] for y in x] for x in company['items']] for d in l]
    df = pd.DataFrame(company_out)
    if 'profile.common' in data and 'Город' in data['profile.common']:
        df = df[df['АдресПолн'].str.contains(data['profile.common']['Город'].capitalize())]
    # for item in company['items']:
    #     for d in item:
    #         dist = 100
    #         if 'ФИОПолн' in item[d]:
    #             dist = lev_dist(naming, item[d]['ФИОПолн'].split(' '))
    #             # Levenshtein.distance(' '.join(naming), item[d]['ФИОПолн'])
    #         elif 'ГдеНайдено' in item[d]:
    #             # dist = Levenshtein.distance(' '.join(naming), item[d]['ГдеНайдено'])
    #             dist = lev_dist(naming, item[d]['ГдеНайдено'].split(' '))
    #         # print(dist, item[d])
    #         if dist < 50:
    #             company_out.append(item[d])
    ret = {
        'vk': data,
        'nalog': {
            'company': df.to_dict('records')[0:2],
        }
    }
    obj = ScrappedData(social_id=_id, data=json.dumps(ret, ensure_ascii=False))
    obj.save()
    return JsonResponse(ret)
