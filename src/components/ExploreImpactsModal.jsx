import React, { useState, useEffect, useRef } from 'react';
import { StrategyCard } from './sections/StrategyCard';
import { BoostersRisksSummary } from './sections/BoostersRisksSummary';
import { SynergiesList } from './sections/SynergiesList';
import { TensionsList } from './sections/TensionsList';
import { FeedbackMiniStories } from './sections/FeedbackMiniStories';
import { MetricImpactsList } from './sections/MetricImpactsList';
import { AssumptionsPanel } from './sections/AssumptionsPanel';
import { CopyToClipboard } from './shared/CopyToClipboard';
import { 
  classifyStrategy, 
  scaleScenarioImpacts, 
  generateFeedbackMiniStories,
  getNearMissAlternatives,
  getAssumptionsPanel
} from '../utils/exploreImpactsUtils';

/**
 * ExploreImpactsModal component for displaying comprehensive impact analysis
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close handler function
 * @param {Array} props.selectedPolicies - Array of selected policy objects
 * @param {Object} props.metrics - Metrics object with contributions
 * @param {Array} props.synergies - Array of synergy objects
 * @param {Array} props.tensions - Array of tension objects
 * @param {Array} props.loops - Array of loop objects
 * @param {Object} props.scenario - Scenario object with severity
 * @param {Object} props.strategy - Strategy object
 */
