import os

from scraplenium.scrapping import Scrapping
from scraplenium.utils import img_to_base
from selenium.webdriver.support import expected_conditions as ec
from selenium.webdriver.common.by import By


class VkScrapping(Scrapping):
    def get_custom_data(self, selector, query, field, default):
        if selector not in self.selectors:
            raise ValueError("Undefined selector")
        try:
            return getattr(self.selectors[selector](query), field, default)
        except Exception:
            return default

    def get_profile_status(self):
        els = self.find_elements_by_class_name('profile_deleted_text')
        if not els:
            return 'Open', True
        return els[0].text, False

    def login(self, log, pas):
        self.get('https://vk.com/')
        self.find_element_by_id('index_email').send_keys(log)
        self.find_element_by_id('index_pass').send_keys(pas)
        self.click(self.find_element_by_id('index_login_button'))

    def invoke(self, _id):
        ret = {
            'url': f'https://vk.com/{_id}',
        }
        self.get(ret['url'])
        self.until(3, ec.presence_of_element_located((By.TAG_NAME, 'body')))
        if self.title == '404 Not Found':
            ret['profile.status'] = 'Not exist'
            return ret
        ret['profile.name'] = self.get_custom_data('class', 'page_name', 'text', False)
        ret['profile.status'] = self.get_custom_data('class', 'profile_deleted_text', 'text', 'Open')
        if ret['profile.status'] != 'Open':
            return ret
        try:
            self.click(self.find_element_by_class_name('profile_label_more'))
        except Exception:
            pass
        # ret['profile.photo'] = self.get_custom_data('class', 'page_avatar_img', 'screenshot_as_base64', None)
        ret['profile.photo_url'] = self.get_custom_data('class', 'page_avatar_img', 'get_property', lambda x: x)('src')
        commons = self.get_custom_data('id', 'profile_short', 'text', '').replace(':\n', '=').split('\n')
        ret['profile.common'] = {common.split('=')[0]: common.split('=')[1]
                                 for common in commons if len(common.split('=')) == 2}
        return ret


def test_vk_scrapper():
    profiles = [
        '404',
        'o_scherbakova',
        'metnesmaxim',
        'id1',
        'id497220564',
        'id234232',
        'id497220532'
    ]
    vk = VkScrapping()
    vk.login(os.environ.get('VK_LOG'), os.environ.get('VK_PAS'))
    for p in profiles:
        data = vk.invoke(p)
        print(data)
    vk.close()

