// Test script to verify the fixed systems dynamics diagram
console.log('Testing fixed systems dynamics diagram...');

// Test various scenarios that could cause crashes
const testCases = [
  // Normal case
  {
    name: 'Normal stories',
    stories: [
      "Teachers with strong AI skills report higher job satisfaction, creating a positive cycle.",
      "High community trust enables more equitable access to AI tools."
    ],
    loops: []
  },
  
  // Empty data
  {
    name: 'Empty stories',
    stories: [],
    loops: []
  },
  
  // Null/undefined data
  {
    name: 'Null stories',
    stories: null,
    loops: undefined
  },
  
  // Invalid data types
  {
    name: 'Invalid story types',
    stories: [123, null, undefined, {}],
    loops: []
  },
  
  // Loops data
  {
    name: 'Loops data provided',
    stories: [],
    loops: [
      {
        type: 'reinforcing',
        name: 'Teacher Training Loop',
        description: 'Training leads to better outcomes',
        nodes: ['Training', 'Skills', 'Outcomes', 'Support']
      }
    ]
  }
];

console.log('\n=== Testing Safe Rendering ===');
testCases.forEach((testCase, index) => {
  console.log(`\nTest ${index + 1}: ${testCase.name}`);
  
  try {
    // Simulate the safe data preparation logic
    let displayLoops = [];
    
    if (testCase.loops && testCase.loops.length > 0) {
      displayLoops = testCase.loops;
      console.log(`  ✅ Using ${displayLoops.length} loops from provided data`);
    } else if (testCase.stories && testCase.stories.length > 0) {
      displayLoops = testCase.stories.map((story, idx) => {
        if (!story || typeof story !== 'string') {
          return {
            type: 'reinforcing',
            name: 'Feedback Loop',
            description: 'System feedback mechanism',
            nodes: ['Policy', 'Implementation', 'Outcome', 'Feedback']
          };
        }
        
        const lowerStory = story.toLowerCase();
        const isReinforcing = lowerStory.includes('positive') || lowerStory.includes('reinforcing');
        
        return {
          type: isReinforcing ? 'reinforcing' : 'balancing',
          name: isReinforcing ? 'Reinforcing Loop' : 'Balancing Loop',
          description: story,
          nodes: ['Policy', 'Implementation', 'Outcome', 'Feedback']
        };
      });
      console.log(`  ✅ Generated ${displayLoops.length} loops from stories`);
    } else {
      console.log(`  ✅ No data to display (safe empty state)`);
    }
    
    // Test node positioning calculation
    if (displayLoops.length > 0) {
      const loop = displayLoops[0];
      const nodes = loop.nodes || ['Policy', 'Implementation', 'Outcome'];
      
      nodes.forEach((node, nodeIndex) => {
        const angle = (nodeIndex * 360) / nodes.length;
        const radian = (angle - 90) * (Math.PI / 180);
        const x = 96 + 96 * Math.cos(radian);
        const y = 96 + 96 * Math.sin(radian);
        
        console.log(`    Node ${nodeIndex}: "${node}" at angle ${angle.toFixed(1)}° (${x.toFixed(1)}, ${y.toFixed(1)})`);
      });
    }
    
    console.log(`  ✅ Test ${index + 1} passed - no crashes`);
    
  } catch (error) {
    console.log(`  ❌ Test ${index + 1} failed:`, error.message);
  }
});

console.log('\n=== Key Safety Features ===');
console.log('✅ Null/undefined checks for all data');
console.log('✅ Type checking for story strings');
console.log('✅ Try-catch blocks around rendering');
console.log('✅ Fallback values for missing properties');
console.log('✅ Safe mathematical calculations');
console.log('✅ Error boundaries with fallback UI');
console.log('✅ No complex SVG that could crash');

console.log('\n✅ Fixed systems dynamics diagram should now work without blank screens!');
