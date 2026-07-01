export type BodyType =
  | 'Hatchback'
  | 'Sedan'
  | 'SUV'
  | 'MUV'
  | 'EV Hatchback'
  | 'EV SUV'
  | 'EV Sedan'
  | 'EV Coupe SUV'
  | 'Coupe SUV';

export type FuelType = 'Petrol' | 'Diesel' | 'CNG' | 'EV' | 'Hybrid';

export type Transmission = 'Manual' | 'Automatic';

export type Car = {
  id: string;
  make: string;
  model: string;
  variant: string;
  price_lakh_inr: number;
  body_type: BodyType;
  fuel_type: FuelType;
  transmission: Transmission;
  mileage_kmpl: number;
  seating_capacity: number;
  safety_rating: number;
  segment: string;
  key_features: string[];
};

export const cars: Car[] = [
  {
    "id": "maruti-suzuki-alto-k10-vxi",
    "make": "Maruti Suzuki",
    "model": "Alto K10",
    "variant": "VXI",
    "price_lakh_inr": 4.99,
    "body_type": "Hatchback",
    "fuel_type": "Petrol",
    "transmission": "Manual",
    "mileage_kmpl": 24.39,
    "seating_capacity": 5,
    "safety_rating": 2,
    "segment": "Entry Hatchback",
    "key_features": [
      "Power steering",
      "Front airbags"
    ]
  },
  {
    "id": "maruti-suzuki-s-presso-vxi-plus",
    "make": "Maruti Suzuki",
    "model": "S-Presso",
    "variant": "VXI Plus",
    "price_lakh_inr": 5.85,
    "body_type": "Hatchback",
    "fuel_type": "Petrol",
    "transmission": "Manual",
    "mileage_kmpl": 24.84,
    "seating_capacity": 5,
    "safety_rating": 2,
    "segment": "Entry Hatchback",
    "key_features": [
      "Digital instrument cluster",
      "Rear parking sensors"
    ]
  },
  {
    "id": "maruti-suzuki-wagonr-vxi",
    "make": "Maruti Suzuki",
    "model": "WagonR",
    "variant": "VXI",
    "price_lakh_inr": 6.21,
    "body_type": "Hatchback",
    "fuel_type": "Petrol",
    "transmission": "Manual",
    "mileage_kmpl": 24.35,
    "seating_capacity": 5,
    "safety_rating": 2,
    "segment": "Hatchback",
    "key_features": [
      "Auto gear shift option",
      "5-inch touchscreen"
    ]
  },
  {
    "id": "maruti-suzuki-swift-zxi",
    "make": "Maruti Suzuki",
    "model": "Swift",
    "variant": "ZXI",
    "price_lakh_inr": 8.49,
    "body_type": "Hatchback",
    "fuel_type": "Petrol",
    "transmission": "Manual",
    "mileage_kmpl": 24.8,
    "seating_capacity": 5,
    "safety_rating": 2,
    "segment": "Premium Hatchback",
    "key_features": [
      "Smartwatch connectivity",
      "Auto AC"
    ]
  },
  {
    "id": "maruti-suzuki-baleno-zeta",
    "make": "Maruti Suzuki",
    "model": "Baleno",
    "variant": "Zeta",
    "price_lakh_inr": 9.49,
    "body_type": "Hatchback",
    "fuel_type": "Petrol",
    "transmission": "Manual",
    "mileage_kmpl": 22.94,
    "seating_capacity": 5,
    "safety_rating": 3,
    "segment": "Premium Hatchback",
    "key_features": [
      "Head-up display",
      "360 camera available"
    ]
  },
  {
    "id": "maruti-suzuki-dzire-zxi",
    "make": "Maruti Suzuki",
    "model": "Dzire",
    "variant": "ZXI",
    "price_lakh_inr": 9.15,
    "body_type": "Sedan",
    "fuel_type": "Petrol",
    "transmission": "Manual",
    "mileage_kmpl": 24.41,
    "seating_capacity": 5,
    "safety_rating": 3,
    "segment": "Compact Sedan",
    "key_features": [
      "6 airbags",
      "ESP"
    ]
  },
  {
    "id": "maruti-suzuki-ertiga-zxi-plus",
    "make": "Maruti Suzuki",
    "model": "Ertiga",
    "variant": "ZXI Plus",
    "price_lakh_inr": 11.9,
    "body_type": "MUV",
    "fuel_type": "Petrol",
    "transmission": "Manual",
    "mileage_kmpl": 20.51,
    "seating_capacity": 7,
    "safety_rating": 3,
    "segment": "MPV",
    "key_features": [
      "Triple row seating",
      "Cruise control"
    ]
  },
  {
    "id": "maruti-suzuki-brezza-zxi-plus",
    "make": "Maruti Suzuki",
    "model": "Brezza",
    "variant": "ZXI Plus",
    "price_lakh_inr": 12.5,
    "body_type": "SUV",
    "fuel_type": "Petrol",
    "transmission": "Manual",
    "mileage_kmpl": 19.8,
    "seating_capacity": 5,
    "safety_rating": 4,
    "segment": "Compact SUV",
    "key_features": [
      "360 camera",
      "Wireless charging"
    ]
  },
  {
    "id": "maruti-suzuki-grand-vitara-zeta",
    "make": "Maruti Suzuki",
    "model": "Grand Vitara",
    "variant": "Zeta",
    "price_lakh_inr": 13.96,
    "body_type": "SUV",
    "fuel_type": "Hybrid",
    "transmission": "Automatic",
    "mileage_kmpl": 27.97,
    "seating_capacity": 5,
    "safety_rating": 4,
    "segment": "Mid SUV",
    "key_features": [
      "Strong hybrid",
      "Head-up display"
    ]
  },
  {
    "id": "maruti-suzuki-fronx-zeta-turbo",
    "make": "Maruti Suzuki",
    "model": "Fronx",
    "variant": "Zeta Turbo",
    "price_lakh_inr": 11.4,
    "body_type": "SUV",
    "fuel_type": "Petrol",
    "transmission": "Manual",
    "mileage_kmpl": 20.01,
    "seating_capacity": 5,
    "safety_rating": 4,
    "segment": "Compact SUV",
    "key_features": [
      "Turbo engine",
      "Heads-up display"
    ]
  },
  {
    "id": "maruti-suzuki-invicto-zeta",
    "make": "Maruti Suzuki",
    "model": "Invicto",
    "variant": "Zeta",
    "price_lakh_inr": 28.42,
    "body_type": "MUV",
    "fuel_type": "Hybrid",
    "transmission": "Automatic",
    "mileage_kmpl": 23.24,
    "seating_capacity": 7,
    "safety_rating": 4,
    "segment": "Premium MPV",
    "key_features": [
      "Captain seats",
      "ADAS"
    ]
  },
  {
    "id": "hyundai-grand-i10-nios-sportz",
    "make": "Hyundai",
    "model": "Grand i10 Nios",
    "variant": "Sportz",
    "price_lakh_inr": 7.16,
    "body_type": "Hatchback",
    "fuel_type": "Petrol",
    "transmission": "Manual",
    "mileage_kmpl": 20.3,
    "seating_capacity": 5,
    "safety_rating": 3,
    "segment": "Hatchback",
    "key_features": [
      "8-inch touchscreen",
      "Wireless Android Auto"
    ]
  },
  {
    "id": "hyundai-i20-sportz",
    "make": "Hyundai",
    "model": "i20",
    "variant": "Sportz",
    "price_lakh_inr": 8.99,
    "body_type": "Hatchback",
    "fuel_type": "Petrol",
    "transmission": "Manual",
    "mileage_kmpl": 20.28,
    "seating_capacity": 5,
    "safety_rating": 3,
    "segment": "Premium Hatchback",
    "key_features": [
      "Bose sound system",
      "Sunroof"
    ]
  },
  {
    "id": "hyundai-aura-sx",
    "make": "Hyundai",
    "model": "Aura",
    "variant": "SX",
    "price_lakh_inr": 9.66,
    "body_type": "Sedan",
    "fuel_type": "Petrol",
    "transmission": "Manual",
    "mileage_kmpl": 20.5,
    "seating_capacity": 5,
    "safety_rating": 3,
    "segment": "Compact Sedan",
    "key_features": [
      "Cooled glovebox",
      "Rear AC vents"
    ]
  },
  {
    "id": "hyundai-venue-sx",
    "make": "Hyundai",
    "model": "Venue",
    "variant": "SX",
    "price_lakh_inr": 11.5,
    "body_type": "SUV",
    "fuel_type": "Petrol",
    "transmission": "Manual",
    "mileage_kmpl": 18.27,
    "seating_capacity": 5,
    "safety_rating": 3,
    "segment": "Compact SUV",
    "key_features": [
      "BlueLink connected tech",
      "Sunroof"
    ]
  },
  {
    "id": "hyundai-exter-sx",
    "make": "Hyundai",
    "model": "Exter",
    "variant": "SX",
    "price_lakh_inr": 10.85,
    "body_type": "SUV",
    "fuel_type": "Petrol",
    "transmission": "Manual",
    "mileage_kmpl": 19.4,
    "seating_capacity": 5,
    "safety_rating": 3,
    "segment": "Compact SUV",
    "key_features": [
      "Roof rails",
      "Voice assistant"
    ]
  },
  {
    "id": "hyundai-creta-sx",
    "make": "Hyundai",
    "model": "Creta",
    "variant": "SX",
    "price_lakh_inr": 17.4,
    "body_type": "SUV",
    "fuel_type": "Petrol",
    "transmission": "Automatic",
    "mileage_kmpl": 17.7,
    "seating_capacity": 5,
    "safety_rating": 3,
    "segment": "Mid SUV",
    "key_features": [
      "Panoramic sunroof",
      "ADAS Level 2"
    ]
  },
  {
    "id": "hyundai-verna-sx",
    "make": "Hyundai",
    "model": "Verna",
    "variant": "SX",
    "price_lakh_inr": 13.4,
    "body_type": "Sedan",
    "fuel_type": "Petrol",
    "transmission": "Automatic",
    "mileage_kmpl": 18.6,
    "seating_capacity": 5,
    "safety_rating": 3,
    "segment": "Mid Sedan",
    "key_features": [
      "Ventilated seats",
      "ADAS"
    ]
  },
  {
    "id": "hyundai-alcazar-platinum",
    "make": "Hyundai",
    "model": "Alcazar",
    "variant": "Platinum",
    "price_lakh_inr": 18.74,
    "body_type": "SUV",
    "fuel_type": "Petrol",
    "transmission": "Automatic",
    "mileage_kmpl": 14.85,
    "seating_capacity": 7,
    "safety_rating": 4,
    "segment": "Premium SUV",
    "key_features": [
      "6/7-seater option",
      "ADAS"
    ]
  },
  {
    "id": "hyundai-tucson-signature",
    "make": "Hyundai",
    "model": "Tucson",
    "variant": "Signature",
    "price_lakh_inr": 32.7,
    "body_type": "SUV",
    "fuel_type": "Diesel",
    "transmission": "Automatic",
    "mileage_kmpl": 17.4,
    "seating_capacity": 5,
    "safety_rating": 4,
    "segment": "Premium SUV",
    "key_features": [
      "Panoramic sunroof",
      "Adaptive cruise"
    ]
  },
  {
    "id": "tata-motors-tiago-xz-plus",
    "make": "Tata Motors",
    "model": "Tiago",
    "variant": "XZ Plus",
    "price_lakh_inr": 7.5,
    "body_type": "Hatchback",
    "fuel_type": "Petrol",
    "transmission": "Manual",
    "mileage_kmpl": 23.84,
    "seating_capacity": 5,
    "safety_rating": 4,
    "segment": "Hatchback",
    "key_features": [
      "Harman infotainment",
      "6 airbags option"
    ]
  },
  {
    "id": "tata-motors-tigor-xz-plus",
    "make": "Tata Motors",
    "model": "Tigor",
    "variant": "XZ Plus",
    "price_lakh_inr": 8.4,
    "body_type": "Sedan",
    "fuel_type": "Petrol",
    "transmission": "Manual",
    "mileage_kmpl": 20.3,
    "seating_capacity": 5,
    "safety_rating": 4,
    "segment": "Compact Sedan",
    "key_features": [
      "Voice assisted controls",
      "Rear camera"
    ]
  },
  {
    "id": "tata-motors-altroz-xz-plus",
    "make": "Tata Motors",
    "model": "Altroz",
    "variant": "XZ Plus",
    "price_lakh_inr": 9.7,
    "body_type": "Hatchback",
    "fuel_type": "Petrol",
    "transmission": "Manual",
    "mileage_kmpl": 19.05,
    "seating_capacity": 5,
    "safety_rating": 5,
    "segment": "Premium Hatchback",
    "key_features": [
      "5-star safety",
      "Sunroof"
    ]
  },
  {
    "id": "tata-motors-punch-creative",
    "make": "Tata Motors",
    "model": "Punch",
    "variant": "Creative",
    "price_lakh_inr": 9.6,
    "body_type": "SUV",
    "fuel_type": "Petrol",
    "transmission": "Manual",
    "mileage_kmpl": 20.09,
    "seating_capacity": 5,
    "safety_rating": 5,
    "segment": "Compact SUV",
    "key_features": [
      "5-star GNCAP rating",
      "Cruise control"
    ]
  },
  {
    "id": "tata-motors-nexon-creative-plus",
    "make": "Tata Motors",
    "model": "Nexon",
    "variant": "Creative Plus",
    "price_lakh_inr": 12.49,
    "body_type": "SUV",
    "fuel_type": "Petrol",
    "transmission": "Manual",
    "mileage_kmpl": 17.44,
    "seating_capacity": 5,
    "safety_rating": 5,
    "segment": "Compact SUV",
    "key_features": [
      "5-star safety",
      "Sunroof",
      "ADAS"
    ]
  },
  {
    "id": "tata-motors-harrier-adventure",
    "make": "Tata Motors",
    "model": "Harrier",
    "variant": "Adventure",
    "price_lakh_inr": 21.39,
    "body_type": "SUV",
    "fuel_type": "Diesel",
    "transmission": "Automatic",
    "mileage_kmpl": 16.8,
    "seating_capacity": 5,
    "safety_rating": 5,
    "segment": "Mid SUV",
    "key_features": [
      "Panoramic sunroof",
      "JBL sound"
    ]
  },
  {
    "id": "tata-motors-safari-adventure",
    "make": "Tata Motors",
    "model": "Safari",
    "variant": "Adventure",
    "price_lakh_inr": 22.49,
    "body_type": "SUV",
    "fuel_type": "Diesel",
    "transmission": "Automatic",
    "mileage_kmpl": 16.14,
    "seating_capacity": 7,
    "safety_rating": 5,
    "segment": "Premium SUV",
    "key_features": [
      "7-seater",
      "ADAS",
      "Terrain modes"
    ]
  },
  {
    "id": "tata-motors-tiago-ev-xz-plus",
    "make": "Tata Motors",
    "model": "Tiago EV",
    "variant": "XZ Plus",
    "price_lakh_inr": 9.99,
    "body_type": "Hatchback",
    "fuel_type": "EV",
    "transmission": "Automatic",
    "mileage_kmpl": 315,
    "seating_capacity": 5,
    "safety_rating": 4,
    "segment": "EV Hatchback",
    "key_features": [
      "315km range",
      "Fast charging"
    ]
  },
  {
    "id": "tata-motors-nexon-ev-creative-plus",
    "make": "Tata Motors",
    "model": "Nexon EV",
    "variant": "Creative Plus",
    "price_lakh_inr": 14.49,
    "body_type": "SUV",
    "fuel_type": "EV",
    "transmission": "Automatic",
    "mileage_kmpl": 325,
    "seating_capacity": 5,
    "safety_rating": 5,
    "segment": "EV SUV",
    "key_features": [
      "325km range",
      "5-star safety"
    ]
  },
  {
    "id": "tata-motors-punch-ev-creative",
    "make": "Tata Motors",
    "model": "Punch EV",
    "variant": "Creative",
    "price_lakh_inr": 10.99,
    "body_type": "SUV",
    "fuel_type": "EV",
    "transmission": "Automatic",
    "mileage_kmpl": 315,
    "seating_capacity": 5,
    "safety_rating": 5,
    "segment": "EV SUV",
    "key_features": [
      "315km range",
      "5-star safety"
    ]
  },
  {
    "id": "mahindra-bolero-b6",
    "make": "Mahindra",
    "model": "Bolero",
    "variant": "B6",
    "price_lakh_inr": 9.5,
    "body_type": "SUV",
    "fuel_type": "Diesel",
    "transmission": "Manual",
    "mileage_kmpl": 17.3,
    "seating_capacity": 7,
    "safety_rating": 3,
    "segment": "Rugged SUV",
    "key_features": [
      "High ground clearance",
      "Body-on-frame"
    ]
  },
  {
    "id": "mahindra-xuv300-w8",
    "make": "Mahindra",
    "model": "XUV300",
    "variant": "W8",
    "price_lakh_inr": 11.5,
    "body_type": "SUV",
    "fuel_type": "Petrol",
    "transmission": "Manual",
    "mileage_kmpl": 17.6,
    "seating_capacity": 5,
    "safety_rating": 5,
    "segment": "Compact SUV",
    "key_features": [
      "5-star safety",
      "Dual clutch auto option"
    ]
  },
  {
    "id": "mahindra-scorpio-n-z8",
    "make": "Mahindra",
    "model": "Scorpio N",
    "variant": "Z8",
    "price_lakh_inr": 16.95,
    "body_type": "SUV",
    "fuel_type": "Diesel",
    "transmission": "Manual",
    "mileage_kmpl": 16,
    "seating_capacity": 7,
    "safety_rating": 5,
    "segment": "Mid SUV",
    "key_features": [
      "4WD option",
      "ADAS"
    ]
  },
  {
    "id": "mahindra-xuv700-ax7",
    "make": "Mahindra",
    "model": "XUV700",
    "variant": "AX7",
    "price_lakh_inr": 22.49,
    "body_type": "SUV",
    "fuel_type": "Diesel",
    "transmission": "Automatic",
    "mileage_kmpl": 16,
    "seating_capacity": 7,
    "safety_rating": 5,
    "segment": "Premium SUV",
    "key_features": [
      "ADAS Level 2",
      "Panoramic sunroof"
    ]
  },
  {
    "id": "mahindra-thar-lx",
    "make": "Mahindra",
    "model": "Thar",
    "variant": "LX",
    "price_lakh_inr": 14.5,
    "body_type": "SUV",
    "fuel_type": "Diesel",
    "transmission": "Manual",
    "mileage_kmpl": 15.2,
    "seating_capacity": 4,
    "safety_rating": 4,
    "segment": "Off-road SUV",
    "key_features": [
      "4WD",
      "Convertible top"
    ]
  },
  {
    "id": "mahindra-xuv400-ev-ec",
    "make": "Mahindra",
    "model": "XUV400 EV",
    "variant": "EC",
    "price_lakh_inr": 16.74,
    "body_type": "SUV",
    "fuel_type": "EV",
    "transmission": "Automatic",
    "mileage_kmpl": 375,
    "seating_capacity": 5,
    "safety_rating": 5,
    "segment": "EV SUV",
    "key_features": [
      "375km range",
      "Fast charging"
    ]
  },
  {
    "id": "kia-sonet-htx",
    "make": "Kia",
    "model": "Sonet",
    "variant": "HTX",
    "price_lakh_inr": 11.3,
    "body_type": "SUV",
    "fuel_type": "Petrol",
    "transmission": "Manual",
    "mileage_kmpl": 18.4,
    "seating_capacity": 5,
    "safety_rating": 3,
    "segment": "Compact SUV",
    "key_features": [
      "Bose sound system",
      "UVO connected tech"
    ]
  },
  {
    "id": "kia-seltos-htx",
    "make": "Kia",
    "model": "Seltos",
    "variant": "HTX",
    "price_lakh_inr": 15.6,
    "body_type": "SUV",
    "fuel_type": "Petrol",
    "transmission": "Automatic",
    "mileage_kmpl": 16.8,
    "seating_capacity": 5,
    "safety_rating": 3,
    "segment": "Mid SUV",
    "key_features": [
      "Ventilated seats",
      "ADAS available"
    ]
  },
  {
    "id": "kia-carens-prestige",
    "make": "Kia",
    "model": "Carens",
    "variant": "Prestige",
    "price_lakh_inr": 12.45,
    "body_type": "MUV",
    "fuel_type": "Petrol",
    "transmission": "Manual",
    "mileage_kmpl": 16.9,
    "seating_capacity": 6,
    "safety_rating": 3,
    "segment": "Premium MPV",
    "key_features": [
      "6/7-seater",
      "Ventilated seats"
    ]
  },
  {
    "id": "toyota-glanza-v",
    "make": "Toyota",
    "model": "Glanza",
    "variant": "V",
    "price_lakh_inr": 8.8,
    "body_type": "Hatchback",
    "fuel_type": "Petrol",
    "transmission": "Manual",
    "mileage_kmpl": 22.35,
    "seating_capacity": 5,
    "safety_rating": 3,
    "segment": "Hatchback",
    "key_features": [
      "Toyota reliability",
      "6 airbags"
    ]
  },
  {
    "id": "toyota-urban-cruiser-taisor-v",
    "make": "Toyota",
    "model": "Urban Cruiser Taisor",
    "variant": "V",
    "price_lakh_inr": 9.5,
    "body_type": "SUV",
    "fuel_type": "Petrol",
    "transmission": "Manual",
    "mileage_kmpl": 20.01,
    "seating_capacity": 5,
    "safety_rating": 4,
    "segment": "Compact SUV",
    "key_features": [
      "Turbo engine",
      "360 camera"
    ]
  },
  {
    "id": "toyota-hyryder-v",
    "make": "Toyota",
    "model": "Hyryder",
    "variant": "V",
    "price_lakh_inr": 15.1,
    "body_type": "SUV",
    "fuel_type": "Hybrid",
    "transmission": "Automatic",
    "mileage_kmpl": 27.97,
    "seating_capacity": 5,
    "safety_rating": 4,
    "segment": "Mid SUV",
    "key_features": [
      "Strong hybrid",
      "AWD option"
    ]
  },
  {
    "id": "toyota-innova-crysta-gx",
    "make": "Toyota",
    "model": "Innova Crysta",
    "variant": "GX",
    "price_lakh_inr": 21.5,
    "body_type": "MUV",
    "fuel_type": "Diesel",
    "transmission": "Manual",
    "mileage_kmpl": 12.99,
    "seating_capacity": 7,
    "safety_rating": 4,
    "segment": "Premium MPV",
    "key_features": [
      "Best-in-class resale",
      "Captain seats"
    ]
  },
  {
    "id": "toyota-innova-hycross-vx",
    "make": "Toyota",
    "model": "Innova Hycross",
    "variant": "VX",
    "price_lakh_inr": 23.99,
    "body_type": "MUV",
    "fuel_type": "Hybrid",
    "transmission": "Automatic",
    "mileage_kmpl": 23.24,
    "seating_capacity": 7,
    "safety_rating": 5,
    "segment": "Premium MPV",
    "key_features": [
      "Strong hybrid",
      "Ventilated seats"
    ]
  },
  {
    "id": "toyota-fortuner-4x2-mt",
    "make": "Toyota",
    "model": "Fortuner",
    "variant": "4x2 MT",
    "price_lakh_inr": 33.4,
    "body_type": "SUV",
    "fuel_type": "Diesel",
    "transmission": "Manual",
    "mileage_kmpl": 12.55,
    "seating_capacity": 7,
    "safety_rating": 5,
    "segment": "Premium SUV",
    "key_features": [
      "Body-on-frame",
      "4x4 option"
    ]
  },
  {
    "id": "honda-amaze-vx",
    "make": "Honda",
    "model": "Amaze",
    "variant": "VX",
    "price_lakh_inr": 9,
    "body_type": "Sedan",
    "fuel_type": "Petrol",
    "transmission": "Manual",
    "mileage_kmpl": 18.6,
    "seating_capacity": 5,
    "safety_rating": 4,
    "segment": "Compact Sedan",
    "key_features": [
      "Honda Sensing safety suite"
    ]
  },
  {
    "id": "honda-city-zx",
    "make": "Honda",
    "model": "City",
    "variant": "ZX",
    "price_lakh_inr": 14.5,
    "body_type": "Sedan",
    "fuel_type": "Petrol",
    "transmission": "Automatic",
    "mileage_kmpl": 18.4,
    "seating_capacity": 5,
    "safety_rating": 4,
    "segment": "Mid Sedan",
    "key_features": [
      "Honda Sensing ADAS",
      "Sunroof"
    ]
  },
  {
    "id": "honda-elevate-zx",
    "make": "Honda",
    "model": "Elevate",
    "variant": "ZX",
    "price_lakh_inr": 17.2,
    "body_type": "SUV",
    "fuel_type": "Petrol",
    "transmission": "Automatic",
    "mileage_kmpl": 16.92,
    "seating_capacity": 5,
    "safety_rating": 5,
    "segment": "Mid SUV",
    "key_features": [
      "Honda Sensing ADAS",
      "Sunroof"
    ]
  },
  {
    "id": "skoda-kushaq-style",
    "make": "Skoda",
    "model": "Kushaq",
    "variant": "Style",
    "price_lakh_inr": 15.7,
    "body_type": "SUV",
    "fuel_type": "Petrol",
    "transmission": "Automatic",
    "mileage_kmpl": 18.07,
    "seating_capacity": 5,
    "safety_rating": 5,
    "segment": "Mid SUV",
    "key_features": [
      "German engineering",
      "6 airbags"
    ]
  },
  {
    "id": "skoda-slavia-style",
    "make": "Skoda",
    "model": "Slavia",
    "variant": "Style",
    "price_lakh_inr": 15.9,
    "body_type": "Sedan",
    "fuel_type": "Petrol",
    "transmission": "Automatic",
    "mileage_kmpl": 19.4,
    "seating_capacity": 5,
    "safety_rating": 5,
    "segment": "Mid Sedan",
    "key_features": [
      "TSI turbo engine",
      "Ventilated seats"
    ]
  },
  {
    "id": "volkswagen-virtus-gt",
    "make": "Volkswagen",
    "model": "Virtus",
    "variant": "GT",
    "price_lakh_inr": 16.2,
    "body_type": "Sedan",
    "fuel_type": "Petrol",
    "transmission": "Automatic",
    "mileage_kmpl": 19.4,
    "seating_capacity": 5,
    "safety_rating": 5,
    "segment": "Mid Sedan",
    "key_features": [
      "TSI turbo engine",
      "Digital cockpit"
    ]
  },
  {
    "id": "volkswagen-taigun-gt",
    "make": "Volkswagen",
    "model": "Taigun",
    "variant": "GT",
    "price_lakh_inr": 17,
    "body_type": "SUV",
    "fuel_type": "Petrol",
    "transmission": "Automatic",
    "mileage_kmpl": 18,
    "seating_capacity": 5,
    "safety_rating": 5,
    "segment": "Mid SUV",
    "key_features": [
      "German build quality",
      "6 airbags"
    ]
  },
  {
    "id": "renault-kwid-rxt",
    "make": "Renault",
    "model": "Kwid",
    "variant": "RXT",
    "price_lakh_inr": 5.7,
    "body_type": "Hatchback",
    "fuel_type": "Petrol",
    "transmission": "Manual",
    "mileage_kmpl": 22,
    "seating_capacity": 5,
    "safety_rating": 1,
    "segment": "Entry Hatchback",
    "key_features": [
      "SUV-like styling",
      "Digital cluster"
    ]
  },
  {
    "id": "renault-triber-rxz",
    "make": "Renault",
    "model": "Triber",
    "variant": "RXZ",
    "price_lakh_inr": 7.4,
    "body_type": "MUV",
    "fuel_type": "Petrol",
    "transmission": "Manual",
    "mileage_kmpl": 19,
    "seating_capacity": 7,
    "safety_rating": 4,
    "segment": "Compact MPV",
    "key_features": [
      "7-seater",
      "Modular seating"
    ]
  },
  {
    "id": "renault-kiger-rxz",
    "make": "Renault",
    "model": "Kiger",
    "variant": "RXZ",
    "price_lakh_inr": 10.5,
    "body_type": "SUV",
    "fuel_type": "Petrol",
    "transmission": "Manual",
    "mileage_kmpl": 19.88,
    "seating_capacity": 5,
    "safety_rating": 4,
    "segment": "Compact SUV",
    "key_features": [
      "Turbo engine",
      "Wireless Android Auto"
    ]
  },
  {
    "id": "nissan-magnite-xv-premium",
    "make": "Nissan",
    "model": "Magnite",
    "variant": "XV Premium",
    "price_lakh_inr": 10.9,
    "body_type": "SUV",
    "fuel_type": "Petrol",
    "transmission": "Manual",
    "mileage_kmpl": 19.94,
    "seating_capacity": 5,
    "safety_rating": 4,
    "segment": "Compact SUV",
    "key_features": [
      "360 camera",
      "Wireless Android Auto"
    ]
  },
  {
    "id": "mg-hector-sharp",
    "make": "MG",
    "model": "Hector",
    "variant": "Sharp",
    "price_lakh_inr": 18.2,
    "body_type": "SUV",
    "fuel_type": "Petrol",
    "transmission": "Automatic",
    "mileage_kmpl": 14.1,
    "seating_capacity": 5,
    "safety_rating": 5,
    "segment": "Mid SUV",
    "key_features": [
      "Panoramic sunroof",
      "ADAS",
      "Connected car"
    ]
  },
  {
    "id": "mg-astor-sharp",
    "make": "MG",
    "model": "Astor",
    "variant": "Sharp",
    "price_lakh_inr": 16.7,
    "body_type": "SUV",
    "fuel_type": "Petrol",
    "transmission": "Automatic",
    "mileage_kmpl": 15,
    "seating_capacity": 5,
    "safety_rating": 5,
    "segment": "Mid SUV",
    "key_features": [
      "AI assistant",
      "ADAS Level 2"
    ]
  },
  {
    "id": "mg-comet-ev-smart",
    "make": "MG",
    "model": "Comet EV",
    "variant": "Smart",
    "price_lakh_inr": 7.98,
    "body_type": "Hatchback",
    "fuel_type": "EV",
    "transmission": "Automatic",
    "mileage_kmpl": 230,
    "seating_capacity": 4,
    "safety_rating": 2,
    "segment": "EV Hatchback",
    "key_features": [
      "Compact city EV",
      "230km range"
    ]
  },
  {
    "id": "mg-zs-ev-excite",
    "make": "MG",
    "model": "ZS EV",
    "variant": "Excite",
    "price_lakh_inr": 18.98,
    "body_type": "SUV",
    "fuel_type": "EV",
    "transmission": "Automatic",
    "mileage_kmpl": 461,
    "seating_capacity": 5,
    "safety_rating": 5,
    "segment": "EV SUV",
    "key_features": [
      "461km range",
      "ADAS"
    ]
  },
  {
    "id": "mg-windsor-ev-essence",
    "make": "MG",
    "model": "Windsor EV",
    "variant": "Essence",
    "price_lakh_inr": 13.5,
    "body_type": "SUV",
    "fuel_type": "EV",
    "transmission": "Automatic",
    "mileage_kmpl": 331,
    "seating_capacity": 5,
    "safety_rating": 5,
    "segment": "EV SUV",
    "key_features": [
      "331km range",
      "Lounge-style seating"
    ]
  },
  {
    "id": "citroen-c3-shine",
    "make": "Citroen",
    "model": "C3",
    "variant": "Shine",
    "price_lakh_inr": 7.6,
    "body_type": "Hatchback",
    "fuel_type": "Petrol",
    "transmission": "Manual",
    "mileage_kmpl": 20,
    "seating_capacity": 5,
    "safety_rating": 4,
    "segment": "Hatchback",
    "key_features": [
      "SUV-styled hatchback",
      "Dual tone"
    ]
  },
  {
    "id": "citroen-c3-aircross-max",
    "make": "Citroen",
    "model": "C3 Aircross",
    "variant": "Max",
    "price_lakh_inr": 12.6,
    "body_type": "SUV",
    "fuel_type": "Petrol",
    "transmission": "Manual",
    "mileage_kmpl": 19.3,
    "seating_capacity": 5,
    "safety_rating": 5,
    "segment": "Compact SUV",
    "key_features": [
      "7-seater option",
      "Spacious cabin"
    ]
  },
  {
    "id": "jeep-compass-model-s",
    "make": "Jeep",
    "model": "Compass",
    "variant": "Model S",
    "price_lakh_inr": 21.5,
    "body_type": "SUV",
    "fuel_type": "Diesel",
    "transmission": "Automatic",
    "mileage_kmpl": 17.1,
    "seating_capacity": 5,
    "safety_rating": 5,
    "segment": "Mid SUV",
    "key_features": [
      "4x4 option",
      "Off-road capability"
    ]
  },
  {
    "id": "byd-atto-3-superior",
    "make": "BYD",
    "model": "Atto 3",
    "variant": "Superior",
    "price_lakh_inr": 28,
    "body_type": "SUV",
    "fuel_type": "EV",
    "transmission": "Automatic",
    "mileage_kmpl": 521,
    "seating_capacity": 5,
    "safety_rating": 5,
    "segment": "EV SUV",
    "key_features": [
      "521km range",
      "Blade battery"
    ]
  },
  {
    "id": "byd-seal-performance",
    "make": "BYD",
    "model": "Seal",
    "variant": "Performance",
    "price_lakh_inr": 53,
    "body_type": "Sedan",
    "fuel_type": "EV",
    "transmission": "Automatic",
    "mileage_kmpl": 580,
    "seating_capacity": 5,
    "safety_rating": 5,
    "segment": "EV Sedan",
    "key_features": [
      "580km range",
      "Dual motor AWD"
    ]
  },
  {
    "id": "tata-motors-curvv-accomplished",
    "make": "Tata Motors",
    "model": "Curvv",
    "variant": "Accomplished",
    "price_lakh_inr": 11.99,
    "body_type": "SUV",
    "fuel_type": "Petrol",
    "transmission": "Manual",
    "mileage_kmpl": 18.5,
    "seating_capacity": 5,
    "safety_rating": 5,
    "segment": "Coupe SUV",
    "key_features": [
      "Coupe styling",
      "5-star safety"
    ]
  },
  {
    "id": "tata-motors-curvv-ev-accomplished",
    "make": "Tata Motors",
    "model": "Curvv EV",
    "variant": "Accomplished",
    "price_lakh_inr": 17.49,
    "body_type": "SUV",
    "fuel_type": "EV",
    "transmission": "Automatic",
    "mileage_kmpl": 502,
    "seating_capacity": 5,
    "safety_rating": 5,
    "segment": "EV Coupe SUV",
    "key_features": [
      "502km range",
      "Sunroof"
    ]
  },
  {
    "id": "maruti-suzuki-jimny-zeta",
    "make": "Maruti Suzuki",
    "model": "Jimny",
    "variant": "Zeta",
    "price_lakh_inr": 13.96,
    "body_type": "SUV",
    "fuel_type": "Petrol",
    "transmission": "Manual",
    "mileage_kmpl": 16.39,
    "seating_capacity": 4,
    "safety_rating": 4,
    "segment": "Off-road SUV",
    "key_features": [
      "Ladder frame",
      "4WD"
    ]
  },
  {
    "id": "maruti-suzuki-xl6-zeta-plus",
    "make": "Maruti Suzuki",
    "model": "XL6",
    "variant": "Zeta Plus",
    "price_lakh_inr": 13,
    "body_type": "MUV",
    "fuel_type": "Petrol",
    "transmission": "Manual",
    "mileage_kmpl": 20.97,
    "seating_capacity": 6,
    "safety_rating": 3,
    "segment": "Premium MPV",
    "key_features": [
      "Captain seats",
      "Premium interior"
    ]
  },
  {
    "id": "hyundai-ioniq-5-signature",
    "make": "Hyundai",
    "model": "Ioniq 5",
    "variant": "Signature",
    "price_lakh_inr": 46.85,
    "body_type": "SUV",
    "fuel_type": "EV",
    "transmission": "Automatic",
    "mileage_kmpl": 631,
    "seating_capacity": 5,
    "safety_rating": 5,
    "segment": "EV SUV",
    "key_features": [
      "631km range",
      "V2L charging"
    ]
  },
  {
    "id": "kia-ev6-gt-line",
    "make": "Kia",
    "model": "EV6",
    "variant": "GT Line",
    "price_lakh_inr": 65.95,
    "body_type": "SUV",
    "fuel_type": "EV",
    "transmission": "Automatic",
    "mileage_kmpl": 663,
    "seating_capacity": 5,
    "safety_rating": 5,
    "segment": "EV SUV",
    "key_features": [
      "663km range",
      "Fast charging"
    ]
  }
];
