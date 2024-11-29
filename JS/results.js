$(document).ready(function() {
    // Handle form submission
    $('#submit-button').click(function() {
        let allAnswered = true;
        let cognitiveScores = {
            Ni: 0, Ne: 0, Fi: 0, Fe: 0, Si: 0, Se: 0, Ti: 0, Te: 0
        };
        let enneagramScores = {
            Type1: 0, Type2: 0, Type3: 0, Type4: 0, Type5: 0, Type6: 0, Type7: 0, Type8: 0, Type9: 0
        };

        $('#questions-container .card').each(function(index) {
            if ($(this).find('input[type="radio"]:checked').length === 0) {
                allAnswered = false;
                $(this).addClass('border border-danger');
            } else {
                $(this).removeClass('border border-danger');

                // Get the selected value
                const value = parseInt($(this).find('input[type="radio"]:checked').val());
                // Get the function/type being measured
                const type = $(this).find('small.text-muted').text().match(/Function: (\w+)/)[1];

                if (type.startsWith('Type')) {
                    enneagramScores[type] += value;
                } else {
                    cognitiveScores[type] += value;
                }
            }
        });

        if (!allAnswered) {
            //alert('Please answer all questions before submitting.');
        } else {
            // Calculate Cognitive Functions and MBTI Type
            const cognitiveFunctionStack = calculateCognitiveFunctions(cognitiveScores);
            const mbtiType = determineMBTIType(cognitiveFunctionStack);
            const enneagramResult = calculateEnneagramType(enneagramScores);

            // Display results
            displayResults(mbtiType, cognitiveFunctionStack, enneagramResult);

            // Hide submit button and reset progress bar
            $('#submit-button').hide();
            resetProgressBar();
        }
    });

    function calculateCognitiveFunctions(scores) {
        const mbtiFunctionOrder = {
            Te: ['Ni', 'Se', 'Fi'], Ti: ['Ne', 'Se', 'Fi'],
            Fe: ['Ni', 'Se', 'Ti'], Fi: ['Ne', 'Si', 'Te'],
            Ne: ['Ti', 'Fe', 'Si'], Ni: ['Te', 'Fi', 'Se'],
            Se: ['Ti', 'Fe', 'Ni'], Si: ['Te', 'Fi', 'Ne']
        };
        
        let sortedFunctions = Object.entries(scores).sort((a, b) => b[1] - a[1]);
        let dominantFunction = sortedFunctions[0][0];
        let cognitiveFunctionStack = [dominantFunction];
        
        let possibleSecondaries = mbtiFunctionOrder[dominantFunction];
        let secondaryFunction = possibleSecondaries.find(func => scores[func] > 0) || possibleSecondaries[0];
        cognitiveFunctionStack.push(secondaryFunction);
        
        // Alternate the remaining functions correctly
        let tertiaryFunction = possibleSecondaries.find(func => func !== secondaryFunction && !cognitiveFunctionStack.includes(func));
        let auxiliaryFunction = possibleSecondaries.find(func => func !== secondaryFunction && func !== tertiaryFunction);

        cognitiveFunctionStack.push(tertiaryFunction, auxiliaryFunction);

        // Ensure exactly 4 cognitive functions
        if (cognitiveFunctionStack.length > 4) {
            cognitiveFunctionStack = cognitiveFunctionStack.slice(0, 4);
        }

        return cognitiveFunctionStack;
    }

    function determineMBTIType(stack) {
        const mbtiTypes = {
            "TeNiSeFi": "ENTJ", "NiTeFiSe": "INTJ",
            "TeSiNeFi": "ESTJ", "SiTeFiNe": "ISTJ",
            "FeNiSeTi": "ENFJ", "NiFeTiSe": "INFJ",
            "FeSiNeTi": "ESFJ", "SiFeTiNe": "ISFJ",
            "NeTiFeSi": "ENTP", "TiNeSiFe": "INTP",
            "SeTiFeNi": "ESTP", "TiSeNiFe": "ISTP",
            "NeFiTeSi": "ENFP", "FiNeSiTe": "INFP",
            "SeFiTeNi": "ESFP", "FiSeNiTe": "ISFP"
        };

        const stackString = stack.join('');

        // Check if the exact stack matches any MBTI type
        if (mbtiTypes[stackString]) {
            return mbtiTypes[stackString];
        }

        // Fallback: Find the closest matching MBTI type
        let closestMatch = "Unknown MBTI Type";
        let maxMatchCount = 0;

        Object.entries(mbtiTypes).forEach(([validStack, type]) => {
            const matchCount = stack.filter(func => validStack.includes(func)).length;
            if (matchCount > maxMatchCount) {
                maxMatchCount = matchCount;
                closestMatch = type;
            }
        });

        return closestMatch;
    }

    function calculateEnneagramType(scores) {
        let sortedTypes = Object.entries(scores).sort((a, b) => b[1] - a[1]);
        let dominantType = sortedTypes[0][0];
        let wingType = sortedTypes[1][0];

        let descriptions = {
            Type1: "The Reformer - principled, purposeful, self-controlled, and perfectionistic.",
            Type2: "The Helper - generous, demonstrative, people-pleasing, and possessive.",
            Type3: "The Achiever - adaptable, excelling, driven, and image-conscious.",
            Type4: "The Individualist - expressive, dramatic, self-absorbed, and temperamental.",
            Type5: "The Investigator - perceptive, innovative, secretive, and isolated.",
            Type6: "The Loyalist - engaging, responsible, anxious, and suspicious.",
            Type7: "The Enthusiast - spontaneous, versatile, acquisitive, and scattered.",
            Type8: "The Challenger - self-confident, decisive, willful, and confrontational.",
            Type9: "The Peacemaker - receptive, reassuring, complacent, and resigned."
        };

        return {
            type: dominantType,
            wing: wingType,
            description: descriptions[dominantType]
        };
    }

    function displayResults(mbtiType, cognitiveFunctionStack, enneagramResult) {
        const resultsContainer = $('#questions-container');
        resultsContainer.empty().show();

        const mbtiImage = `<img src="https://github.com/Cyber-Finn/TypeQuest/blob/main/TypeQuest/Images/${mbtiType}.png" alt="${mbtiType}" class="mbti-image">`;

        const resultsCard = `
            <div class="card">
                <div class="card-body text-center">
                    <div class="mbti-image-circle">
                        ${mbtiImage}
                    </div>
                    <h3 class="card-title mt-3">${mbtiType}</h3>
                    <p class="card-text"><strong>Cognitive Function Stack:</strong> ${cognitiveFunctionStack.join(', ')}</p>
                    <p class="card-text"><strong>Enneagram Type:</strong> ${enneagramResult.type} (Wing: ${enneagramResult.wing})</p>
                </div>
            </div>`;

        resultsContainer.append(resultsCard);
    }

    function resetProgressBar() {
        $('#progress-bar').css('width', '0%').attr('aria-valuenow', 0).text('0%');
    }
});