export function ExploreImpactsModal({
  isOpen,
  onClose,
  selectedPolicies = [],
  metrics = {},
  synergies = [],
  tensions = [],
  loops = [],
  scenario = { id: 'baseline', name: 'Baseline', severity: 1.0 },
  strategy = null
}) {
  const [scenarioSeverity, setScenarioSeverity] = useState(scenario.severity || 1.0);
  const [scaledMetrics, setScaledMetrics] = useState(metrics);
  const [expandedSections, setExpandedSections] = useState({
    strategy: false,
    synergies: false,
    tensions: false,
    feedback: false,
    metrics: false,
    assumptions: false
  });
  
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Update scaled metrics when scenario severity changes
  useEffect(() => {
    if (isOpen && Object.keys(metrics).length > 0) {
      const scaled = scaleScenarioImpacts(metrics, scenarioSeverity);
      setScaledMetrics(scaled);
    }
  }, [scenarioSeverity, metrics, isOpen]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      modalRef.current?.focus();
    } else if (previousActiveElement.current) {
      previousActiveElement.current.focus();
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Generate strategy classification
  const strategyData = strategy || classifyStrategy(selectedPolicies);
  const alternatives = getNearMissAlternatives(strategyData.clusterScores);
  
  // Generate feedback stories
  const feedbackStories = generateFeedbackMiniStories(loops, scaledMetrics);
  
  // Generate boosters from scaled metrics
  const boosters = [];
  
  Object.entries(scaledMetrics).forEach(([metricId, metric]) => {
    if (Math.abs(metric.delta || 0) > 0.1) {
      const isNegative = metricId === 'BUDGET_STRAIN' || metricId === 'AI_VULNERABILITY_INDEX';
      const isPositive = metric.delta > 0;
      
      // Only add items that are beneficial (boosters)
      if ((isNegative && !isPositive) || (!isNegative && isPositive)) {
        const item = {
          metric: metric.label || metricId,
          direction: isPositive ? 'up' : 'down',
          magnitude: Math.abs(metric.delta) >= 5 ? 'large' : Math.abs(metric.delta) >= 2 ? 'medium' : 'small',
          description: `${isPositive ? 'Improves' : 'Reduces'} ${metric.label || metricId}`,
          value: metric.delta
        };
        
        boosters.push(item);
      }
    }
  });
  
  // Sort by absolute value
  boosters.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
  
  // Generate copy summary
  const generateCopySummary = () => {
    const topSynergy = synergies.find(s => s.active);
    
    let summary = `AI Education Policy Strategy Analysis\n`;
    summary += `Strategy: ${strategyData.label}\n`;
    summary += `Rationale: ${strategyData.rationale}\n\n`;
    
    summary += `Top Boosters:\n`;
    boosters.slice(0, 3).forEach((booster, i) => {
      summary += `${i + 1}. ${booster.metric} (${booster.magnitude} ${booster.direction})\n`;
    });
    
    if (topSynergy) {
      summary += `\nKey Synergy: ${topSynergy.label}\n`;
    }
    
    if (feedbackStories.length > 0) {
      summary += `\nFeedback Loop: ${feedbackStories[0]}\n`;
    }
    
    summary += `\nScenario: ${scenario.name} (${scenarioSeverity}x severity)`;
    
    return summary;
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleScenarioChange = (newSeverity) => {
    setScenarioSeverity(newSeverity);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        role="dialog"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 id="modal-title" className="text-2xl font-bold text-gray-900">
              Explore Impacts
            </h2>
            <p id="modal-description" className="text-sm text-gray-600 mt-1">
              Exploratory model for tradeoffs; not a forecast.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Scenario Severity Selector */}
            <div className="flex items-center gap-2">
              <label htmlFor="scenario-severity" className="text-sm font-medium text-gray-700">
                Scenario:
              </label>
              <select
                id="scenario-severity"
                value={scenarioSeverity}
                onChange={(e) => handleScenarioChange(parseFloat(e.target.value))}
                className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0.5}>0.5× Conservative</option>
                <option value={1.0}>1.0× Baseline</option>
                <option value={1.5}>1.5× Optimistic</option>
              </select>
            </div>
            
            {/* Copy Summary Button */}
            <CopyToClipboard content={generateCopySummary()}>
              Copy Summary
            </CopyToClipboard>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Above-the-fold Summary */}
          <div className="space-y-6 mb-8">
            <StrategyCard
              label={strategyData.label}
              rationale={strategyData.rationale}
              clusterScores={strategyData.clusterScores}
              confidence={strategyData.confidence}
              alternatives={alternatives}
            />
            
            <BoostersRisksSummary
              boosters={boosters}
            />
          </div>

          {/* Collapsible Sections */}
          <div className="space-y-6">
            {/* Strategy Details */}
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection('strategy')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-expanded={expandedSections.strategy}
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  Strategy Details
                </h3>
                <svg
                  className={`w-5 h-5 transform transition-transform ${
                    expandedSections.strategy ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSections.strategy && (
                <div className="p-4 border-t border-gray-200">
                  <div className="space-y-4">
                    {/* Strategy Classification Details */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">Strategy Analysis</h4>
                      <p className="text-sm text-blue-800 mb-3">
                        Your current strategy is classified as "<strong>{strategyData.label}</strong>" based on the distribution and intensity of your selected policies across three strategic clusters.
                      </p>
                      <div className="text-xs text-blue-700">
                        <p><strong>Classification Method:</strong> The system analyzes which policy clusters you're emphasizing most (governance, capacity, or culture) and the intensity levels of your selections to determine your overall strategic approach.</p>
                      </div>
                    </div>

                    {/* Cluster Contributions */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Cluster Contributions</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Object.entries(strategyData.clusterScores).map(([clusterKey, score]) => {
                          const clusterNames = {
                            governance: 'Governance & Safety',
                            capacity: 'Infrastructure & Capacity',
                            culture: 'Culture & Community'
                          };
                          const clusterDescriptions = {
                            governance: 'Focus on compliance, protection, and oversight mechanisms',
                            capacity: 'Emphasis on building technical capabilities and resources',
                            culture: 'Prioritizing stakeholder engagement and cultural change'
                          };
                          
                          return (
                            <div key={clusterKey} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium text-gray-900 text-sm">
                                  {clusterNames[clusterKey]}
                                </h5>
                                <span className="text-lg font-bold text-blue-600">
                                  {Math.round(score)}%
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mb-2">
                                {clusterDescriptions[clusterKey]}
                              </p>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                                  style={{ width: `${Math.min(100, score)}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Strategy Implications */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Strategic Implications</h4>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="text-sm text-gray-700 space-y-2">
                          <p><strong>Approach:</strong> {strategyData.rationale}</p>
                          <p><strong>Confidence Level:</strong> <span className="font-medium">{strategyData.confidence.charAt(0).toUpperCase() + strategyData.confidence.slice(1)}</span> - Based on the number of active policies and cluster distribution breadth.</p>
                          {alternatives.length > 0 && (
                            <p><strong>Near-Miss Alternatives:</strong> Your strategy is close to {alternatives.join(', ')} approaches, suggesting potential for strategic pivots.</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Policy Intensity Insights */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Policy Intensity Insights</h4>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <div className="text-sm text-amber-800 space-y-2">
                          <p><strong>Active Policies:</strong> {selectedPolicies.filter(p => (p.intensity || 0) >= 35).length} out of {selectedPolicies.length} policies are above the activation threshold (35% intensity).</p>
                          <p><strong>Average Intensity:</strong> {Math.round(selectedPolicies.reduce((sum, p) => sum + (p.intensity || 0), 0) / selectedPolicies.length)}% across all selected policies.</p>
                          <p><strong>Strategic Balance:</strong> {Object.values(strategyData.clusterScores).filter(score => score > 0).length} out of 3 strategic clusters are actively contributing to your approach.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Synergies and Tensions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleSection('synergies')}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-expanded={expandedSections.synergies}
                >
                  <h3 className="text-lg font-semibold text-gray-900">
                    Synergies
                  </h3>
                  <svg
                    className={`w-5 h-5 transform transition-transform ${
                      expandedSections.synergies ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedSections.synergies && (
                  <div className="p-4 border-t border-gray-200">
                    <SynergiesList
                      synergies={synergies}
                      selectedPolicies={selectedPolicies}
                    />
                  </div>
                )}
              </div>

              <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleSection('tensions')}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-expanded={expandedSections.tensions}
                >
                  <h3 className="text-lg font-semibold text-gray-900">
                    Tensions
                  </h3>
                  <svg
                    className={`w-5 h-5 transform transition-transform ${
                      expandedSections.tensions ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedSections.tensions && (
                  <div className="p-4 border-t border-gray-200">
                    <TensionsList
                      tensions={tensions}
                      selectedPolicies={selectedPolicies}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Feedback Mini-Stories */}
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection('feedback')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-expanded={expandedSections.feedback}
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  Feedback Mini-Stories
                </h3>
                <svg
                  className={`w-5 h-5 transform transition-transform ${
                    expandedSections.feedback ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSections.feedback && (
                <div className="p-4 border-t border-gray-200">
                  <FeedbackMiniStories
                    stories={feedbackStories}
                  />
                </div>
              )}
            </div>

            {/* Metric Impacts */}
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection('metrics')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-expanded={expandedSections.metrics}
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  Metric Impacts
                </h3>
                <svg
                  className={`w-5 h-5 transform transition-transform ${
                    expandedSections.metrics ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSections.metrics && (
                <div className="p-4 border-t border-gray-200">
                  <MetricImpactsList
                    metrics={scaledMetrics}
                    selectedPolicies={selectedPolicies}
                  />
                </div>
              )}
            </div>

            {/* Assumptions & Confidence */}
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection('assumptions')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-expanded={expandedSections.assumptions}
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  Assumptions & Confidence
                </h3>
                <svg
                  className={`w-5 h-5 transform transition-transform ${
                    expandedSections.assumptions ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSections.assumptions && (
                <div className="p-4 border-t border-gray-200">
                  <AssumptionsPanel
                    assumptions={getAssumptionsPanel()}
                    activeAssumptions={Object.keys(getAssumptionsPanel())}
                    confidenceLevels={{}}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
