import React from 'react';

/**
 * SystemDynamicsDiagram component for displaying professional causal loop diagrams
 * @param {Object} props
 * @param {Array} props.stories - Array of feedback stories
 * @param {Array} props.loops - Array of loop objects (optional)
 */
export function SystemDynamicsDiagram({ stories = [], loops = [] }) {
  // Safe loop type detection
  const getLoopType = (story) => {
    if (!story || typeof story !== 'string') return 'reinforcing';
    
    const lowerStory = story.toLowerCase();
    if (lowerStory.includes('positive') || lowerStory.includes('reinforcing')) {
      return 'reinforcing';
    }
    if (lowerStory.includes('balancing') || lowerStory.includes('stability')) {
      return 'balancing';
    }
    return 'reinforcing';
  };

  // Enhanced node extraction for better examples
  const generateLoopFromStory = (story, index) => {
    if (!story || typeof story !== 'string') {
      return {
        type: 'reinforcing',
        name: 'Feedback Loop',
        description: 'System feedback mechanism',
        nodes: ['High Innovation', 'Security Incidents', 'Public Concern', 'Administrative Caution', 'Reduced Experimentation']
      };
    }

    const loopType = getLoopType(story);
    
    // Enhanced node mapping for better examples
    const nodeMap = {
      'teacher': 'Teacher Training',
      'ai': 'AI Integration', 
      'student': 'Student Learning',
      'community': 'Community Trust',
      'satisfaction': 'Teacher Satisfaction',
      'literacy': 'AI Literacy',
      'trust': 'Community Trust',
      'equity': 'Digital Equity',
      'budget': 'Budget Management',
      'infrastructure': 'Technology Infrastructure',
      'development': 'Professional Development',
      'innovation': 'High Innovation',
      'security': 'Security Incidents',
      'public': 'Public Concern',
      'administrative': 'Administrative Caution',
      'experimentation': 'Reduced Experimentation'
    };
    
    const nodes = [];
    const lowerStory = story.toLowerCase();
    Object.entries(nodeMap).forEach(([key, value]) => {
      if (lowerStory.includes(key)) {
        nodes.push(value);
      }
    });
    
    // Use example nodes if none found
    if (nodes.length < 3) {
      if (loopType === 'balancing') {
        nodes.push('High Innovation', 'Security Incidents', 'Public Concern', 'Administrative Caution', 'Reduced Experimentation');
      } else {
        nodes.push('Teacher Training', 'AI Skills', 'Student Outcomes', 'Community Trust', 'Support');
      }
    }
    
    return {
      type: loopType,
      name: loopType === 'reinforcing' ? 'Reinforcing Loop' : 'Balancing Loop',
      description: story,
      nodes: nodes.slice(0, 5) // Allow up to 5 nodes like in the example
    };
  };

  // Safe data preparation
  let displayLoops = [];
  try {
    if (loops && loops.length > 0) {
      displayLoops = loops;
    } else if (stories && stories.length > 0) {
      displayLoops = stories.map(generateLoopFromStory);
    }
  } catch (error) {
    console.error('Error preparing loop data:', error);
    displayLoops = [];
  }

  return (
    <div className="space-y-8">
      {displayLoops.map((loop, index) => {
        try {
          const isReinforcing = loop && loop.type === 'reinforcing';
          const loopNodes = loop && loop.nodes ? loop.nodes : ['Policy', 'Implementation', 'Outcome'];
          
          return (
            <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
              {/* Professional Circular Diagram */}
              <div className="relative w-full h-80 flex items-center justify-center mb-6">
                <svg viewBox="0 0 300 300" className="w-full h-full">
                  {/* Calculate node positions */}
                  {loopNodes.map((node, nodeIndex) => {
                    const angle = (nodeIndex * 360) / loopNodes.length;
                    const radian = (angle - 90) * (Math.PI / 180);
                    const radius = 120;
                    const x = 150 + radius * Math.cos(radian);
                    const y = 150 + radius * Math.sin(radian);
                    
                    return (
                      <g key={nodeIndex}>
                        {/* Connecting line to next node */}
                        {nodeIndex < loopNodes.length - 1 && (
                          <line
                            x1={x}
                            y1={y}
                            x2={150 + radius * Math.cos(((nodeIndex + 1) * 360 / loopNodes.length - 90) * Math.PI / 180)}
                            y2={150 + radius * Math.sin(((nodeIndex + 1) * 360 / loopNodes.length - 90) * Math.PI / 180)}
                            stroke={isReinforcing ? '#10b981' : '#f59e0b'}
                            strokeWidth="2"
                            opacity="0.6"
                          />
                        )}
                        {/* Line from last node to first node */}
                        {nodeIndex === loopNodes.length - 1 && (
                          <line
                            x1={x}
                            y1={y}
                            x2={150 + radius * Math.cos((0 * 360 / loopNodes.length - 90) * Math.PI / 180)}
                            y2={150 + radius * Math.sin((0 * 360 / loopNodes.length - 90) * Math.PI / 180)}
                            stroke={isReinforcing ? '#10b981' : '#f59e0b'}
                            strokeWidth="2"
                            opacity="0.6"
                          />
                        )}
                        
                        {/* Node oval */}
                        <ellipse
                          cx={x}
                          cy={y}
                          rx="35"
                          ry="18"
                          fill={isReinforcing ? '#dcfce7' : '#fef3c7'}
                          stroke={isReinforcing ? '#10b981' : '#f59e0b'}
                          strokeWidth="2"
                        />
                        
                        {/* Node text */}
                        <text
                          x={x}
                          y={y + 2}
                          textAnchor="middle"
                          className={`text-xs font-medium ${
                            isReinforcing ? 'fill-green-800' : 'fill-amber-800'
                          }`}
                        >
                          {node.length > 15 ? node.substring(0, 15) + '...' : node}
                        </text>
                      </g>
                    );
                  })}
                  
                  {/* Center circle with loop type */}
                  <circle
                    cx="150"
                    cy="150"
                    r="20"
                    fill={isReinforcing ? '#dcfce7' : '#fef3c7'}
                    stroke={isReinforcing ? '#10b981' : '#f59e0b'}
                    strokeWidth="2"
                  />
                  
                  {/* Directional arrow in center */}
                  <defs>
                    <marker
                      id={`arrow-${index}`}
                      markerWidth="6"
                      markerHeight="4"
                      refX="5"
                      refY="2"
                      orient="auto"
                    >
                      <polygon
                        points="0 0, 6 2, 0 4"
                        fill={isReinforcing ? '#065f46' : '#92400e'}
                      />
                    </marker>
                  </defs>
                  
                  <path
                    d="M 165 150 A 10 10 0 1 1 160 140"
                    fill="none"
                    stroke={isReinforcing ? '#065f46' : '#92400e'}
                    strokeWidth="2"
                    markerEnd={`url(#arrow-${index})`}
                  />
                  
                  {/* Loop type letter */}
                  <text
                    x="150"
                    y="155"
                    textAnchor="middle"
                    className={`text-lg font-bold ${
                      isReinforcing ? 'fill-green-800' : 'fill-amber-800'
                    }`}
                  >
                    {isReinforcing ? 'R' : 'B'}
                  </text>
                </svg>
              </div>
              
              {/* Legend */}
              <div className={`text-center p-3 rounded-lg border-2 ${
                isReinforcing 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}>
                <span className="font-semibold">
                  {isReinforcing ? 'R' : 'B'} {isReinforcing ? 'Reinforcing' : 'Balancing'} Loop
                </span>
              </div>
              
              {/* Description */}
              <div className="text-sm text-gray-700 mt-4 leading-relaxed">
                {loop && loop.description ? loop.description : 'Feedback loop in the system'}
              </div>
            </div>
          );
        } catch (error) {
          console.error('Error rendering loop:', error);
          return (
            <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-center text-gray-500">
                <div className="text-2xl mb-2">⚠️</div>
                <p>Error displaying loop</p>
              </div>
            </div>
          );
        }
      })}
      
      {displayLoops.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🔄</div>
          <p>No feedback loops detected</p>
          <p className="text-xs mt-1">Adjust policy intensities to see feedback effects</p>
        </div>
      )}
    </div>
  );
}
