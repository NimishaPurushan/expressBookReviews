import requests

url = "http://127.0.0.1:5000"  # Include the http:// protocol
payload = {"username": "nimisha", "password": "nimisha123"}

def create_user():
   
    response = requests.post(url=url + "/register", json=payload)  # Use json instead of params

    print(response.status_code)
    print(response.json())

def login():
    response = requests.post(url=url + "/customer/login", json=payload)  # Use json instead of params

    print(response.status_code)
    print(response.json())
    token = response.json()['token']
    return token

def update_review(token, review):
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(url=url + "/auth/review/1", json=review, headers=headers) 
    print(response.status_code)
    print(response.text)

Review={"umang":"very nice book"}

create_user()
token=login()
print(token)
update_review(token=token, review=Review)