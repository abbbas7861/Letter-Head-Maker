import { icons } from 'lucide-react';

export type LucideIconName = keyof typeof icons;

export const ALL_ICON_NAMES = Object.keys(icons) as LucideIconName[];

interface TradeRule {
  label: string;
  keywords: string[];
  icons: string[];
}

const TRADE_RULES: TradeRule[] = [
  {
    label: 'Medical & Pharmacy',
    keywords: [
      'clinic', 'hospital', 'medical', 'medicos', 'pharmacy', 'pharma', 'chemist',
      'medicine', 'medicines', 'drug', 'drugs', 'health', 'healthcare', 'care',
      'diagnostic', 'diagnostics', 'lab', 'laboratory', 'pathology', 'surgical',
      'surgeon', 'doctor', 'dr.', 'physician', 'cure', 'remedy', 'therapy',
    ],
    icons: ['Cross', 'Stethoscope', 'Pill', 'HeartPulse', 'Hospital', 'Syringe', 'Microscope', 'Activity', 'Bandage'],
  },
  {
    label: 'Dental & Oral Care',
    keywords: ['dental', 'dentist', 'orthodontic', 'smile', 'teeth', 'tooth'],
    icons: ['Smile', 'HeartPulse', 'Cross', 'ShieldCheck', 'Stethoscope'],
  },
  {
    label: 'Hardware & Tools',
    keywords: [
      'hardware', 'tools', 'tool', 'sanitary', 'plumbing', 'plumber', 'pipe', 'pipes',
      'fittings', 'nut', 'bolt', 'screw', 'wrench', 'hammer', 'workshop', 'machinery',
      'mill', 'engineering', 'mechanical', 'lathe', 'industrial', 'factory',
    ],
    icons: ['Wrench', 'Hammer', 'Drill', 'Nut', 'Cog', 'Settings', 'Factory', 'Axe', 'Pickaxe'],
  },
  {
    label: 'Welding & Metalwork',
    keywords: ['welding', 'weld', 'steel', 'iron', 'metal', 'fabrication', 'aluminum', 'aluminium', 'forge'],
    icons: ['Flame', 'Anvil', 'Wrench', 'Factory', 'Shield', 'Hammer'],
  },
  {
    label: 'Paint, Marble & Interior',
    keywords: [
      'paint', 'paints', 'color', 'colors', 'colour', 'marble', 'granite', 'tiles', 'tile',
      'ceramic', 'ceramics', 'interior', 'interiors', 'decor', 'decoration', 'wallpaper',
    ],
    icons: ['Paintbrush', 'PaintBucket', 'Palette', 'Layers', 'Grid2x2', 'Brush', 'Frame'],
  },
  {
    label: 'Timber, Plywood & Furniture',
    keywords: [
      'timber', 'wood', 'plywood', 'carpenter', 'carpentry', 'furniture', 'sofa',
      'bed', 'mattress', 'foam', 'cabinet', 'chair', 'table', 'home decor',
    ],
    icons: ['Armchair', 'Sofa', 'BedDouble', 'Lamp', 'Trees', 'DoorOpen', 'Hammer'],
  },
  {
    label: 'Electronics & Tech',
    keywords: [
      'electronics', 'electronic', 'electric', 'electrical', 'appliances', 'computer',
      'computers', 'laptop', 'laptops', 'tech', 'technology', 'technologies', 'digital',
      'software', 'systems', 'solutions', 'it ', 'cyber', 'data', 'network', 'cctv',
      'camera', 'surveillance', 'automation',
    ],
    icons: ['Cpu', 'CircuitBoard', 'Laptop', 'Monitor', 'PlugZap', 'Zap', 'Server', 'Code2', 'Cctv'],
  },
  {
    label: 'Mobile & Telecom',
    keywords: ['mobile', 'mobiles', 'phone', 'phones', 'telecom', 'cellular', 'communication', 'wireless', 'wifi', 'sim'],
    icons: ['Smartphone', 'PhoneCall', 'Wifi', 'Radio', 'TabletSmartphone', 'Signal'],
  },
  {
    label: 'Solar & Power',
    keywords: ['solar', 'energy', 'power', 'battery', 'batteries', 'inverter', 'ups', 'generator', 'panel', 'panels'],
    icons: ['Sun', 'BatteryCharging', 'Zap', 'Plug', 'Lightbulb', 'Power'],
  },
  {
    label: 'Jewellery & Gold',
    keywords: [
      'jewel', 'jewels', 'jeweller', 'jewellers', 'jewellery', 'jewelry', 'gold',
      'silver', 'diamond', 'diamonds', 'gem', 'gems', 'sarafa', 'ornament', 'pearl', 'bridal',
    ],
    icons: ['Gem', 'Crown', 'Diamond', 'Award', 'Star', 'Watch'],
  },
  {
    label: 'Watches & Timepieces',
    keywords: ['watch', 'watches', 'clock', 'timepiece', 'horology'],
    icons: ['Watch', 'Clock', 'Timer', 'Hourglass'],
  },
  {
    label: 'Bakery & Sweets',
    keywords: [
      'bakery', 'bakers', 'bake', 'cake', 'cakes', 'pastry', 'pastries', 'sweets',
      'sweet', 'mithai', 'dessert', 'desserts', 'donut', 'croissant', 'confectionery', 'biscuit',
    ],
    icons: ['Cake', 'CakeSlice', 'Croissant', 'Cookie', 'Donut', 'Candy', 'ChefHat'],
  },
  {
    label: 'Coffee & Tea',
    keywords: ['coffee', 'cafe', 'café', 'espresso', 'roastery', 'tea', 'chai', 'teahouse', 'beverage'],
    icons: ['Coffee', 'CupSoda', 'Leaf', 'Bean'],
  },
  {
    label: 'Restaurant & Catering',
    keywords: [
      'restaurant', 'food', 'foods', 'kitchen', 'catering', 'caterers', 'grill',
      'bbq', 'pizza', 'burger', 'biryani', 'tandoor', 'diner', 'bistro', 'hotel', 'dhaba',
    ],
    icons: ['Utensils', 'ChefHat', 'Pizza', 'Soup', 'Flame', 'UtensilsCrossed', 'Sandwich'],
  },
  {
    label: 'Grocery & Supermart',
    keywords: [
      'mart', 'supermarket', 'grocery', 'grocers', 'kiryana', 'provision', 'departmental',
      'general store', 'store', 'bazaar', 'hypermarket', 'retail', 'shop',
    ],
    icons: ['ShoppingBag', 'ShoppingCart', 'Store', 'Basket', 'Package', 'Tag'],
  },
  {
    label: 'Dairy, Poultry & Farm',
    keywords: [
      'dairy', 'milk', 'butter', 'cheese', 'poultry', 'hatchery', 'chicken', 'egg',
      'eggs', 'farm', 'farms', 'livestock', 'cattle', 'meat', 'butcher', 'beef', 'mutton',
    ],
    icons: ['Milk', 'Egg', 'Bird', 'Tractor', 'Wheat', 'Sprout', 'Beef'],
  },
  {
    label: 'Fish & Seafood',
    keywords: ['fish', 'seafood', 'fishery', 'aquarium', 'marine', 'prawn', 'shrimp'],
    icons: ['Fish', 'Anchor', 'Waves', 'Ship'],
  },
  {
    label: 'Agriculture, Fruits & Spices',
    keywords: [
      'agriculture', 'agro', 'seeds', 'fertilizer', 'pesticide', 'crop', 'crops',
      'wheat', 'rice', 'flour', 'fruit', 'fruits', 'vegetable', 'vegetables', 'organic',
      'spices', 'spice', 'masala', 'herbs', 'nursery', 'garden', 'plant', 'plants', 'flower', 'florist',
    ],
    icons: ['Wheat', 'Sprout', 'Leaf', 'Flower2', 'Apple', 'Carrot', 'Trees', 'Tractor'],
  },
  {
    label: 'Water & Beverages',
    keywords: ['water', 'mineral', 'ro plant', 'filtration', 'aqua', 'pure', 'juice', 'juices', 'ice', 'cold storage'],
    icons: ['Droplet', 'Droplets', 'GlassWater', 'Waves', 'Snowflake', 'CupSoda'],
  },
  {
    label: 'Fashion, Textiles & Tailors',
    keywords: [
      'fashion', 'boutique', 'garment', 'garments', 'textile', 'textiles', 'fabric',
      'fabrics', 'cloth', 'clothes', 'clothing', 'silk', 'cotton', 'linen', 'apparel',
      'wear', 'collection', 'emporium', 'handloom', 'embroidery', 'kurta', 'suiting',
    ],
    icons: ['Shirt', 'Scissors', 'Tag', 'Crown', 'Ribbon', 'Feather'],
  },
  {
    label: 'Tailoring & Alterations',
    keywords: ['tailor', 'tailors', 'tailoring', 'stitching', 'bespoke', 'alteration', 'sewing'],
    icons: ['Scissors', 'Ruler', 'Shirt', 'PenTool'],
  },
  {
    label: 'Footwear & Leather',
    keywords: ['shoe', 'shoes', 'footwear', 'leather', 'bag', 'bags', 'luggage', 'boots', 'sandals'],
    icons: ['Footprints', 'Briefcase', 'ShoppingBag', 'Luggage'],
  },
  {
    label: 'Construction & Real Estate',
    keywords: [
      'builders', 'builder', 'construction', 'contractor', 'contractors', 'real estate',
      'estate', 'property', 'properties', 'developers', 'housing', 'apartments', 'homes',
      'cement', 'bricks', 'concrete', 'infrastructure', 'projects',
    ],
    icons: ['Building2', 'HardHat', 'Home', 'House', 'BrickWall', 'Construction', 'Landmark'],
  },
  {
    label: 'Architecture & Surveying',
    keywords: ['architect', 'architects', 'architecture', 'design studio', 'drafting', 'survey', 'blueprint'],
    icons: ['Compass', 'DraftingCompass', 'Ruler', 'Building2', 'Layers'],
  },
  {
    label: 'Automotive & Motors',
    keywords: [
      'motor', 'motors', 'auto', 'autos', 'automotive', 'car', 'cars', 'showroom',
      'garage', 'mechanic', 'workshop', 'spare', 'parts', 'tyre', 'tyres', 'tire',
      'lubricant', 'oil', 'service station', 'washing', 'detailing',
    ],
    icons: ['Car', 'CarFront', 'Gauge', 'Wrench', 'Cog', 'Fuel'],
  },
  {
    label: 'Bikes & Cycles',
    keywords: ['bike', 'bikes', 'motorcycle', 'scooter', 'cycle', 'bicycle', 'honda', 'yamaha'],
    icons: ['Bike', 'Gauge', 'Wrench', 'Navigation'],
  },
  {
    label: 'Transport, Cargo & Logistics',
    keywords: [
      'transport', 'transporters', 'truck', 'trucking', 'cargo', 'freight', 'logistics',
      'courier', 'delivery', 'moving', 'movers', 'shipping', 'container', 'warehouse', 'godown',
    ],
    icons: ['Truck', 'Package', 'Warehouse', 'Ship', 'Plane', 'Box', 'Forklift'],
  },
  {
    label: 'Traders & Enterprises',
    keywords: [
      'traders', 'trading', 'trade', 'enterprise', 'enterprises', 'import', 'export',
      'agency', 'agencies', 'distributors', 'distribution', 'supply', 'suppliers',
      'merchants', 'brothers', 'sons', 'company', 'group', 'corporation', 'ventures',
    ],
    icons: ['Briefcase', 'Globe', 'Handshake', 'Layers', 'Building', 'Box', 'TrendingUp'],
  },
  {
    label: 'Travel, Tours & Hotels',
    keywords: [
      'travel', 'travels', 'tour', 'tours', 'tourism', 'hajj', 'umrah', 'ticketing',
      'airlines', 'flight', 'visa', 'holiday', 'holidays', 'resort', 'lodge', 'inn',
    ],
    icons: ['Plane', 'Compass', 'Globe', 'Luggage', 'MapPin', 'Hotel', 'Tent'],
  },
  {
    label: 'Books, Print & Stationery',
    keywords: [
      'book', 'books', 'bookshop', 'stationery', 'stationers', 'library', 'press',
      'print', 'printers', 'printing', 'graphics', 'packaging', 'publishers', 'paper',
      'offset', 'flex', 'photostat',
    ],
    icons: ['BookOpen', 'Printer', 'PenTool', 'Newspaper', 'Library', 'ScrollText', 'Stamp'],
  },
  {
    label: 'Education & Academy',
    keywords: [
      'academy', 'school', 'college', 'university', 'institute', 'tuition', 'coaching',
      'education', 'educational', 'learning', 'campus', 'training', 'science',
    ],
    icons: ['GraduationCap', 'School', 'BookOpen', 'University', 'Award', 'Atom'],
  },
  {
    label: 'Legal, Tax & Finance',
    keywords: [
      'law', 'legal', 'advocate', 'advocates', 'attorney', 'associates', 'chambers',
      'notary', 'consultants', 'consulting', 'advisors', 'tax', 'audit', 'accountant',
      'accounting', 'finance', 'financial', 'capital', 'investment', 'bank', 'exchange',
    ],
    icons: ['Scale', 'Landmark', 'Gavel', 'Briefcase', 'FileCheck2', 'Banknote', 'ShieldCheck'],
  },
  {
    label: 'Optics & Photography',
    keywords: [
      'optic', 'optics', 'optical', 'optician', 'eyewear', 'glasses', 'lens',
      'studio', 'photo', 'photography', 'photographer', 'video', 'videography', 'film', 'media',
    ],
    icons: ['Glasses', 'Camera', 'Aperture', 'Eye', 'Video', 'Film', 'Focus'],
  },
  {
    label: 'Salon, Barber & Beauty',
    keywords: [
      'salon', 'saloon', 'barber', 'hair', 'beauty', 'parlour', 'parlor', 'cosmetic',
      'cosmetics', 'makeup', 'spa', 'wellness', 'skincare', 'perfume', 'fragrance',
    ],
    icons: ['Scissors', 'Flower2', 'Heart', 'Feather', 'Droplet', 'Gem'],
  },
  {
    label: 'Sports, Gym & Fitness',
    keywords: ['gym', 'fitness', 'sports', 'sport', 'athletic', 'cricket', 'football', 'club', 'health club'],
    icons: ['Dumbbell', 'Trophy', 'Medal', 'Target', 'Activity', 'Award'],
  },
  {
    label: 'Music & Audio',
    keywords: ['music', 'musical', 'sound', 'audio', 'instruments', 'guitar', 'studio', 'dj', 'records'],
    icons: ['Music', 'Guitar', 'Headphones', 'Mic', 'Speaker', 'Radio'],
  },
  {
    label: 'Security & Locks',
    keywords: ['security', 'guard', 'guards', 'safety', 'lock', 'locks', 'locksmith', 'key', 'keys', 'safe'],
    icons: ['ShieldCheck', 'KeyRound', 'Lock', 'Shield', 'Siren'],
  },
  {
    label: 'Laundry & Cleaning',
    keywords: ['laundry', 'dry clean', 'dryclean', 'cleaning', 'cleaners', 'wash', 'janitorial', 'pest'],
    icons: ['Droplets', 'Wind', 'Shirt', 'SprayCan', 'Waves'],
  },
  {
    label: 'Pets & Veterinary',
    keywords: ['pet', 'pets', 'vet', 'veterinary', 'animal', 'dog', 'cat', 'kennel'],
    icons: ['PawPrint', 'Dog', 'Cat', 'HeartPulse'],
  },
  {
    label: 'Cooling, AC & Refrigeration',
    keywords: ['ac ', 'air condition', 'hvac', 'cooling', 'refrigeration', 'fridge', 'freezer', 'chiller'],
    icons: ['Snowflake', 'Fan', 'Wind', 'Thermometer'],
  },
];

