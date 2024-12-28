import React, { useState, useEffect } from 'react';
import { Leaf, TreeDeciduous, Crown, ArrowRight, Info, Bug } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { HealthAnalyzer } from '../components/HealthAnalyzer';
import { MarkdownContent } from '../components/MarkdownContent';
import HealthScores from '../components/HealthScores';
import { FEATURES } from '../config/features';
import { AI_PROMPTS } from '../config/ai-prompts';
import { downloadText, formatAnalysisForDownload } from '../utils/download';
import { db, auth } from '../config/firebase';

const feature = FEATURES.find(f => f.id === 'health-analytics')!;

const ANALYSIS_STEPS = [
  'Initializing health analysis...',
  'Examining leaf condition and color...',
  'Checking for signs of disease or pests...',
  'Assessing overall tree vigor...',
  'Generating recommendations...'
];

interface HealthScore {
  category: string;
  score: number;
  icon: React.ReactNode;
  description: string;
}

interface AnalysisResult {
  text: string;
  scores: HealthScore[];
}

export function HealthAnalyticsPage() {
  const location = useLocation();
  const { treeId, treeName, treeImage } = location.state || {};
  const navigate = useNavigate();
  const { getCurrentPlan } = useSubscriptionStore();
  const currentPlan = getCurrentPlan();
  const isSubscribed = currentPlan.id !== 'hobby';
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Automatically analyze tree image if provided through route state
  useEffect(() => {
    if (treeImage) {
      handleImageUpload(treeImage);
    }
  }, [treeImage]);

  const handleImageUpload = async (imageData: string) => {
    if (!isSubscribed) {
      navigate('/pricing');
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentStep(0);

    // Simulate step progression
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < ANALYSIS_STEPS.length - 1) return prev + 1;
        clearInterval(stepInterval);
        return prev;
      });
    }, 2000);

    try {
      const response = await fetch('/.netlify/functions/analyze-health', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageData,
          prompt: AI_PROMPTS.healthAnalysis.prompt,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const data = await response.json();
      console.log('Raw API Response:', data);

      if (data.error) {
        throw new Error(data.error);
      }

      // Clean up the JSON string by removing markdown code blocks
      const cleanJsonString = data.analysis
        .replace(/```json\n?/g, '')  // Remove ```json
        .replace(/```\n?/g, '')      // Remove closing ```
        .trim();                     // Remove any extra whitespace

      console.log('Cleaned JSON string:', cleanJsonString);

      let parsedData;
      try {
        parsedData = JSON.parse(cleanJsonString);
      } catch (e) {
        console.error('Failed to parse analysis:', e);
        throw new Error('Invalid response format from analysis');
      }

      console.log('Parsed data:', parsedData);

      // Validate the required fields exist
      if (!parsedData.scores || 
          typeof parsedData.scores.leafCondition === 'undefined' ||
          typeof parsedData.scores.diseaseAndPests === 'undefined' ||
          typeof parsedData.scores.overallVigor === 'undefined') {
        throw new Error('Incomplete analysis data received');
      }

      // Create the scores array for the HealthScores component
      const healthScores = [
        {
          category: 'Leaf Condition',
          score: parsedData.scores.leafCondition,
          icon: <Leaf className="w-6 h-6" />,
          description: 'Overall health and appearance of leaves'
        },
        {
          category: 'Disease & Pests',
          score: parsedData.scores.diseaseAndPests,
          icon: <Bug className="w-6 h-6" />,
          description: 'Presence of diseases or pest infestations'
        },
        {
          category: 'Overall Vigor',
          score: parsedData.scores.overallVigor,
          icon: <TreeDeciduous className="w-6 h-6" />,
          description: 'General health and growth potential'
        }
      ];

      setAnalysis({
        text: parsedData.analysis,
        scores: healthScores
      });

      // Store simplified health record in Firebase if we have a treeId
      if (treeId) {
        const healthRecord = {
          date: new Date().toISOString(),
          leafCondition: parsedData.scores.leafCondition,
          diseaseAndPests: parsedData.scores.diseaseAndPests,
          overallVigor: parsedData.scores.overallVigor,
          userEmail: auth.currentUser?.email,
          treeId,
          createdAt: serverTimestamp()
        };

        await addDoc(collection(db, 'healthRecords'), healthRecord);
      }

    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to analyze image');
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (analysis) {
      const formattedContent = formatAnalysisForDownload(analysis.text, 'health');
      downloadText(formattedContent, `bonsai-health-analysis-${Date.now()}.txt`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <feature.icon className="w-8 h-8 text-bonsai-green" />
            <h1 className="text-3xl font-bold text-bonsai-bark dark:text-white">
              {feature.name}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            {feature.description}
          </p>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-2 flex items-center justify-center gap-1">
            <Info className="w-4 h-4" />
            <span>Analysis results can be downloaded for future reference</span>
          </p>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-bonsai-bark dark:text-white mb-4">
              Analyze Your Bonsai's Health
            </h2>
            <HealthAnalyzer
              onAnalyze={handleImageUpload}
              loading={loading}
              error={error}
              currentStep={currentStep}
              steps={ANALYSIS_STEPS}
            />

            {analysis && (
              <div className="mt-6 space-y-6">
                <HealthScores scores={analysis.scores} />
                <div className="p-4 bg-bonsai-green/10 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-bonsai-bark dark:text-white">
                      Analysis Results
                    </h3>
                    <button
                      onClick={handleDownload}
                      className="text-sm text-bonsai-green hover:text-bonsai-moss transition-colors flex items-center gap-1"
                    >
                      <Info className="w-4 h-4" />
                      <span>Download Analysis</span>
                    </button>
                  </div>
                  <MarkdownContent content={analysis.text} />
                </div>
              </div>
            )}

            {!isSubscribed && (
              <div className="mt-4 p-4 bg-bonsai-terra/10 rounded-lg flex items-start space-x-3">
                <Crown className="w-5 h-5 text-bonsai-terra flex-shrink-0 mt-1" />
                <div>
                  <p className="text-bonsai-terra font-medium">Premium Feature</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Upgrade to unlock expert health analysis and treatment recommendations.
                  </p>
                  <button
                    onClick={() => navigate('/pricing')}
                    className="mt-3 text-bonsai-terra hover:text-bonsai-clay transition-colors text-sm font-medium flex items-center space-x-2"
                  >
                    <span>View Pricing</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-semibold text-bonsai-bark dark:text-white mb-4">
              Common Health Issues
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-bonsai-green/10 rounded-lg">
                <h3 className="font-medium text-bonsai-bark dark:text-white mb-2">
                  Leaf Problems
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Yellowing, browning, or dropping leaves can indicate watering issues or nutrient deficiencies.
                </p>
              </div>
              <div className="p-4 bg-bonsai-green/10 rounded-lg">
                <h3 className="font-medium text-bonsai-bark dark:text-white mb-2">
                  Root Health
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Root rot, compacted soil, or poor drainage can affect your tree's overall health.
                </p>
              </div>
              <div className="p-4 bg-bonsai-green/10 rounded-lg">
                <h3 className="font-medium text-bonsai-bark dark:text-white mb-2">
                  Pest Infestations
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Spider mites, scale insects, or other pests can damage your bonsai's health.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}