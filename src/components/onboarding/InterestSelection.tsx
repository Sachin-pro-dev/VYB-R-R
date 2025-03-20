
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Music, Gamepad2, Palette, Code, Camera, DollarSign, ShoppingBag, Shirt, Trophy } from 'lucide-react';

interface InterestSelectionProps {
  onInterestsSelected: (interests: string[]) => void;
}

const interests = [
  { id: 'music', name: 'Music', icon: Music, color: 'bg-purple-500/20 border-purple-500/40 hover:bg-purple-500/30' },
  { id: 'gaming', name: 'Gaming', icon: Gamepad2, color: 'bg-green-500/20 border-green-500/40 hover:bg-green-500/30' },
  { id: 'art', name: 'Art & NFTs', icon: Palette, color: 'bg-blue-500/20 border-blue-500/40 hover:bg-blue-500/30' },
  { id: 'tech', name: 'Technology', icon: Code, color: 'bg-yellow-500/20 border-yellow-500/40 hover:bg-yellow-500/30' },
  { id: 'photo', name: 'Photography', icon: Camera, color: 'bg-pink-500/20 border-pink-500/40 hover:bg-pink-500/30' },
  { id: 'finance', name: 'Finance', icon: DollarSign, color: 'bg-green-500/20 border-green-500/40 hover:bg-green-500/30' },
  { id: 'fashion', name: 'Fashion', icon: Shirt, color: 'bg-indigo-500/20 border-indigo-500/40 hover:bg-indigo-500/30' },
  { id: 'ecommerce', name: 'E-commerce', icon: ShoppingBag, color: 'bg-orange-500/20 border-orange-500/40 hover:bg-orange-500/30' },
  { id: 'sports', name: 'Sports', icon: Trophy, color: 'bg-red-500/20 border-red-500/40 hover:bg-red-500/30' },
];

const InterestSelection: React.FC<InterestSelectionProps> = ({ onInterestsSelected }) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
  const toggleInterest = (interestId: string) => {
    if (selectedInterests.includes(interestId)) {
      setSelectedInterests(selectedInterests.filter(id => id !== interestId));
    } else {
      setSelectedInterests([...selectedInterests, interestId]);
    }
  };
  
  const handleContinue = () => {
    if (selectedInterests.length > 0) {
      onInterestsSelected(selectedInterests);
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-orbitron font-bold mb-3">Select Your Interests</h2>
      <p className="text-gray-400 mb-6">
        Choose categories that interest you. This helps us personalize your feed and recommend creators.
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        {interests.map((interest) => {
          const isSelected = selectedInterests.includes(interest.id);
          const IconComponent = interest.icon;
          
          return (
            <button
              key={interest.id}
              onClick={() => toggleInterest(interest.id)}
              className={`relative p-4 rounded-xl border ${interest.color} transition-all duration-200 hover-scale flex flex-col items-center text-center ${
                isSelected ? 'ring-2 ring-white' : ''
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                </div>
              )}
              <div className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center mb-3">
                <IconComponent className="h-6 w-6" />
              </div>
              <span className="font-medium">{interest.name}</span>
            </button>
          );
        })}
      </div>
      
      <Button 
        className="w-full bg-white text-black hover:bg-white/90 py-6"
        onClick={handleContinue}
        disabled={selectedInterests.length === 0}
      >
        Continue with {selectedInterests.length} {selectedInterests.length === 1 ? 'Interest' : 'Interests'}
      </Button>
    </div>
  );
};

export default InterestSelection;
