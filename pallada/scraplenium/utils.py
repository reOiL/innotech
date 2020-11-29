import io
import os
import platform
import tarfile
import time

import requests

import scraplenium.CFG as CFG
import base64

g_GeckoDriver = ''


def unzip(mem, path):
    tar = tarfile.open(fileobj=io.BytesIO(mem))
    tar.extractall(path=path)
    tar.close()


def download_geckodriver():
    global g_GeckoDriver
    if g_GeckoDriver != '':
        return g_GeckoDriver
    system = platform.system()
    arch = platform.machine()
    driver_name = f'geckodriver_{system}_{arch}'
    driver_path = os.path.join(os.getcwd(), CFG.GECKODRIVER_PATH, driver_name)
    g_GeckoDriver = os.path.join(driver_path, 'geckodriver')
    if os.path.exists(driver_path):
        return g_GeckoDriver
    if not os.path.exists(CFG.GECKODRIVER_PATH):
        os.mkdir(CFG.GECKODRIVER_PATH)
    if system not in CFG.GECKODRIVER_URLS:
        print(f"Your platform {system} is not supported!")
        return False
    if arch not in CFG.GECKODRIVER_URLS[system]:
        print(f"Your platform {system} arch {arch} is not supported!")
        return False
    print("Downloading geckodriver....")
    r = requests.get(CFG.GECKODRIVER_URLS[system][arch])
    if r.status_code != 200:
        print(f"Bad status code: {r.status_code}")
        return False
    print("UnZip geckodriver....")
    unzip(r.content, driver_path)
    return g_GeckoDriver


def rep_operation(operation, rep_time, rep_count, e=None):
    if not callable(operation):
        raise ValueError("Operation must be callable!")
    while True:
        try:
            return operation()
        except Exception as e:
            if rep_count <= 0:
                raise Exception(e)
            time.sleep(rep_time)
            rep_count -= 1


def img_to_base(url):
    try:
        return base64.b64encode(requests.get(url).content)
    except Exception as e:
        return url