export interface LogoMatchResult {
  iconName: LucideIconName;
  matchedLabel: string;
}

function isValidIconName(name: string): name is LucideIconName {
  return Object.prototype.hasOwnProperty.call(icons, name);
}

function splitCamelCase(name: string): string[] {
  return name
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([0-9]+)/g, ' $1 ')
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

// Precompute tokenized icon names across all 1,638 Lucide icons
const INDEXED_ICONS = ALL_ICON_NAMES.map((name) => ({
  name,
  lower: name.toLowerCase(),
  tokens: splitCamelCase(name),
}));

export function detectBestLogo(shopName: string): LogoMatchResult {
  const raw = shopName.trim();
  if (!raw) {
    return { iconName: 'Store', matchedLabel: 'General Business' };
  }

  const padded = ` ${raw.toLowerCase()} `;
  const words = raw
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3);

  // 1. Score curated trade rules
  let bestRule: TradeRule | null = null;
  let bestRuleScore = 0;

  for (const rule of TRADE_RULES) {
    let score = 0;
    for (const kw of rule.keywords) {
      if (padded.includes(` ${kw} `) || (kw.length >= 4 && padded.includes(kw))) {
        score += kw.length >= 6 ? 4 : 3;
      }
    }
    if (score > bestRuleScore) {
      bestRuleScore = score;
      bestRule = rule;
    }
  }

  if (bestRule && bestRuleScore > 0) {
    for (const candidate of bestRule.icons) {
      if (isValidIconName(candidate)) {
        return {
          iconName: candidate,
          matchedLabel: bestRule.label,
        };
      }
    }
  }

  // 2. Direct fuzzy match against ALL 1,638 Lucide icon names!
  // E.g. "Anchor Logistics", "Crown Bakers", "Mountain View", "Rocket Press", "Castle"
  let bestIcon: LucideIconName | null = null;
  let bestIconScore = 0;
  let matchedWord = '';

  const skipGenericWords = new Set(['the', 'and', 'for', 'pvt', 'ltd', 'inc', 'new', 'best', 'good', 'super', 'al']);

  for (const w of words) {
    if (skipGenericWords.has(w)) continue;
    for (const item of INDEXED_ICONS) {
      if (item.lower === w) {
        return {
          iconName: item.name,
          matchedLabel: `Matched "${w}"`,
        };
      }
      if (item.tokens.includes(w)) {
        const sc = w.length * 2 - item.tokens.length;
        if (sc > bestIconScore) {
          bestIconScore = sc;
          bestIcon = item.name;
          matchedWord = w;
        }
      }
    }
  }

  if (bestIcon) {
    return {
      iconName: bestIcon,
      matchedLabel: `Matched "${matchedWord}"`,
    };
  }

  // 3. Clean business fallback
  return {
    iconName: 'Building2',
    matchedLabel: 'Enterprise Mark',
  };
}

