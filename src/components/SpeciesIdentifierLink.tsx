import React from 'react';

interface SpeciesIdentifierLinkProps {
  hasUploadedImage: boolean;
  onClick: () => void;
}

export function SpeciesIdentifierLink({ hasUploadedImage, onClick }: SpeciesIdentifierLinkProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-sm text-bonsai-green hover:text-bonsai-moss transition-colors flex items-center space-x-1"
    >
      <span>
        {hasUploadedImage 
          ? "Try our species identifier from your photo"
          : "Species Identifier"}
      </span>
      <span className="text-xs">→</span>
    </button>
  );
}