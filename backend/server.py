from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, Query
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Union, Dict, Any
from enum import Enum
import uuid
from datetime import datetime, timedelta, time
import bcrypt
import jwt
from passlib.context import CryptContext

# Root directory and environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'dz_smart_booking')]

# Security configuration
SECRET_KEY = os.environ.get("SECRET_KEY", "dzsecretkey123456789")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    phone_number: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

class UserInDB(User):
    hashed_password: str

class UserResponse(User):
    pass

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class Amenity(BaseModel):
    name: str
    icon: str

class Room(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    hotel_id: str
    name: str
    description: str
    price_per_night: float
    capacity: int
    available: bool = True
    images: List[str] = []

class HotelBase(BaseModel):
    name: str
    city: str
    address: str
    description: str
    stars: int
    amenities: List[str] = []
    images: List[str] = []
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class HotelCreate(HotelBase):
    pass

class Hotel(HotelBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    rating: float = 0.0
    reviews_count: int = 0

class BookingStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELED = "canceled"
    COMPLETED = "completed"

class BusCompany(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    logo: Optional[str] = None
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class BusRoute(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    company_id: str
    origin_city: str
    destination_city: str
    distance_km: float
    duration_minutes: int
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class BusType(str, Enum):
    STANDARD = "standard"
    PREMIUM = "premium"
    VIP = "vip"

class BusTrip(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    route_id: str
    company_id: str
    bus_type: BusType = BusType.STANDARD
    departure_date: datetime
    departure_time: time
    arrival_time: time
    available_seats: int
    total_seats: int
    price: float
    features: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class BusSeat(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    trip_id: str
    seat_number: str
    is_available: bool = True
    price: float

class BusTicketBooking(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    trip_id: str
    passenger_name: str
    passenger_phone: str
    seat_number: str
    price: float
    booking_date: datetime = Field(default_factory=datetime.utcnow)
    status: BookingStatus = BookingStatus.PENDING
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class BusTicketBookingCreate(BaseModel):
    trip_id: str
    passenger_name: str
    passenger_phone: str
    seat_number: str

class BusTripSearch(BaseModel):
    origin_city: str
    destination_city: str
    departure_date: datetime
    passengers_count: int = 1

class BookingBase(BaseModel):
    hotel_id: str
    room_id: str
    check_in_date: datetime
    check_out_date: datetime
    guests_count: int
    special_requests: Optional[str] = None

class BookingCreate(BookingBase):
    pass

class Booking(BookingBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    status: BookingStatus = BookingStatus.PENDING
    total_price: float

class HotelSearch(BaseModel):
    city: str
    check_in_date: datetime
    check_out_date: datetime
    guests_count: int
    
# Authentication functions
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

async def get_user_by_email(email: str):
    user = await db.users.find_one({"email": email})
    if user:
        return UserInDB(**user)
    return None

async def authenticate_user(email: str, password: str):
    user = await get_user_by_email(email)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    
    user = await db.users.find_one({"id": user_id})
    if user is None:
        raise credentials_exception
    
    return UserInDB(**user)

# API Routes
@api_router.post("/auth/register", response_model=Token)
async def register_user(user_data: UserCreate):
    # Check if user already exists
    existing_user = await get_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user with hashed password
    hashed_password = get_password_hash(user_data.password)
    user_dict = user_data.dict(exclude={"password"})
    new_user = UserInDB(**user_dict, hashed_password=hashed_password)
    
    # Save to database
    await db.users.insert_one(new_user.dict())
    
    # Create access token
    access_token = create_access_token(data={"sub": new_user.id})
    
    # Return token and user data
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(**new_user.dict(exclude={"hashed_password"}))
    }

@api_router.post("/auth/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(**user.dict(exclude={"hashed_password"}))
    }

@api_router.get("/users/me", response_model=UserResponse)
async def get_user_profile(current_user: UserInDB = Depends(get_current_user)):
    return UserResponse(**current_user.dict(exclude={"hashed_password"}))

# Hotel Routes
@api_router.post("/hotels", response_model=Hotel)
async def create_hotel(hotel_data: HotelCreate):
    hotel = Hotel(**hotel_data.dict())
    await db.hotels.insert_one(hotel.dict())
    return hotel

@api_router.get("/hotels", response_model=List[Hotel])
async def get_hotels(
    city: Optional[str] = None,
    min_stars: Optional[int] = None,
    max_price: Optional[float] = None,
    page: int = 1,
    limit: int = 10
):
    # Build filter
    filter_query = {}
    if city:
        filter_query["city"] = {"$regex": city, "$options": "i"}
    if min_stars:
        filter_query["stars"] = {"$gte": min_stars}
    
    # Get hotels with pagination
    skip = (page - 1) * limit
    hotels = await db.hotels.find(filter_query).skip(skip).limit(limit).to_list(length=limit)
    
    return [Hotel(**hotel) for hotel in hotels]

@api_router.get("/hotels/{hotel_id}", response_model=Hotel)
async def get_hotel(hotel_id: str):
    hotel = await db.hotels.find_one({"id": hotel_id})
    if not hotel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hotel not found"
        )
    return Hotel(**hotel)

@api_router.post("/search/hotels", response_model=List[Hotel])
async def search_hotels(search_data: HotelSearch):
    # Build filter for hotels in the city
    filter_query = {"city": {"$regex": search_data.city, "$options": "i"}}
    
    hotels = await db.hotels.find(filter_query).to_list(1000)
    hotels_data = [Hotel(**hotel) for hotel in hotels]
    
    # Later we can implement room availability check
    return hotels_data

@api_router.get("/rooms/hotel/{hotel_id}", response_model=List[Room])
async def get_hotel_rooms(hotel_id: str):
    rooms = await db.rooms.find({"hotel_id": hotel_id}).to_list(1000)
    return [Room(**room) for room in rooms]

@api_router.post("/bookings", response_model=Booking)
async def create_booking(
    booking_data: BookingCreate,
    current_user: UserInDB = Depends(get_current_user)
):
    # Check if room exists
    room = await db.rooms.find_one({"id": booking_data.room_id})
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Room not found"
        )
    
    # Calculate total price (days * price_per_night)
    check_in = booking_data.check_in_date
    check_out = booking_data.check_out_date
    days = (check_out - check_in).days
    
    if days <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Check-out date must be after check-in date"
        )
    
    room_obj = Room(**room)
    total_price = days * room_obj.price_per_night
    
    # Create booking
    booking = Booking(
        **booking_data.dict(),
        user_id=current_user.id,
        total_price=total_price
    )
    
    await db.bookings.insert_one(booking.dict())
    return booking

@api_router.get("/bookings/me", response_model=List[Booking])
async def get_user_bookings(current_user: UserInDB = Depends(get_current_user)):
    bookings = await db.bookings.find({"user_id": current_user.id}).to_list(1000)
    return [Booking(**booking) for booking in bookings]

# Bus Company Routes
@api_router.post("/bus/companies", response_model=BusCompany)
async def create_bus_company(company_data: BusCompany):
    await db.bus_companies.insert_one(company_data.dict())
    return company_data

@api_router.get("/bus/companies", response_model=List[BusCompany])
async def get_bus_companies():
    companies = await db.bus_companies.find().to_list(100)
    return [BusCompany(**company) for company in companies]

@api_router.get("/bus/companies/{company_id}", response_model=BusCompany)
async def get_bus_company(company_id: str):
    company = await db.bus_companies.find_one({"id": company_id})
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bus company not found"
        )
    return BusCompany(**company)

# Bus Routes
@api_router.post("/bus/routes", response_model=BusRoute)
async def create_bus_route(route_data: BusRoute):
    # Check if company exists
    company = await db.bus_companies.find_one({"id": route_data.company_id})
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bus company not found"
        )
    await db.bus_routes.insert_one(route_data.dict())
    return route_data

@api_router.get("/bus/routes", response_model=List[BusRoute])
async def get_bus_routes(
    origin_city: Optional[str] = None,
    destination_city: Optional[str] = None,
    company_id: Optional[str] = None
):
    filter_query = {}
    if origin_city:
        filter_query["origin_city"] = {"$regex": origin_city, "$options": "i"}
    if destination_city:
        filter_query["destination_city"] = {"$regex": destination_city, "$options": "i"}
    if company_id:
        filter_query["company_id"] = company_id
    
    routes = await db.bus_routes.find(filter_query).to_list(100)
    return [BusRoute(**route) for route in routes]

# Bus Trips
@api_router.post("/bus/trips", response_model=BusTrip)
async def create_bus_trip(trip_data: BusTrip):
    # Check if route exists
    route = await db.bus_routes.find_one({"id": trip_data.route_id})
    if not route:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bus route not found"
        )
    await db.bus_trips.insert_one(trip_data.dict())
    return trip_data

@api_router.get("/bus/trips", response_model=List[BusTrip])
async def get_bus_trips(
    route_id: Optional[str] = None,
    company_id: Optional[str] = None,
    departure_date: Optional[str] = None,
    origin_city: Optional[str] = None,
    destination_city: Optional[str] = None
):
    filter_query = {}
    if route_id:
        filter_query["route_id"] = route_id
    if company_id:
        filter_query["company_id"] = company_id
    if departure_date:
        # Parse date string to datetime object
        try:
            date_obj = datetime.fromisoformat(departure_date.replace('Z', '+00:00'))
            start_of_day = datetime(date_obj.year, date_obj.month, date_obj.day)
            end_of_day = start_of_day + timedelta(days=1)
            filter_query["departure_date"] = {"$gte": start_of_day, "$lt": end_of_day}
        except (ValueError, TypeError):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid date format. Use ISO format (YYYY-MM-DDTHH:MM:SS)"
            )
    
    # If origin_city or destination_city is provided, we need to join with routes
    if origin_city or destination_city:
        route_filter = {}
        if origin_city:
            route_filter["origin_city"] = {"$regex": origin_city, "$options": "i"}
        if destination_city:
            route_filter["destination_city"] = {"$regex": destination_city, "$options": "i"}
        
        routes = await db.bus_routes.find(route_filter).to_list(100)
        route_ids = [route["id"] for route in routes]
        filter_query["route_id"] = {"$in": route_ids}
    
    trips = await db.bus_trips.find(filter_query).to_list(100)
    return [BusTrip(**trip) for trip in trips]

