
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
        self.bus_trip_id = None
        self.bus_seat_number = None
        self.bus_booking_id = None

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

    # Hotel-related tests
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

    def test_create_hotel_booking(self):
        """Test creating a hotel booking"""
        if not self.hotel_id or not self.room_id:
            print("❌ No hotel or room ID available for testing")
            return False
            
        check_in = datetime.now().isoformat()
        check_out = (datetime.now() + timedelta(days=3)).isoformat()
        
        success, _ = self.run_test(
            "Create Hotel Booking",
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

    def test_get_hotel_bookings(self):
        """Test getting user hotel bookings"""
        success, _ = self.run_test(
            "Get User Hotel Bookings",
            "GET",
            "bookings/me",
            200
        )
        return success

    # Bus-related tests
    def test_get_bus_companies(self):
        """Test getting bus companies"""
        success, response = self.run_test(
            "Get Bus Companies",
            "GET",
            "bus/companies",
            200
        )
        return success

    def test_get_bus_routes(self):
        """Test getting bus routes"""
        success, response = self.run_test(
            "Get Bus Routes",
            "GET",
            "bus/routes",
            200
        )
        return success

    def test_search_bus_trips(self, origin_city="algiers", destination_city="oran"):
        """Test searching for bus trips"""
        departure_date = datetime.now().isoformat()
        
        success, response = self.run_test(
            "Search Bus Trips",
            "POST",
            "bus/search",
            200,
            data={
                "origin_city": origin_city,
                "destination_city": destination_city,
                "departure_date": departure_date,
                "passengers_count": 1
            }
        )
        
        if success and len(response) > 0:
            self.bus_trip_id = response[0]['trip']['id']
            return True
        return False

    def test_get_bus_trip_details(self):
        """Test getting bus trip details"""
        if not self.bus_trip_id:
            print("❌ No bus trip ID available for testing")
            return False
            
        success, response = self.run_test(
            "Get Bus Trip Details",
            "GET",
            f"bus/trips/{self.bus_trip_id}",
            200
        )
        
        if success and 'seats' in response and len(response['seats']) > 0:
            # Find an available seat
            for seat in response['seats']:
                if seat['is_available']:
                    self.bus_seat_number = seat['seat_number']
                    break
            
            if self.bus_seat_number:
                return True
        
        return False

    def test_create_bus_booking(self):
        """Test creating a bus booking"""
        if not self.bus_trip_id or not self.bus_seat_number:
            print("❌ No bus trip ID or seat number available for testing")
            return False
            
        success, response = self.run_test(
            "Create Bus Booking",
            "POST",
            "bus/bookings",
            200,
            data={
                "trip_id": self.bus_trip_id,
                "passenger_name": "Test Passenger",
                "passenger_phone": "+213555123456",
                "seat_number": self.bus_seat_number
            }
        )
        
        if success and 'id' in response:
            self.bus_booking_id = response['id']
            return True
        return False

    def test_get_bus_bookings(self):
        """Test getting user bus bookings"""
        success, response = self.run_test(
            "Get User Bus Bookings",
            "GET",
            "bus/bookings/me",
            200
        )
        return success

    def test_cancel_bus_booking(self):
        """Test canceling a bus booking"""
        if not self.bus_booking_id:
            print("❌ No bus booking ID available for testing")
            return False
            
        success, _ = self.run_test(
            "Cancel Bus Booking",
            "PUT",
            f"bus/bookings/{self.bus_booking_id}/cancel",
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
    
    # Test bus functionality
    print("\n🚌 Testing Bus Booking Functionality:")
    
    # Test bus companies
    tester.test_get_bus_companies()
    
    # Test bus routes
    tester.test_get_bus_routes()
    
    # Test bus trip search
    if not tester.test_search_bus_trips():
        print("❌ Bus trip search failed, trying with different cities...")
        # Try with different city combinations
        city_pairs = [
            ("algiers", "oran"),
            ("oran", "algiers"),
            ("constantine", "algiers"),
            ("algiers", "constantine"),
            ("oran", "constantine")
        ]
        
        search_success = False
        for origin, destination in city_pairs:
            if tester.test_search_bus_trips(origin, destination):
                search_success = True
                break
        
        if not search_success:
            print("❌ All bus trip searches failed, skipping bus booking tests")
        
    # If we have a trip ID, continue with bus booking tests
    if tester.bus_trip_id:
        # Test bus trip details
        if tester.test_get_bus_trip_details():
            # Test bus booking creation
            tester.test_create_bus_booking()
            
            # Test getting bus bookings
            tester.test_get_bus_bookings()
            
            # Test canceling bus booking
            if tester.bus_booking_id:
                tester.test_cancel_bus_booking()
    
    # Test hotel functionality
    print("\n🏨 Testing Hotel Booking Functionality:")
    
    # Test hotel search
    tester.test_search_hotels("algiers")
    
    # If we have a hotel ID, continue with hotel booking tests
    if tester.hotel_id:
        # Test hotel details
        tester.test_get_hotel_details()
        
        # Test hotel rooms
        if tester.test_get_hotel_rooms():
            # Test hotel booking creation
            tester.test_create_hotel_booking()
            
            # Test getting hotel bookings
            tester.test_get_hotel_bookings()
    
    # Print results
    print(f"\n📊 Tests passed: {tester.tests_passed}/{tester.tests_run}")
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())
