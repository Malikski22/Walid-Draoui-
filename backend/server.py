from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Union, Dict, Any
import uuid
from datetime import datetime, timedelta
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

@api_router.get("/", tags=["health"])
async def root():
    return {"message": "DzSmartBooking API is running"}

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