@api_router.post("/bus/search", response_model=List[Dict[str, Any]])
async def search_bus_trips(search_data: BusTripSearch):
    """
    Search for bus trips with route details
    """
    try:
        # Find routes matching origin and destination
        routes = await db.bus_routes.find({
            "origin_city": {"$regex": search_data.origin_city, "$options": "i"},
            "destination_city": {"$regex": search_data.destination_city, "$options": "i"}
        }).to_list(100)
        
        route_ids = [route["id"] for route in routes]
        if not route_ids:
            return []
        
        # Format the date to match only the day
        date_obj = search_data.departure_date
        start_of_day = datetime(date_obj.year, date_obj.month, date_obj.day)
        end_of_day = start_of_day + timedelta(days=1)
        
        # Find trips for these routes on the specified date
        trips = await db.bus_trips.find({
            "route_id": {"$in": route_ids},
            "departure_date": {"$gte": start_of_day, "$lt": end_of_day},
            "available_seats": {"$gte": search_data.passengers_count}
        }).to_list(100)
        
        # Create a lookup dictionary for routes
        routes_dict = {route["id"]: route for route in routes}
        
        # Get company details
        company_ids = list(set(trip["company_id"] for trip in trips))
        companies = await db.bus_companies.find({"id": {"$in": company_ids}}).to_list(100)
        companies_dict = {company["id"]: company for company in companies}
        
        # Combine trip, route, and company data
        result = []
        for trip in trips:
            route = routes_dict.get(trip["route_id"], {})
            company = companies_dict.get(trip["company_id"], {})
            
            result.append({
                "trip": trip,
                "route": route,
                "company": company
            })
        
        return result
    
    except Exception as e:
        logger.error(f"Error searching bus trips: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error searching bus trips: {str(e)}"
        )

