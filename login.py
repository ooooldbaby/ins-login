# -*-coding:utf-8 -*-
"""
# File       : login.py
# Time       ：2023/11/7 9:29
# Author     ：caomengqi
# version    ：python 3.6
"""
import re

import execjs
import requests

proxy = "192.168.59.89:50003"

dict_proxy = {
    "http": f"http://{proxy}",
    "https": f"http://{proxy}",
}


def session_id(csrf, username, passwd):
    cookies = {
        # 'mid': 'ZUig3QALAAEx3f7NPyNUU9yuUqb7',
        # 'ig_did': 'D8CE6636-FC42-41A2-97F7-61BAF9C1F9A8',
        # 'ig_nrcb': '1',
        # 'datr': '2aBIZcP9a_hmE8vdtlB-Sa-2',
        # 'rur': '"NHA\\05455147566197\\0541730798082:01f74db43b6cd5e87d448cbbf0c213ec248b560cb3aeba3b380c0fd6ff511875bd51eaae"',
        'csrftoken': csrf,
    }

    headers = {
        'authority': 'www.instagram.com',
        'accept': '*/*',
        'accept-language': 'zh-CN,zh;q=0.9',
        'cache-control': 'no-cache',
        'content-type': 'application/x-www-form-urlencoded',
        'dpr': '1',
        'origin': 'https://www.instagram.com',
        'pragma': 'no-cache',
        'referer': 'https://www.instagram.com/',
        'sec-ch-prefers-color-scheme': 'light',
        'sec-ch-ua': '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"',
        'sec-ch-ua-full-version-list': '"Chromium";v="118.0.5993.120", "Google Chrome";v="118.0.5993.120", "Not=A?Brand";v="99.0.0.0"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-model': '""',
        'sec-ch-ua-platform': '"Windows"',
        'sec-ch-ua-platform-version': '"10.0.0"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
        'viewport-width': '1920',
        'x-asbd-id': '129477',
        'x-csrftoken': csrf,
        'x-ig-app-id': '936619743392459',
        'x-ig-www-claim': '0',
        'x-instagram-ajax': '1009723665',
        'x-requested-with': 'XMLHttpRequest',
    }
    enc_password = execjs.compile(open('ins_login.js').read()).call('encrypt', passwd)
    data = {
        'enc_password': enc_password,
        'optIntoOneTap': 'false',
        'queryParams': '{}',
        'trustedDeviceRecords': '{}',
        'username': username,
    }

    response = requests.post('https://www.instagram.com/api/v1/web/accounts/login/ajax/', cookies=cookies,
                             headers=headers, data=data, proxies=dict_proxy)
    print(response.cookies)


def csrf_token():
    headers = {
        'authority': 'www.instagram.com',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-language': 'zh-CN,zh;q=0.9',
        'cache-control': 'no-cache',
        'pragma': 'no-cache',
        'sec-ch-ua': '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
    }

    response = requests.get('https://www.instagram.com/', headers=headers, proxies=dict_proxy)
    # print(response.text)
    pattern = r'csrf_token\\":\\"(.*?)\\"'
    match = re.search(pattern, response.text)
    if match:
        csrf = match.group(1)
        print(csrf)
        return csrf


def main(username, passwd):
    csrf = csrf_token()

    session_id(csrf, username, passwd)


if __name__ == '__main__':
    main("taypenjireagx89","xxxx")
