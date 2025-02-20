import requests

BASE_URL = "http://localhost:5001/api/auth"

def test_register():
    url = f"{BASE_URL}/register"
    headers = {"Content-Type": "application/json"}
    
    data = {
        "name": "New Test User", # Test User 
        "email": "uniqueuser@example.com",  # Test email
        "password": "securepass" # Test Password
    }

    response = requests.post(url, json=data, headers=headers)

    print("Status Code:", response.status_code)
    print("Response Text:", response.text)

    assert response.status_code == 201, f"Expected 201, but got {response.status_code}"

test_register()