@api_router.get("/bus/trips/{trip_id}", response_model=Dict[str, Any])
async def get_bus_trip_details(trip_id: str):
    """
    Get details of a bus trip, including route and company information
    """
    # Get trip details
    trip = await db.bus_trips.find_one({"id": trip_id})
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bus trip not found"
        )
    
    # Get associated route
    route = await db.bus_routes.find_one({"id": trip["route_id"]})
    if not route:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bus route not found"
        )
    
    # Get company details
    company = await db.bus_companies.find_one({"id": trip["company_id"]})
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bus company not found"
        )
    
    # Get seats information
    seats = await db.bus_seats.find({"trip_id": trip_id}).to_list(100)
    
    return {
        "trip": BusTrip(**trip),
        "route": BusRoute(**route),
        "company": BusCompany(**company),
        "seats": [BusSeat(**seat) for seat in seats] if seats else []
    }

@api_router.post("/bus/seats", response_model=List[BusSeat])
async def create_bus_seats(trip_id: str, total_seats: int, price: float):
    """
    Create seats for a bus trip
    """
    # Check if trip exists
    trip = await db.bus_trips.find_one({"id": trip_id})
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bus trip not found"
        )
    
    # Create seats
    seats = []
    for i in range(1, total_seats + 1):
        seat = BusSeat(
            trip_id=trip_id,
            seat_number=str(i),
            is_available=True,
            price=price
        )
        seats.append(seat.dict())
    
    await db.bus_seats.insert_many(seats)
    
    # Update trip with total seats
    await db.bus_trips.update_one(
        {"id": trip_id},
        {"$set": {"total_seats": total_seats, "available_seats": total_seats}}
    )
    
    return [BusSeat(**seat) for seat in seats]

