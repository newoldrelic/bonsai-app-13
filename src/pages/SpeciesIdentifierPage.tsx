import React, { useState } from 'react';
import { Leaf, TreeDeciduous, Crown } from 'lucide-react';
import { SpeciesIdentifier } from '../components/SpeciesIdentifier';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { useSpeciesIdentifierStore, getFreeUsagesRemaining } from '../store/speciesIdentifierStore';
import { useNavigate } from 'react-router-dom';

export function SpeciesIdentifierPage() {
  const [identifiedSpecies, setIdentifiedSpecies] = useState<string | null>(null);
  const { getCurrentPlan } = useSubscriptionStore();
  const currentPlan = getCurrentPlan();
  const isSubscribed = currentPlan.id !== 'hobby';
  const remainingUsages = getFreeUsagesRemaining();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Leaf className="w-8 h-8 text-bonsai-green" />
            <h1 className="text-3xl font-bold text-bonsai-bark dark:text-white">Species Identifier</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Upload a photo of your bonsai tree and our AI will help identify its species.
          </p>
          {!isSubscribed && (
            <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-bonsai-terra">
              <Crown className="w-4 h-4" />
              <span>Free tier: {remainingUsages} identifications remaining</span>
              <button
                onClick={() => navigate('/pricing')}
                className="underline hover:text-bonsai-clay transition-colors"
              >
                Upgrade for unlimited
              </button>
            </div>
          )}
        </div>

        <div className="card p-6">
          <SpeciesIdentifier 
            onSpeciesIdentified={(species) => setIdentifiedSpecies(species)} 
          />

          {identifiedSpecies && (
            <div className="mt-6 p-4 bg-bonsai-green/10 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <TreeDeciduous className="w-5 h-5 text-bonsai-green" />
                <h3 className="font-medium text-bonsai-bark dark:text-white">
                  Identified Species
                </h3>
              </div>
              <p className="text-bonsai-bark dark:text-white">
                {identifiedSpecies}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 card p-6">
          <h2 className="text-xl font-semibold text-bonsai-bark dark:text-white mb-4">
            Tips for Better Identification
          </h2>
          <ul className="space-y-3 text-gray-600 dark:text-gray-300">
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-bonsai-green mt-2 flex-shrink-0" />
              <span>Ensure good lighting and a clear view of the tree</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-bonsai-green mt-2 flex-shrink-0" />
              <span>Include both leaves and trunk in the photo</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-bonsai-green mt-2 flex-shrink-0" />
              <span>Take multiple photos from different angles if needed</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-bonsai-green mt-2 flex-shrink-0" />
              <span>Avoid blurry or poorly lit images</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}