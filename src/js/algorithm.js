// Algorithm configuration
let config = {
    groupSize: 4,
    iterations: 1000,
    localSearchAttempts: 50,
    weights: {
        restriction: -100,
        preference1: 50,
        preference2: 30,
        preference3: 10
    }
};

// Update weights from input fields
function updateWeights() {
    config.weights.restriction = parseFloat(document.getElementById('restrictionWeight').value);
    config.weights.preference1 = parseFloat(document.getElementById('preference1Weight').value);
    config.weights.preference2 = parseFloat(document.getElementById('preference2Weight').value);
    config.weights.preference3 = parseFloat(document.getElementById('preference3Weight').value);
}

// Calculate score for a group
function calculateGroupScore(group) {
    let score = 0;
    
    // Check restrictions
    for (let student of group) {
        for (let restriction of student.restrictions) {
            if (group.some(s => s.name === restriction)) {
                score += config.weights.restriction;
            }
        }
    }
    
    // Check preferences
    for (let student of group) {
        for (let i = 0; i < student.preferences.length; i++) {
            const preference = student.preferences[i];
            if (group.some(s => s.name === preference)) {
                switch(i) {
                    case 0: score += config.weights.preference1; break;
                    case 1: score += config.weights.preference2; break;
                    case 2: score += config.weights.preference3; break;
                }
            }
        }
    }
    
    return score;
}

// Calculate total score for all groups
function calculateTotalScore(groups) {
    return groups.reduce((total, group) => total + calculateGroupScore(group), 0);
}

// Generate random groups
function generateRandomGroups(students) {
    const shuffled = [...students].sort(() => Math.random() - 0.5);
    const groups = [];
    
    for (let i = 0; i < shuffled.length; i += config.groupSize) {
        groups.push(shuffled.slice(i, i + config.groupSize));
    }
    
    return groups;
}

// Perform local search on a group
function localSearch(groups) {
    let bestScore = calculateTotalScore(groups);
    let improved = true;
    
    while (improved) {
        improved = false;
        
        for (let i = 0; i < groups.length; i++) {
            for (let j = i + 1; j < groups.length; j++) {
                for (let k = 0; k < groups[i].length; k++) {
                    for (let l = 0; l < groups[j].length; l++) {
                        // Try swapping students
                        [groups[i][k], groups[j][l]] = [groups[j][l], groups[i][k]];
                        
                        const newScore = calculateTotalScore(groups);
                        if (newScore > bestScore) {
                            bestScore = newScore;
                            improved = true;
                        } else {
                            // Swap back if no improvement
                            [groups[i][k], groups[j][l]] = [groups[j][l], groups[i][k]];
                        }
                    }
                }
            }
        }
    }
    
    return groups;
}

// Main algorithm
function findOptimalGroups(students) {
    updateWeights();
    config.groupSize = parseInt(document.getElementById('groupSize').value);
    config.iterations = parseInt(document.getElementById('iterations').value);
    config.localSearchAttempts = parseInt(document.getElementById('localSearchAttempts').value);
    
    let bestGroups = null;
    let bestScore = -Infinity;
    
    for (let i = 0; i < config.iterations; i++) {
        const groups = generateRandomGroups(students);
        const optimizedGroups = localSearch(groups);
        const score = calculateTotalScore(optimizedGroups);
        
        if (score > bestScore) {
            bestScore = score;
            bestGroups = JSON.parse(JSON.stringify(optimizedGroups));
        }
    }
    
    return {
        groups: bestGroups,
        score: bestScore
    };
} 