const SHOWCASE_ICONS: string[] = [
  'Store', 'Building2', 'Briefcase', 'Crown', 'Gem', 'Award', 'ShieldCheck',
  'Cross', 'Stethoscope', 'Pill', 'HeartPulse', 'Wrench', 'Hammer', 'Drill',
  'Cog', 'Cpu', 'Laptop', 'Smartphone', 'Zap', 'Sun', 'BatteryCharging',
  'Flame', 'Paintbrush', 'Palette', 'Armchair', 'Sofa', 'BedDouble',
  'Cake', 'Coffee', 'Utensils', 'ChefHat', 'Pizza', 'ShoppingBag',
  'Milk', 'Egg', 'Bird', 'Fish', 'Wheat', 'Sprout', 'Leaf', 'Flower2',
  'Droplet', 'Snowflake', 'Shirt', 'Scissors', 'Footprints', 'Watch',
  'Home', 'HardHat', 'Compass', 'Car', 'Bike', 'Truck', 'Plane', 'Ship',
  'Anchor', 'Globe', 'BookOpen', 'Printer', 'GraduationCap', 'Scale',
  'Landmark', 'Glasses', 'Camera', 'Music', 'Dumbbell', 'Trophy',
  'KeyRound', 'PawPrint', 'Trees', 'Mountain', 'Star', 'Feather',
];

