export interface Service {
  id: string;
  title: string;
  description: string;
  category: 'Lawn Care' | 'Maintenance' | 'Specialty' | 'Seasonal';
  icon: string;
}

export const services: Service[] = [
  {
    id: 'lawn-mowing',
    title: 'Professional Lawn Mowing',
    description: 'Precision mowing with professional striping and trimming for a pristine look.',
    category: 'Lawn Care',
    icon: 'Scissors'
  },
  {
    id: 'edges',
    title: 'Clean Edging',
    description: 'Sharp, clean borders between your lawn and walkways or garden beds.',
    category: 'Lawn Care',
    icon: 'Maximize'
  },
  {
    id: 'lawn-maintenance',
    title: 'Lawn Maintenance',
    description: 'Comprehensive care including fertilization and aeration to keep your grass healthy.',
    category: 'Lawn Care',
    icon: 'Heart'
  },
  {
    id: 'bush-trimming',
    title: 'Bush & Hedge Trimming',
    description: 'Expert pruning to maintain the shape and health of your shrubs and hedges.',
    category: 'Maintenance',
    icon: 'Sun'
  },
  {
    id: 'weeds',
    title: 'Weed Pulling',
    description: 'Thorough removal of invasive weeds from your garden beds and lawn.',
    category: 'Lawn Care',
    icon: 'Trash2'
  },
  {
    id: 'mulch',
    title: 'Mulch Installation',
    description: 'Fresh, high-quality mulch to protect soil moisture and suppress weeds.',
    category: 'Maintenance',
    icon: 'Layers'
  },
  {
    id: 'top-soil',
    title: 'Top Soil & Grading',
    description: 'Leveling and nutrient-rich soil application for optimal plant growth.',
    category: 'Lawn Care',
    icon: 'TrendingUp'
  },
  {
    id: 'reseeding',
    title: 'Lawn Reseeding',
    description: 'Repairing thin or bare spots with premium grass seed blends.',
    category: 'Lawn Care',
    icon: 'Sprout'
  },
  {
    id: 'storm-cleanup',
    title: 'Storm Damage Clean-up',
    description: 'Rapid response to clear debris, branches, and mess after severe weather.',
    category: 'Specialty',
    icon: 'Wind'
  },
  {
    id: 'yard-cleanup',
    title: 'General Yard Cleanup',
    description: 'Restoring order to your outdoor space with comprehensive clearing and hauling.',
    category: 'Maintenance',
    icon: 'RefreshCw'
  },
  {
    id: 'leaf-cleanup',
    title: 'Leaf Removal',
    description: 'Efficient leaf collection and removal to protect your grass during fall.',
    category: 'Seasonal',
    icon: 'CloudRain'
  },
  {
    id: 'patios',
    title: 'Patio Repair & Masonry',
    description: 'Fixing cracked pavers, leveling surfaces, and restoring stone features.',
    category: 'Specialty',
    icon: 'Grid'
  },
  {
    id: 'seasonal-cleanup',
    title: 'Spring & Fall Clean-up',
    description: 'Deep cleaning and preparation for the changing seasons.',
    category: 'Maintenance',
    icon: 'Calendar'
  },
  {
    id: 'gravel',
    title: 'River Gravel Installation',
    description: 'Beautiful, low-maintenance gravel features and drainage solutions.',
    category: 'Specialty',
    icon: 'Anchor'
  },
  {
    id: 'snow-plow',
    title: 'Snow Plowing',
    description: 'Reliable, 24/7 snow removal for driveways and walkways during winter.',
    category: 'Seasonal',
    icon: 'Snowflake'
  }
];
