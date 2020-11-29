import requests
import json


def find_info(q, k, p=1):
    try:
        return requests.get(
            f'https://api-fns.ru/api/search?q={q}&key={k}&page={p}'
        ).json()
    except json.JSONDecodeError as e:
        print(e)
        return {'items': [], "Count": 0, "Error": e}


def check_presone(q, k, p=1):
    try:
        return requests.get(
            f'https://api-fns.ru/api/check?q={q}&key={k}&page={p}'
        ).json()
    except json.JSONDecodeError as e:
        print(e)
        return {'items': [], "Count": 0, "Error": e}


def fetch_all(func, q, k):
    i = 1
    data = {"items": [], "Count": 0}
    while i < 5:
        ret = func(q, k, i)
        if ret["Count"] == 0:
            break
        data['items'] += ret['items']
        data['Count'] += ret['Count']
        i += 1
    return data

#
# print(find_info('Лейкин+Григорий+Алексеевич', '852b4bcd35301006218dcd1de4df233b75442509'))
# print(check_presone('772748402568', '852b4bcd35301006218dcd1de4df233b75442509'))
