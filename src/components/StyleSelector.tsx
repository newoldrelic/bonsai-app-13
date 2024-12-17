import React from 'react';
import type { BonsaiStyle } from '../types';

interface StyleSelectorProps {
  value: BonsaiStyle;
  onChange: (style: BonsaiStyle) => void;
}

const STYLE_DETAILS = [
  {
    style: 'Chokkan',
    image: '/styles/chokkan.jpg',
    description: 'Formal upright style with straight trunk'
  },
  {
    style: 'Moyogi',
    image: '/styles/moyogi.jpg',
    description: 'Informal upright with curved trunk'
  },
  {
    style: 'Shakan',
    image: '/styles/shakan.jpg',
    description: 'Slanting style, trunk grows at an angle'
  },
  {
    style: 'Kengai',
    image: '/styles/kengai.jpg',
    description: 'Cascade style, grows downward below pot base'
  },
  {
    style: 'Han-Kengai',
    image: '/styles/han-kengai.jpg',
    description: 'Semi-cascade, grows downward but not below pot'
  },
  {
    style: 'Kabudachi',
    image: '/styles/kabudachi.jpg',
    description: 'Multitple trunks growing from one root system'
  },
  {
    style: 'Yose-ue',
    image: '/styles/yose-ue.jpg',
    description: 'Group of trees planted together'
  }
] as const;

export function StyleSelector({ value, onChange }: StyleSelectorProps) {
  const handleStyleClick = (e: React.MouseEvent, style: BonsaiStyle) => {
    e.preventDefault(); // Prevent form submission
    onChange(style);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {STYLE_DETAILS.map((style) => (
        <button
          key={style.style}
          type="button" // Explicitly set button type to prevent form submission
          onClick={(e) => handleStyleClick(e, style.style)}
          className={`relative group overflow-hidden rounded-lg border-2 transition-all ${
            value === style.style
              ? 'border-bonsai-green ring-2 ring-bonsai-green ring-offset-2'
              : 'border-transparent hover:border-bonsai-green/50'
          }`}
        >
          <div className="aspect-square">
            <img
              src={style.image}
              alt={style.style}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 flex flex-col justify-end">
            <h4 className="text-white font-medium">{style.style}</h4>
            <p className="text-white/80 text-sm line-clamp-2">
              {style.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}