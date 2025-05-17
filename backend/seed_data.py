import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from datetime import datetime, timedelta
import uuid
from passlib.context import CryptContext

# Load environment variables
load_dotenv()

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'dz_smart_booking')]

# Password hashing for demo user
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Sample data
sample_user = {
    "id": str(uuid.uuid4()),
    "email": "user@example.com",
    "full_name": "مستخدم تجريبي",
    "phone_number": "0555123456",
    "hashed_password": pwd_context.hash("password123"),
    "is_active": True,
    "created_at": datetime.utcnow(),
    "updated_at": datetime.utcnow()
}

sample_hotels = [
    {
        "id": str(uuid.uuid4()),
        "name": "فندق الجزائر الكبير",
        "city": "algiers",
        "address": "شارع فرانز فانون، الجزائر العاصمة",
        "description": """فندق فاخر يقع في قلب العاصمة الجزائرية، يوفر إطلالات رائعة على البحر المتوسط والمدينة التاريخية.

المرافق تشمل مسبح خارجي، مطاعم متنوعة، مركز أعمال، وخدمة الواي فاي المجانية. يعتبر هذا الفندق خياراً مثالياً لرجال الأعمال والسياح على حد سواء.

الفندق قريب من أهم المعالم السياحية في المدينة، بما في ذلك مقام الشهيد، والمتحف الوطني، والقصبة التاريخية.""",
        "stars": 5,
        "amenities": ["واي فاي مجاني", "مسبح", "مطعم", "صالة رياضية", "موقف سيارات", "خدمة الغرف", "مركز أعمال"],
        "images": [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
            "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
            "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        ],
        "rating": 4.7,
        "reviews_count": 120,
        "latitude": 36.7539,
        "longitude": 3.0589,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "فندق وهران الساحلي",
        "city": "oran",
        "address": "شاطئ الأندلس، وهران",
        "description": """فندق راقي يقع على شاطئ الأندلس الشهير في وهران، ويوفر إقامة مريحة مع إطلالات خلابة على البحر المتوسط.

جميع الغرف مجهزة بتكييف الهواء، تلفزيون بشاشة مسطحة، وحمام خاص. يضم الفندق عدة مطاعم تقدم المأكولات الجزائرية والعالمية، بالإضافة إلى بار على السطح.

يقع الفندق على بعد 15 دقيقة فقط من وسط المدينة و20 دقيقة من مطار وهران.""",
        "stars": 4,
        "amenities": ["واي فاي مجاني", "شاطئ خاص", "مسبح", "مطعم", "إطلالة على البحر"],
        "images": [
            "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80",
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80",
            "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        ],
        "rating": 4.2,
        "reviews_count": 86,
        "latitude": 35.7102,
        "longitude": -0.6257,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "فندق قسنطينة الحديث",
        "city": "constantine",
        "address": "شارع زيغود يوسف، قسنطينة",
        "description": """فندق عصري يقع في مدينة قسنطينة التاريخية، ويتميز بتصميم أنيق يجمع بين التراث المحلي واللمسات العصرية.

يوفر الفندق غرفًا واسعة ومريحة مع خدمة الواي فاي المجانية، تكييف الهواء، وتلفزيون بشاشة مسطحة. كما يضم مطعمًا يقدم المأكولات المحلية والعالمية، وصالة للياقة البدنية.

يتميز موقع الفندق بقربه من جسر سيدي مسيد الشهير وغيره من المعالم السياحية في المدينة.""",
        "stars": 4,
        "amenities": ["واي فاي مجاني", "مطعم", "صالة رياضية", "خدمة نقل المطار", "موقف سيارات"],
        "images": [
            "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
            "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        ],
        "rating": 4.0,
        "reviews_count": 64,
        "latitude": 36.3650,
        "longitude": 6.6100,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "فندق عنابة بلازا",
        "city": "annaba",
        "address": "شارع الإستقلال، عنابة",
        "description": """فندق فاخر في قلب مدينة عنابة الساحلية، يتميز بموقعه المركزي وإطلالاته الرائعة على البحر.

يقدم الفندق مجموعة متنوعة من الغرف والأجنحة المجهزة بأحدث وسائل الراحة، بما في ذلك تكييف الهواء، تلفزيون بشاشة مسطحة، وميني بار.

المرافق تشمل مسبح خارجي، مطعم يقدم المأكولات البحرية الطازجة، وصالة للمناسبات. موقع الفندق مثالي لاستكشاف شاطئ سيدي سالم والمعالم التاريخية في المدينة.""",
        "stars": 5,
        "amenities": ["واي فاي مجاني", "مسبح", "مطعم", "إطلالة على البحر", "خدمة الغرف", "نادي صحي"],
        "images": [
            "https://images.unsplash.com/photo-1586611292717-f828b167408c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
            "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1474&q=80",
            "https://images.unsplash.com/photo-1602002418082-dd4a8f7d85f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
        ],
        "rating": 4.5,
        "reviews_count": 95,
        "latitude": 36.9000,
        "longitude": 7.7660,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
]

sample_rooms = []

# Create rooms for each hotel
for hotel in sample_hotels:
    hotel_id = hotel["id"]
    
    # Standard Room
    standard_room = {
        "id": str(uuid.uuid4()),
        "hotel_id": hotel_id,
        "name": "غرفة قياسية",
        "description": "غرفة مريحة مع سرير مزدوج أو سريرين منفصلين، مناسبة للإقامة القصيرة أو الطويلة",
        "price_per_night": 5000 if hotel["stars"] <= 3 else (7000 if hotel["stars"] == 4 else 9000),
        "capacity": 2,
        "available": True,
        "images": [
            "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
        ]
    }
    
    # Deluxe Room
    deluxe_room = {
        "id": str(uuid.uuid4()),
        "hotel_id": hotel_id,
        "name": "غرفة ديلوكس",
        "description": "غرفة فاخرة مع سرير كبير ومساحة واسعة، تتميز بديكور أنيق وإطلالات رائعة",
        "price_per_night": 7000 if hotel["stars"] <= 3 else (9000 if hotel["stars"] == 4 else 12000),
        "capacity": 2,
        "available": True,
        "images": [
            "https://images.unsplash.com/photo-1595575129903-a489364cb29b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
            "https://images.unsplash.com/photo-1590490359683-658d3d23f972?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
        ]
    }
    
    # Family Room
    family_room = {
        "id": str(uuid.uuid4()),
        "hotel_id": hotel_id,
        "name": "غرفة عائلية",
        "description": "غرفة واسعة مثالية للعائلات، تتسع لأربعة أشخاص مع خيارات أسرّة متعددة",
        "price_per_night": 9000 if hotel["stars"] <= 3 else (12000 if hotel["stars"] == 4 else 15000),
        "capacity": 4,
        "available": True,
        "images": [
            "https://images.unsplash.com/photo-1598927379758-3ad591c32245?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        ]
    }
    
    sample_rooms.extend([standard_room, deluxe_room, family_room])

sample_booking = {
    "id": str(uuid.uuid4()),
    "user_id": sample_user["id"],
    "hotel_id": sample_hotels[0]["id"],
    "room_id": sample_rooms[0]["id"],
    "check_in_date": datetime.utcnow() + timedelta(days=7),
    "check_out_date": datetime.utcnow() + timedelta(days=10),
    "guests_count": 2,
    "special_requests": "نفضل غرفة في الطابق العلوي مع إطلالة على البحر إن أمكن",
    "status": "confirmed",
    "total_price": sample_rooms[0]["price_per_night"] * 3,  # 3 nights
    "created_at": datetime.utcnow(),
    "updated_at": datetime.utcnow()
}

async def seed_database():
    print("🌱 بدء زرع البيانات في قاعدة البيانات...")
    
    # Clear existing data
    print("🧹 مسح البيانات الموجودة...")
    await db.users.delete_many({})
    await db.hotels.delete_many({})
    await db.rooms.delete_many({})
    await db.bookings.delete_many({})
    
    # Insert sample data
    print("👤 إضافة بيانات المستخدم التجريبي...")
    await db.users.insert_one(sample_user)
    
    print("🏨 إضافة بيانات الفنادق...")
    await db.hotels.insert_many(sample_hotels)
    
    print("🛏️ إضافة بيانات الغرف...")
    await db.rooms.insert_many(sample_rooms)
    
    print("📅 إضافة بيانات الحجز التجريبي...")
    await db.bookings.insert_one(sample_booking)
    
    print("✅ تم زرع البيانات بنجاح!")
    
    # Print login details
    print("\n-------------------------------------")
    print("🔑 بيانات تسجيل الدخول للاختبار:")
    print(f"البريد الإلكتروني: {sample_user['email']}")
    print("كلمة المرور: password123")
    print("-------------------------------------\n")

if __name__ == "__main__":
    asyncio.run(seed_database())
