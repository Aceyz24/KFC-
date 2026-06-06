import { MenuItem, Branch, JobOpening } from './types';

export const initialMenuItems: MenuItem[] = [
  // Fried Chicken Category
  {
    id: 'fc-street1',
    name: 'Streetwise 1',
    category: 'Fried Chicken',
    price: 350,
    calories: 480,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=500',
    description: '1 Piece of our signature hand-breaded Original Recipe or Hot & Crispy chicken with regular, gold-standard Nairobi golden fries.',
    popular: true,
    rating: 4.8
  },
  {
    id: 'fc-street2',
    name: 'Streetwise 2',
    category: 'Fried Chicken',
    price: 490,
    calories: 720,
    image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&q=80&w=500',
    description: '2 Pieces of crispy chicken, hand-coated in 11 secret herbs and spices, paired with a regular portion of crisp seasoned fries.',
    popular: true,
    rating: 4.9
  },
  {
    id: 'fc-street3',
    name: 'Streetwise 3',
    category: 'Fried Chicken',
    price: 650,
    calories: 960,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=500',
    description: '3 Pieces of crispy golden-fried chicken served with a regular golden chips packet. A customer-favorite Nairobi special.',
    popular: false,
    rating: 4.7
  },
  {
    id: 'fc-wings10',
    name: 'Wingman (10 Hot Wings)',
    category: 'Fried Chicken',
    price: 850,
    calories: 800,
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&q=80&w=500',
    description: '10 fiery, hot & crunchy wings tossed or served with a standard zesty Nairobi pepper seasoning pack.',
    popular: true,
    rating: 4.9
  },

  // Burgers Category
  {
    id: 'b-crunch',
    name: 'Crunch Burger',
    category: 'Burgers',
    price: 450,
    calories: 520,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=500',
    description: 'Crispy fried chicken breast fillet, fresh shredded lettuce, and rich creamy mayonnaise served on a freshly toasted sesame seed bun.',
    popular: true,
    rating: 4.6
  },
  {
    id: 'b-colonel',
    name: "Colonel's Cheese Burger",
    category: 'Burgers',
    price: 600,
    calories: 640,
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=500',
    description: 'Double hand-breaded chicken fillet, melted cheddar cheese, fresh slices of tomato, sliced pickle, lettuce, and secret burger sauce.',
    popular: true,
    rating: 4.8
  },
  {
    id: 'b-kuku',
    name: 'Kuku Tower Burger',
    category: 'Burgers',
    price: 690,
    calories: 780,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&q=80&w=500',
    description: 'A towering creation of chicken fillet, crispy hash brown potato slice, cheddar slice, fresh crisp lettuce, tomato, and tangy salsa.',
    popular: false,
    rating: 4.5
  },

  // Wraps Category
  {
    id: 'w-twister',
    name: 'Twister Wrap',
    category: 'Wraps',
    price: 550,
    calories: 580,
    image: 'https://images.unsplash.com/photo-1626700051175-6518c4793f4f?auto=format&fit=crop&q=80&w=500',
    description: 'Warm tortilla wrap snugly holding two crisp chicken strips, fresh diced tomatoes, shredded crisp lettuce, and dynamic mayo dressing.',
    popular: true,
    rating: 4.7
  },
  {
    id: 'w-chili',
    name: 'Fiery Sweet Chilli Wrap',
    category: 'Wraps',
    price: 580,
    calories: 610,
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&q=80&w=500',
    description: 'Traditional toasted wrap loaded with hot chicken strips, sweet chilli glaze sauce, premium lettuce, and fresh green onions.',
    popular: false,
    rating: 4.4
  },

  // Fries Category
  {
    id: 'f-reg',
    name: 'Regular Golden Fries',
    category: 'Fries',
    price: 180,
    calories: 290,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=500',
    description: 'Perfectly cut premium potatoes, crispy golden on the outside, light and soft fluffy on the inside.',
    popular: false,
    rating: 4.5
  },
  {
    id: 'f-masala',
    name: 'Large Masala Chips',
    category: 'Fries',
    price: 320,
    calories: 450,
    image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&q=80&w=500',
    description: 'Classic crisped fries thoroughly coated in a rich, spicy, native Kenyan masala thick dipping marinade - hot and delicious.',
    popular: true,
    rating: 4.9
  },

  // Drinks Category
  {
    id: 'd-soda350',
    name: 'Carbonated Soda (350ml)',
    category: 'Drinks',
    price: 100,
    calories: 140,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=500',
    description: 'Refreshing cold soft drink. Choose from Coca-Cola, Fanta, Sprite, or Krest during checkout.',
    popular: false,
    rating: 4.3
  },
  {
    id: 'd-krushers',
    name: 'Berry Krusher Float',
    category: 'Drinks',
    price: 290,
    calories: 320,
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=500',
    description: 'Our signature blended frozen treat with forest mixed berries, cream layers, and soft chocolate chunks.',
    popular: true,
    rating: 4.8
  },

  // Buckets Category
  {
    id: 'bk-nbi9',
    name: 'Nairobi Hot 9 Bucket',
    category: 'Buckets',
    price: 1850,
    calories: 2400,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=500',
    description: 'A local standard: 9 pieces of our signature hot & crispy chicken, sharing pack seasoned to perfect Nairobi tastes.',
    popular: true,
    rating: 4.9
  },
  {
    id: 'bk-original15',
    name: 'Original Colonel 15 Bucket',
    category: 'Buckets',
    price: 2900,
    calories: 3900,
    image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&q=80&w=500',
    description: 'A monster feast: 15 pieces of crispy chicken hand-coated in 11 secret herbs and spices. Perfect for parties.',
    popular: false,
    rating: 4.8
  },

  // Family Meals Category
  {
    id: 'fm-nbi-feast',
    name: 'Nairobi Family Feast',
    category: 'Family Meals',
    price: 3200,
    calories: 3800,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=500',
    description: '8 pieces of chicken, 2 large golden chips pack, 1 sweet coleslaw tub, and a refreshing chilled 2 Litre soda.',
    popular: true,
    rating: 4.9
  },
  {
    id: 'fm-ultimate',
    name: 'Ultimate Mega Feast',
    category: 'Family Meals',
    price: 4950,
    calories: 5200,
    image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&q=80&w=500',
    description: '12 pieces of chicken, 9 spicy wings, 3 large golden fries, 2 sweet coleslaws, and a large 2 Litre soda.',
    popular: false,
    rating: 4.7
  },

  // Desserts Category
  {
    id: 'ds-donut',
    name: 'Choc Cream Doughnut',
    category: 'Desserts',
    price: 180,
    calories: 250,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=500',
    description: 'A fluffy hand-made doughnut topped with sweet milk chocolate fudge and filled inside with luxurious cold vanilla cream.',
    popular: false,
    rating: 4.5
  },
  {
    id: 'ds-float',
    name: 'Malindi Sunrise Float',
    category: 'Desserts',
    price: 250,
    calories: 290,
    image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=500',
    description: 'Creamy double-scooped vanilla bean ice cream floating inside sparkling Fanta Passion - a delicious seaside treat.',
    popular: true,
    rating: 4.8
  }
];

