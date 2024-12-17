import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="inline-flex items-center space-x-2 text-bonsai-stone hover:text-bonsai-moss transition-colors"
    >
      <ArrowLeft className="w-5 h-5" />
      <span className="font-medium">Back</span>
    </button>
  );
}