export function searchAllLogos(query: string, limit = 84): LucideIconName[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return SHOWCASE_ICONS.filter(isValidIconName).slice(0, limit);
  }

  const terms = q.split(/\s+/).filter(Boolean);
  const scored = new Map<LucideIconName, number>();

  // 1. Expand via trade dictionary keywords
  for (const rule of TRADE_RULES) {
    const labelHit = rule.label.toLowerCase().includes(q);
    const kwHit = rule.keywords.some((kw) => terms.some((t) => kw.includes(t) || t.includes(kw)));
    if (labelHit || kwHit) {
      rule.icons.forEach((iconStr, idx) => {
        if (isValidIconName(iconStr)) {
          const bonus = (labelHit ? 40 : 25) - idx;
          scored.set(iconStr, Math.max(scored.get(iconStr) ?? 0, bonus));
        }
      });
    }
  }

  // 2. Search across ALL 1,638 Lucide icon names
  for (const item of INDEXED_ICONS) {
    let score = 0;
    if (item.lower === q) {
      score = 100;
    } else if (item.lower.startsWith(q)) {
      score = 70;
    } else if (terms.every((t) => item.tokens.some((tok) => tok === t))) {
      score = 60;
    } else if (terms.every((t) => item.lower.includes(t))) {
      score = 35;
    } else if (terms.some((t) => t.length >= 3 && item.lower.includes(t))) {
      score = 15;
    }

    if (score > 0) {
      scored.set(item.name, Math.max(scored.get(item.name) ?? 0, score));
    }
  }

  return Array.from(scored.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([name]) => name);
}

export function extractInitials(shopName: string): string {
  const cleaned = shopName
    .replace(/&/g, ' ')
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .trim();

  if (!cleaned) return 'LH';

  const ignoreWords = new Set(['the', 'and', 'of', 'for', 'co', 'pvt', 'ltd', 'inc']);
  const words = cleaned
    .split(/\s+/)
    .filter((w) => w.length > 0 && !ignoreWords.has(w.toLowerCase()));

  const source = words.length > 0 ? words : cleaned.split(/\s+/);

  if (source.length === 1) {
    return source[0].slice(0, 2).toUpperCase();
  }

  return `${source[0][0]}${source[1][0]}`.toUpperCase();
}