export const nairobiBranches: Branch[] = [
  {
    id: 'br-kimathi',
    name: 'Kimathi Street (CBD)',
    address: 'Kimathi Street, opposite IPS Building, Nairobi Central Business District',
    coords: { lat: -1.2842, lng: 36.8227 },
    phone: '+254 700 111 001',
    hours: '07:00 AM - Midnight (Everyday)'
  },
  {
    id: 'br-westlands',
    name: 'Westlands Mall Branch',
    address: 'Ground Floor, Woodvale Grove, Westlands, Nairobi',
    coords: { lat: -1.2644, lng: 36.8044 },
    phone: '+254 700 111 002',
    hours: '08:00 AM - 11:00 PM (Everyday)'
  },
  {
    id: 'br-junction',
    name: 'Junction Mall Branch',
    address: 'Food Court, The Junction Mall, Ngong Road, Nairobi',
    coords: { lat: -1.3005, lng: 36.7621 },
    phone: '+254 700 111 003',
    hours: '09:00 AM - 10:00 PM (Everyday)'
  },
  {
    id: 'br-galleria',
    name: 'Galleria Mall Branch',
    address: 'Galleria Shopping Mall, Junction of Langata Road & Magadi Road, Karen, Nairobi',
    coords: { lat: -1.3411, lng: 36.7725 },
    phone: '+254 700 111 004',
    hours: '08:00 AM - 11:00 PM (Everyday)'
  },
  {
    id: 'br-kilimani',
    name: 'Kilimani Yaya Branch',
    address: 'Argwings Kodhek Road, adjacent to Yaya Centre, Kilimani, Nairobi',
    coords: { lat: -1.2917, lng: 36.7983 },
    phone: '+254 700 111 005',
    hours: '07:00 AM - Midnight (Everyday)'
  },
  {
    id: 'br-hub',
    name: 'The Hub Karen Branch',
    address: 'The Hub Karen, Dagoretti Road, Karen, Nairobi',
    coords: { lat: -1.3214, lng: 36.7028 },
    phone: '+254 700 111 006',
    hours: '09:00 AM - 10:00 PM (Everyday)'
  }
];

