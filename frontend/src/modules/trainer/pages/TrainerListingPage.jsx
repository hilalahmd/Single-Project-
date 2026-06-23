import { useNavigate } from 'react-router-dom'
import { Search, ShieldCheck, Star } from 'lucide-react'

const TRAINERS = [
  { 
    id: 1, 
    name: 'Alex Chen',  
    role: 'Strength & Conditioning Coach',
    languages: ['English', 'Mandarin'],
    rating: 4.9, 
    reviews: 128,
    price: 129,
    tags: ['HIIT', 'Strength', 'Weight Loss'],
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 2, 
    name: 'Sofia Martinez', 
    role: 'Yoga & Pilates Specialist',
    languages: ['English', 'Spanish'],
    rating: 4.8, 
    reviews: 89,
    price: 89,
    tags: ['Yoga', 'Pilates', 'Flexibility'],
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 3, 
    name: 'Marcus Thompson',  
    role: 'Boxing & Cardio Coach',
    languages: ['English'],
    rating: 4.7, 
    reviews: 210,
    price: 109,
    tags: ['Boxing', 'Cardio', 'Endurance'],
    image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 4, 
    name: 'Emma Wilson',    
    role: 'Wellness & Nutrition Coach',
    languages: ['English', 'French'],
    rating: 5.0, 
    reviews: 432,
    price: 149,
    tags: ['Nutrition', 'Wellness', 'Recovery'],
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 5, 
    name: 'David Kim', 
    role: 'CrossFit Trainer',               
    languages: ['English', 'Korean'],
    rating: 4.6, 
    reviews: 76,
    price: 119,
    tags: ['CrossFit', 'Strength', 'HIIT'],
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 6, 
    name: 'Sarah Jones', 
    role: 'Running & Endurance Coach',         
    languages: ['English'],
    rating: 4.8, 
    reviews: 154,
    price: 99,
    tags: ['Running', 'Marathon', 'Cardio'],
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
]

const FILTER_TAGS = ['All', 'HIIT', 'Strength', 'Yoga', 'Boxing', 'CrossFit', 'Running']

export default function TrainerListingPage() {
  const navigate = useNavigate()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-[#F9FAFB] min-h-screen">
      
      {/* Search & Filters Bar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 mb-8 shadow-sm">
        
        {/* Top Row: Search and Dropdowns */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or specialty..."
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
            />
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-2 lg:pb-0 shrink-0">
            {['Any language', 'Any price', 'Any rating'].map((label, i) => (
              <select key={i} className="px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-black appearance-none pr-10 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_12px_center] shrink-0">
                <option>{label}</option>
              </select>
            ))}
          </div>
        </div>

        {/* Bottom Row: Tag Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {FILTER_TAGS.map(tag => (
            <button
              key={tag}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                tag === 'All' 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {TRAINERS.map(t => (
          <div key={t.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col group shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
            
            {/* Image Section */}
            <div className="relative h-56 bg-gray-100">
              <img 
                src={t.image} 
                alt={t.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <Star size={14} className="fill-black text-black" />
                <span className="text-sm font-bold text-black">{t.rating}</span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 flex-1 flex flex-col">
              
              <div className="flex items-center gap-1.5 mb-1">
                <h2 className="text-xl font-bold text-black">{t.name}</h2>
                <ShieldCheck size={18} className="text-gray-400" />
              </div>
              
              <p className="text-sm text-gray-500 font-medium mb-1">
                {t.role}
              </p>
              
              <p className="text-xs text-gray-400 mb-5">
                {t.languages.join(' · ')}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {t.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Footer row */}
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <span className="font-bold text-lg text-black">${t.price}</span>
                  <span className="text-sm text-gray-500">/mo</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => navigate(`/trainers/${t.id}`)}
                    className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-black hover:bg-gray-50 transition-colors"
                  >
                    View
                  </button>
                  <button 
                    onClick={() => navigate('/plans')}
                    className="px-5 py-2.5 bg-black rounded-xl text-sm font-bold text-white hover:bg-gray-800 transition-colors"
                  >
                    Subscribe
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
