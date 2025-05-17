
import requests
import sys
import json
from datetime import datetime, timedelta

class DzSmartBookingAPITester:
    def __init__(self, base_url="https://3bfe7877-2caa-4f3d-af59-31bb37a8a75c.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.user_id = None
        self.hotel_id = None
        self.room_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            success = response.status_code == expected_status
            
            try:
                response_data = response.json() if response.text else {}
            except json.JSONDecodeError:
                response_data = {"text": response.text}
            
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"Response: {response_data}")

            return success, response_data

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test API health check endpoint"""
        return self.run_test(
            "API Health Check",
            "GET",
            "",
            200
        )

    def test_register(self, email, password, full_name, phone_number):
        """Test user registration"""
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data={
                "email": email,
                "password": password,
                "full_name": full_name,
                "phone_number": phone_number
            }
        )
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.user_id = response['user']['id']
            return True
        return False

    def test_login(self, email, password):
        """Test login and get token"""
        # For FastAPI OAuth2PasswordRequestForm, we need to use form data
        url = f"{self.base_url}/api/auth/login"
        headers = {'Content-Type': 'application/x-www-form-urlencoded'}
        data = {
            "username": email,  # FastAPI uses 'username' for the email
            "password": password
        }
        
        self.tests_run += 1
        print(f"\n🔍 Testing Login...")
        
        try:
            response = requests.post(url, data=data, headers=headers)
            success = response.status_code == 200
            
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                response_data = response.json()
                self.token = response_data['access_token']
                self.user_id = response_data['user']['id']
                return True
            else:
                print(f"❌ Failed - Expected 200, got {response.status_code}")
                print(f"Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False

    def test_get_user_profile(self):
        """Test getting user profile"""
        success, response = self.run_test(
            "Get User Profile",
            "GET",
            "users/me",
            200
        )
        return success

    def test_search_hotels(self, city):
        """Test searching for hotels"""
        check_in = datetime.now().isoformat()
        check_out = (datetime.now() + timedelta(days=3)).isoformat()
        
        success, response = self.run_test(
            "Search Hotels",
            "POST",
            "search/hotels",
            200,
            data={
                "city": city,
                "check_in_date": check_in,
                "check_out_date": check_out,
                "guests_count": 2
            }
        )
        
        if success and len(response) > 0:
            self.hotel_id = response[0]['id']
            return True
        return False

    def test_get_hotel_details(self):
        """Test getting hotel details"""
        if not self.hotel_id:
            print("❌ No hotel ID available for testing")
            return False
            
        success, _ = self.run_test(
            "Get Hotel Details",
            "GET",
            f"hotels/{self.hotel_id}",
            200
        )
        return success

    def test_get_hotel_rooms(self):
        """Test getting hotel rooms"""
        if not self.hotel_id:
            print("❌ No hotel ID available for testing")
            return False
            
        success, response = self.run_test(
            "Get Hotel Rooms",
            "GET",
            f"rooms/hotel/{self.hotel_id}",
            200
        )
        
        if success and len(response) > 0:
            self.room_id = response[0]['id']
            return True
        return False

    def test_create_booking(self):
        """Test creating a booking"""
        if not self.hotel_id or not self.room_id:
            print("❌ No hotel or room ID available for testing")
            return False
            
        check_in = datetime.now().isoformat()
        check_out = (datetime.now() + timedelta(days=3)).isoformat()
        
        success, _ = self.run_test(
            "Create Booking",
            "POST",
            "bookings",
            200,
            data={
                "hotel_id": self.hotel_id,
                "room_id": self.room_id,
                "check_in_date": check_in,
                "check_out_date": check_out,
                "guests_count": 2,
                "special_requests": "Need extra pillows"
            }
        )
        return success

    def test_get_user_bookings(self):
        """Test getting user bookings"""
        success, _ = self.run_test(
            "Get User Bookings",
            "GET",
            "bookings/me",
            200
        )
        return success

def main():
    # Setup
    tester = DzSmartBookingAPITester()
    
    # Test credentials
    test_email = "user@example.com"
    test_password = "password123"
    
    # Run tests
    tester.test_health_check()
    
    # Try to register (may fail if user already exists)
    registration_result = tester.test_register(
        test_email,
        test_password,
        "Test User",
        "+213555123456"
    )
    
    # If registration fails, try login
    if not registration_result:
        print("Registration failed, trying login...")
        if not tester.test_login(test_email, test_password):
            print("❌ Login failed, stopping tests")
            return 1
    
    # Test user profile
    tester.test_get_user_profile()
    
    # Test hotel search
    if not tester.test_search_hotels("algiers"):
        print("❌ Hotel search failed, stopping tests")
        return 1
    
    # Test hotel details
    tester.test_get_hotel_details()
    
    # Test hotel rooms
    if not tester.test_get_hotel_rooms():
        print("❌ Getting hotel rooms failed, stopping tests")
        return 1
    
    # Test booking creation
    tester.test_create_booking()
    
    # Test user bookings
    tester.test_get_user_bookings()
    
    # Print results
    print(f"\n📊 Tests passed: {tester.tests_passed}/{tester.tests_run}")
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())