export const initialCareers: JobOpening[] = [
  {
    id: 'job-chef',
    title: 'Fry Cook & Chicken Specialist',
    department: 'Kitchen Operations',
    location: 'Nairobi Branches (Kimathi, Westlands, Galleria)',
    type: 'Full-time',
    salaryRange: 'KES 45,000 - KES 60,000 / month',
    description: 'Looking for a dedicated prep enthusiast who will master the sacred 11 secret herbs and spices recipe. You will keep chicken crispy, golden, and fresh according to highest hygenic standards.',
    requirements: [
      'Experience in fast-paced commercial kitchens is a plus, but enthusiasm is key.',
      'Strong commitment to food safety, sanitation, and hygiene standards.',
      'Capable of working efficiently during peak rush hours (lunch and dinner).',
      'Team player with a bright energy.'
    ]
  },
  {
    id: 'job-cashier',
    title: 'Customer Experience & Cashier Agent',
    department: 'Front of House',
    location: 'Nairobi Branches (All Areas)',
    type: 'Full-time / Part-time',
    salaryRange: 'KES 35,000 - KES 48,000 / month',
    description: 'You are the face of KFC Nairobi. You will welcome hungry locals, guide users on the electronic menu systems, confirm orders with a warm smile, and capture payment options (M-Pesa, Visa).',
    requirements: [
      'Exceptional customer communications and active listening skills.',
      'Previous cashier or retail POS experience is an asset.',
      'Quick with basic math and handling transactions secure and cleanly.',
      'Fluent in Swahili and English.'
    ]
  },
  {
    id: 'job-delivery',
    title: 'Express Delivery Rider',
    department: 'Logistics',
    location: 'Nairobi Central Dispatch (Kilimani Hub)',
    type: 'Full-time',
    salaryRange: 'KES 40,000 - KES 55,000 / month + tips',
    description: 'Deliver sizzling, hot & crispy boxes of happiness direct to Nairobi homes. Using highly optimized thermal delivery packs, you will safely and swiftly navigate Nairobi traffic to make families smile.',
    requirements: [
      'Valid Kenyan motorcycle driving license and clean driving history.',
      'Extensive familiarity with Nairobi streets, backroads, shortcuts, and shortcuts in Kilimani, Westlands, CBD, or Karen.',
      'Own or operate a clean, certified delivery bike (optional - company bikes available).',
      'Extremely polite and customer-facing.'
    ]
  }
];

export const faqs = [
  {
    question: 'How do I pay using M-Pesa on this portal?',
    answer: 'Simply select the Mobile Money / M-Pesa option during checkout, enter your M-Pesa active phone number (in format 07xxxxxxxx or 254xxxxxxxxx) and submit. A simulated M-Pesa STK Push prompt will be activated with a clean numeric countdown. Confirm and authorize payment simulated live on screen!'
  },
  {
    question: 'Is the chicken Halal certified?',
    answer: 'Absolutely! 100% of our chicken processed at all KFC Nairobi branches is strictly sourced from local, fully certified Halal suppliers. Our hygiene commitments are of international standard.'
  },
  {
    question: 'What is the standard delivery fee in Nairobi?',
    answer: 'We charge a flat-rate delivery fee of KES 150 for any locations within an 8km distance of our branches. For distances beyond that, a mild top-up may apply automatically during coordinates matching.'
  },
  {
    question: 'How does the AI Meal Recommendation tool work?',
    answer: 'Our smart AI assistant connected directly to Gemini 3.5-flash analyzes your budget in KES, dietary profile (like Halal or Spicy-lover), hunger state, and current mood to custom craft a perfect pairing of meals and buckets - often proposing an special discount code!'
  },
  {
    question: 'Can I apply to work at KFC Nairobi?',
    answer: "Yes! Navigate to our 'Careers' tab, read through the job descriptions for Cook, Cashier, or Rider, and submit your application form. Our recruiting office in Westlands will review and reach out immediately."
  }
];
