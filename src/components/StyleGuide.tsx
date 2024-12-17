import React from 'react';
import { BackButton } from './BackButton';
import { TreeDeciduous, Info, Wind, Mountain, Sprout, ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';

const BONSAI_STYLES = [
  {
    name: 'Chokkan (Formal Upright)',
    description: 'The most basic and traditional style, representing a tree growing in ideal conditions with full sun and no obstacles. The trunk is straight and tapers gradually toward the apex, with branches progressively shorter toward the top.',
    characteristics: [
      'Straight, upright trunk',
      'Symmetrical branch arrangement',
      'Gradual taper from base to apex',
      'First branch at about 1/3 height of trunk'
    ],
    image: 'https://images.unsplash.com/photo-1609142621730-db3293839541?w=800',
    icon: TreeDeciduous
  },
  {
    name: 'Moyogi (Informal Upright)',
    description: 'The most popular style, depicting a tree that has grown naturally with some environmental stresses. The trunk moves in gentle curves but the apex is still above the trunk base.',
    characteristics: [
      'Curved trunk with apex above base',
      'Natural, flowing movement',
      'Balanced branch arrangement',
      'More dynamic than formal upright'
    ],
    image: 'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800',
    icon: Wind
  },
  {
    name: 'Shakan (Slanting)',
    description: 'Represents a tree that has grown under constant wind or other environmental forces from one direction. The trunk slants at an angle between 30 and 45 degrees from vertical.',
    characteristics: [
      'Trunk angled 30-45 degrees',
      'Strong root development opposite lean',
      'Branches grow horizontally',
      'Creates dynamic tension'
    ],
    image: 'https://images.unsplash.com/photo-1626019240671-c484d4211529?w=800',
    icon: Wind
  },
  {
    name: 'Kengai (Cascade)',
    description: 'Depicts trees growing on cliffs or mountainsides, with the main part of the tree growing downward below the container\'s base. One of the most dramatic bonsai styles.',
    characteristics: [
      'Main trunk/branches grow below pot base',
      'Strong root system for balance',
      'Often needs deeper pot for stability',
      'Creates dramatic visual impact'
    ],
    image: 'https://images.unsplash.com/photo-1612911969147-76f87ed6d91f?w=800',
    icon: Mountain
  },
  {
    name: 'Han-Kengai (Semi-Cascade)',
    description: 'Similar to cascade but less extreme, with the main branch extending horizontally or slightly downward, not falling below the base of the pot.',
    characteristics: [
      'Main branch extends horizontally',
      'More subtle than full cascade',
      'Balanced root system',
      'Natural, graceful appearance'
    ],
    image: 'https://images.unsplash.com/photo-1604507981841-37a7d0c522f2?w=800',
    icon: Sprout
  }
];

export function StyleGuide() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <BackButton />
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Bonsai Style Guide</h2>

      <div className="relative mb-12">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {BONSAI_STYLES.map((style) => (
              <div key={style.name} className="flex-[0_0_100%] min-w-0 pl-4">
                <div className="card h-[600px] overflow-hidden">
                  <img
                    src={style.image}
                    alt={style.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <style.icon className="w-6 h-6 text-bonsai-green" />
                      <h3 className="text-xl font-semibold text-bonsai-bark dark:text-white">{style.name}</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{style.description}</p>
                    <div className="space-y-2">
                      {style.characteristics.map((characteristic, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-bonsai-green" />
                          <span className="text-sm text-gray-700 dark:text-gray-200">{characteristic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => emblaApi?.scrollPrev()}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white dark:bg-stone-800 p-2 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-stone-700 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-bonsai-bark dark:text-white" />
        </button>
        <button
          onClick={() => emblaApi?.scrollNext()}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white dark:bg-stone-800 p-2 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-stone-700 transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-bonsai-bark dark:text-white" />
        </button>
      </div>

      <div className="card p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Info className="w-6 h-6 text-bonsai-green" />
          <h3 className="text-xl font-semibold text-bonsai-bark dark:text-white">Tips for Choosing a Style</h3>
        </div>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>
            When selecting a style for your bonsai, consider these key factors:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Natural growth pattern of the tree species</li>
            <li>Existing trunk movement and branch placement</li>
            <li>Root spread and nebari development</li>
            <li>Overall tree health and vigor</li>
            <li>Your skill level and available time for maintenance</li>
          </ul>
          <p>
            Remember that the best style is one that enhances the tree's natural characteristics while creating a harmonious and balanced composition.
          </p>
        </div>
      </div>
    </div>
  );
}