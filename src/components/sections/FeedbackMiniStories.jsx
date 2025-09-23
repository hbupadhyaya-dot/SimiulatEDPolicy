import React from 'react';
import { IconLoop } from '../shared/IconLoop';
import { Badge } from '../shared/Badge';

/**
 * FeedbackMiniStories component for displaying feedback loop stories
 * @param {Object} props
 * @param {Array} props.stories - Array of story strings
 * @param {boolean} props.showDiagram - Whether to show diagram toggle
 */
export function FeedbackMiniStories({ 
  stories = []
}) {

  const getLoopType = (story) => {
    if (story.toLowerCase().includes('positive') || story.toLowerCase().includes('reinforcing')) {
      return 'reinforcing';
    }
    if (story.toLowerCase().includes('balancing') || story.toLowerCase().includes('stability')) {
      return 'balancing';
    }
    return 'reinforcing'; // Default
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Feedback Mini-Stories
        </h3>
      </div>
      
      {stories.length > 0 ? (
        <div className="space-y-4">
          {stories.map((story, index) => {
            const loopType = getLoopType(story);
            const isReinforcing = loopType === 'reinforcing';
            
            return (
              <div 
                key={index} 
                className={`p-4 rounded-lg border ${
                  isReinforcing 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-amber-50 border-amber-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <IconLoop 
                      type={loopType} 
                      size={20}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge 
                        variant={isReinforcing ? 'success' : 'warning'}
                        size="sm"
                      >
                        {isReinforcing ? 'Reinforcing Loop' : 'Balancing Loop'}
                      </Badge>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      {story}
                    </p>
                    
                    {/* Add specific implications for each story */}
                    <div className="text-xs text-gray-600 bg-white p-2 rounded border">
                      {story.includes('teacher satisfaction') && story.includes('AI literacy') && (
                        <p><strong>Implication:</strong> This positive cycle can accelerate AI adoption, but requires sustained investment in teacher support to maintain momentum.</p>
                      )}
                      {story.includes('community trust') && story.includes('digital equity') && (
                        <p><strong>Implication:</strong> Building trust and equity together creates a strong foundation for long-term AI education success, but both require careful attention.</p>
                      )}
                      {story.includes('budget strain') && (
                        <p><strong>Implication:</strong> This natural constraint helps prevent over-extension, but may limit growth if not managed carefully with strategic prioritization.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
            <IconLoop type="reinforcing" size={24} />
          </div>
          <p>No feedback loops detected</p>
          <p className="text-sm mt-1">Complex interactions may emerge with more policies</p>
          <div className="mt-4 text-xs text-gray-400">
            <p>Look for patterns like:</p>
            <p>• High teacher satisfaction + AI literacy = reinforcing loop</p>
            <p>• High budget strain = balancing constraint</p>
            <p>• Community trust + digital equity = mutual reinforcement</p>
          </div>
        </div>
      )}
      
    </div>
  );
}
