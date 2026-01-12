export const mockRecords = [
  { 
    id: 1, 
    topic: 'Infrastructure Bill', 
    type: 'News', 
    sentiment: 'Positive', 
    confidence: 0.85, 
    date: '2026-01-05', 
    party: 'Congress', 
    assembly: 'Lok Sabha', 
    area: 'Development',
    region: 'National',
    description: 'New infrastructure development plan announced',
    sourceUrl: 'https://example.com/news1'
  },
  { 
    id: 2, 
    topic: 'Agricultural Reform', 
    type: 'Tweet', 
    sentiment: 'Negative', 
    confidence: 0.72, 
    date: '2026-01-04', 
    party: 'BJP', 
    assembly: 'Rajya Sabha', 
    area: 'Agriculture',
    region: 'Punjab',
    description: 'Farmers protest against new agricultural policies',
    sourceUrl: 'https://example.com/tweet1'
  },
  { 
    id: 3, 
    topic: 'Education Policy', 
    type: 'News', 
    sentiment: 'Neutral', 
    confidence: 0.68, 
    date: '2026-01-03', 
    party: 'AAP', 
    assembly: 'Delhi Assembly', 
    area: 'Education',
    region: 'Delhi',
    description: 'New education reforms proposed for schools',
    sourceUrl: 'https://example.com/news2'
  },
  { 
    id: 4, 
    topic: 'Healthcare Initiative', 
    type: 'Text', 
    sentiment: 'Positive', 
    confidence: 0.91, 
    date: '2026-01-02', 
    party: 'Congress', 
    assembly: 'Lok Sabha', 
    area: 'Healthcare',
    region: 'Maharashtra',
    description: 'Universal healthcare scheme expansion announced',
    sourceUrl: 'https://example.com/article1'
  },
  { 
    id: 5, 
    topic: 'Tax Reform', 
    type: 'News', 
    sentiment: 'Negative', 
    confidence: 0.78, 
    date: '2026-01-01', 
    party: 'BJP', 
    assembly: 'Rajya Sabha', 
    area: 'Economy',
    region: 'National',
    description: 'New tax structure criticized by middle class',
    sourceUrl: 'https://example.com/news3'
  },
]

export const stats = [
  { 
    label: 'Total Records', 
    value: '1,284', 
    change: '+12.5%', 
    color: 'from-blue-500 to-cyan-500' 
  },
  { 
    label: 'Positive', 
    value: '642', 
    change: '+8.2%', 
    color: 'from-emerald-500 to-teal-500' 
  },
  { 
    label: 'Negative', 
    value: '421', 
    change: '-3.1%', 
    color: 'from-rose-500 to-pink-500' 
  },
  { 
    label: 'Neutral', 
    value: '221', 
    change: '+1.4%', 
    color: 'from-amber-500 to-orange-500' 
  },
]