@api_router.get("/bus/seats/{trip_id}", response_model=List[BusSeat])
async def get_bus_seats(trip_id: str):
    """
    Get all seats for a bus trip
    """
    seats = await db.bus_seats.find({"trip_id": trip_id}).to_list(100)
    return [BusSeat(**seat) for seat in seats]

@api_router.post("/bus/bookings", response_model=BusTicketBooking)
async def book_bus_ticket(
    booking_data: BusTicketBookingCreate,
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Book a bus ticket
    """
    # Check if trip exists
    trip = await db.bus_trips.find_one({"id": booking_data.trip_id})
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bus trip not found"
        )
    
    # Check if seat exists and is available
    seat = await db.bus_seats.find_one({
        "trip_id": booking_data.trip_id,
        "seat_number": booking_data.seat_number
    })
    
    if not seat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Seat not found"
        )
    
    if not seat["is_available"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Seat is already booked"
        )
    
    # Create booking
    booking = BusTicketBooking(
        user_id=current_user.id,
        trip_id=booking_data.trip_id,
        passenger_name=booking_data.passenger_name,
        passenger_phone=booking_data.passenger_phone,
        seat_number=booking_data.seat_number,
        price=seat["price"]
    )
    
    await db.bus_ticket_bookings.insert_one(booking.dict())
    
    # Update seat availability
    await db.bus_seats.update_one(
        {"trip_id": booking_data.trip_id, "seat_number": booking_data.seat_number},
        {"$set": {"is_available": False}}
    )
    
    # Update available seats count in trip
    await db.bus_trips.update_one(
        {"id": booking_data.trip_id},
        {"$inc": {"available_seats": -1}}
    )
    
    return booking

@api_router.get("/bus/bookings/me", response_model=List[Dict[str, Any]])
async def get_user_bus_bookings(current_user: UserInDB = Depends(get_current_user)):
    """
    Get all bus bookings for the current user
    """
    bookings = await db.bus_ticket_bookings.find({"user_id": current_user.id}).to_list(100)
    if not bookings:
        return []
    
    # Get trip details for each booking
    result = []
    for booking in bookings:
        booking_obj = BusTicketBooking(**booking)
        trip = await db.bus_trips.find_one({"id": booking["trip_id"]})
        
        if trip:
            route = await db.bus_routes.find_one({"id": trip["route_id"]})
            company = await db.bus_companies.find_one({"id": trip["company_id"]})
            
            result.append({
                "booking": booking_obj,
                "trip": BusTrip(**trip) if trip else None,
                "route": BusRoute(**route) if route else None,
                "company": BusCompany(**company) if company else None
            })
        else:
            result.append({
                "booking": booking_obj,
                "trip": None,
                "route": None,
                "company": None
            })
    
    return result

@api_router.put("/bus/bookings/{booking_id}/cancel", response_model=BusTicketBooking)
async def cancel_bus_booking(
    booking_id: str,
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Cancel a bus booking
    """
    # Find the booking
    booking = await db.bus_ticket_bookings.find_one({
        "id": booking_id,
        "user_id": current_user.id
    })
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Update booking status
    await db.bus_ticket_bookings.update_one(
        {"id": booking_id},
        {"$set": {"status": BookingStatus.CANCELED, "updated_at": datetime.utcnow()}}
    )
    
    # Make the seat available again
    await db.bus_seats.update_one(
        {"trip_id": booking["trip_id"], "seat_number": booking["seat_number"]},
        {"$set": {"is_available": True}}
    )
    
    # Update available seats count in trip
    await db.bus_trips.update_one(
        {"id": booking["trip_id"]},
        {"$inc": {"available_seats": 1}}
    )
    
    # Return updated booking
    updated_booking = await db.bus_ticket_bookings.find_one({"id": booking_id})
    return BusTicketBooking(**updated_booking)

# Include the router in the main app
app.include_router(api_router)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
