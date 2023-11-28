# -*- coding: utf-8 -*-
"""
Created on Mon Oct 23 00:12:39 2023

@author: phnam
"""
import requests
import os
from os.path import join, dirname
import sys
from dotenv import load_dotenv

if not os.path.isfile(".env"):
    print("File Not Found:", "The file .env is missing.")
    sys.exit()

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

EMAIL = os.environ.get("EMAIL")
PASSWORD = os.environ.get("PASSWORD")
BASE_API_URL = os.environ.get("BASE_API_URL")

def getToken(email, password):
    login_url = f"{BASE_API_URL}users/login"
    
    login_data = {
        "email": f"{email}",
        "password": f"{password}"
    }
    
    response = requests.post(login_url, json=login_data)
    
    if response.status_code == 200:
        return response.json().get("token")
    else:
        print("Unable to authenticate with the provided credentials")
        return None

def fetch(api_url, method="GET", data=None):
    headers = {
        "Authorization": f"Bearer {token}"
    }

    if method == "GET":
        response = requests.get(f"{BASE_API_URL}{api_url}", headers=headers)
    elif method == "POST":
        response = requests.post(f"{BASE_API_URL}{api_url}", headers=headers, json=data)
    elif method == "PATCH":
        response = requests.patch(f"{BASE_API_URL}{api_url}", headers=headers, json=data)
    elif method == "PUT":
        response = requests.put(f"{BASE_API_URL}{api_url}", headers=headers, json=data)
    elif method == "DELETE":
        response = requests.delete(f"{BASE_API_URL}{api_url}", headers=headers)

    if response.status_code // 100 == 2:
        return response.json()
    else:
        print("Request Failed")
        return None
    
token = getToken(EMAIL, PASSWORD)