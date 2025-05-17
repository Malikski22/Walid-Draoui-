import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from datetime import datetime, timedelta, time
import uuid
import random

# Load environment variables
load_dotenv()

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'dz_smart_booking')]

# Sample bus companies
sample_bus_companies = [
    {
        "id": str(uuid.uuid4()),
        "name": "شركة النقل الجزائرية",
        "logo": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YnVzJTIwbG9nb3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        "description": "شركة النقل الرائدة في الجزائر، توفر خدمات نقل آمنة وموثوقة بين المدن",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "الحافلات السريعة",
        "logo": "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YnVzJTIwbG9nb3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        "description": "نقدم خدمات نقل سريعة ومريحة بين المدن الكبرى في الجزائر",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "الاتحاد للنقل",
        "logo": "https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJ1cyUyMGxvZ298ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
        "description": "نربط مدن الجزائر بشبكة واسعة من الحافلات المريحة والمجهزة بأحدث التقنيات",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
]

# Main cities
cities = ["algiers", "oran", "constantine", "annaba", "setif", "batna", "blida", "sidi_bel_abbes", "tlemcen", "biskra"]

# Routes between major cities
sample_bus_routes = []
sample_bus_trips = []
company_ids = []

async def seed_database():
    print("🌱 بدء زرع بيانات شركات النقل والرحلات...")
    
    # Clear existing data
    print("🧹 مسح البيانات الموجودة...")
    await db.bus_companies.delete_many({})
    await db.bus_routes.delete_many({})
    await db.bus_trips.delete_many({})
    await db.bus_seats.delete_many({})
    await db.bus_ticket_bookings.delete_many({})
    
    # Insert bus companies
    print("🚌 إضافة شركات النقل...")
    result = await db.bus_companies.insert_many(sample_bus_companies)
    
    # Get company IDs for routes
    for company in sample_bus_companies:
        company_ids.append(company["id"])
    
    # Create routes between cities
    print("🛣️ إنشاء مسارات الحافلات...")
    route_ids = []
    for i in range(len(cities)):
        for j in range(len(cities)):
            if i != j:  # No routes from city to itself
                company_id = random.choice(company_ids)
                
                # Calculate approximate distance and duration
                # In a real app, this would use a mapping API
                distance = random.randint(50, 800)  # km
                duration = int(distance * 1.2)  # minutes (approx 50km/h average speed)
                
                route = {
                    "id": str(uuid.uuid4()),
                    "company_id": company_id,
                    "origin_city": cities[i],
                    "destination_city": cities[j],
                    "distance_km": distance,
                    "duration_minutes": duration,
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
                
                sample_bus_routes.append(route)
                route_ids.append(route["id"])
    
    await db.bus_routes.insert_many(sample_bus_routes)
    
    # Create trips for each route
    print("🚏 إنشاء رحلات الحافلات...")
    for route_id in route_ids:
        # Get the route details
        route = await db.bus_routes.find_one({"id": route_id})
        
        # Get the company for this route
        company_id = route["company_id"]
        
        # Create 3 trips per route for the next 7 days
        for day in range(7):
            for departure_hour in [8, 12, 16]:  # 8 AM, 12 PM, 4 PM
                
                trip_date = datetime.now() + timedelta(days=day)
                
                # Calculate times as strings
                departure_time_str = f"{departure_hour:02d}:00"
                
                # Calculate arrival time (duration in minutes)
                total_minutes = departure_hour * 60 + route["duration_minutes"]
                arrival_hour = total_minutes // 60
                arrival_minute = total_minutes % 60
                
                # Handle overflow to next day
                if arrival_hour >= 24:
                    arrival_hour = arrival_hour % 24
                
                arrival_time_str = f"{arrival_hour:02d}:{arrival_minute:02d}"
                
                # Randomize bus type
                bus_type = random.choice(["standard", "premium", "vip"])
                
                # Set price based on distance and bus type
                base_price = route["distance_km"] * 0.5  # 0.5 DZD per km
                
                if bus_type == "premium":
                    price = base_price * 1.5
                elif bus_type == "vip":
                    price = base_price * 2
                else:
                    price = base_price
                
                # Set features based on bus type
                features = ["مكيف"]
                
                if bus_type == "premium":
                    features.extend(["واي فاي", "مقاعد مريحة"])
                
                if bus_type == "vip":
                    features.extend(["واي فاي", "مقاعد مريحة", "شاشات فردية", "وجبة خفيفة", "مشروبات"])
                
                # Total seats based on bus type
                if bus_type == "standard":
                    total_seats = 50
                elif bus_type == "premium":
                    total_seats = 40
                else:  # VIP
                    total_seats = 30
                
                trip = {
                    "id": str(uuid.uuid4()),
                    "route_id": route_id,
                    "company_id": company_id,
                    "bus_type": bus_type,
                    "departure_date": trip_date,
                    "departure_time": departure_time_str,
                    "arrival_time": arrival_time_str,
                    "available_seats": total_seats,
                    "total_seats": total_seats,
                    "price": round(price, 2),
                    "features": features,
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
                
                # Insert trip
                result = await db.bus_trips.insert_one(trip)
                trip_id = trip["id"]
                
                # Create seats for this trip
                seats = []
                for seat_num in range(1, total_seats + 1):
                    seat = {
                        "id": str(uuid.uuid4()),
                        "trip_id": trip_id,
                        "seat_number": str(seat_num),
                        "is_available": True,
                        "price": round(price, 2)
                    }
                    seats.append(seat)
                
                if seats:
                    await db.bus_seats.insert_many(seats)
    
    print("✅ تم زرع بيانات النقل بنجاح!")
    
    # Print some statistics
    companies_count = await db.bus_companies.count_documents({})
    routes_count = await db.bus_routes.count_documents({})
    trips_count = await db.bus_trips.count_documents({})
    seats_count = await db.bus_seats.count_documents({})
    
    print("\n-------------------------------------")
    print(f"👥 عدد شركات النقل: {companies_count}")
    print(f"🛣️ عدد المسارات: {routes_count}")
    print(f"🚌 عدد الرحلات: {trips_count}")
    print(f"💺 عدد المقاعد: {seats_count}")
    print("-------------------------------------\n")

if __name__ == "__main__":
    asyncio.run(seed_database())
