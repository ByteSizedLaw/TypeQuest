$(document).ready(function() {

    // Load questions from the JSON file
    $.getJSON('https://raw.githubusercontent.com/Cyber-Finn/TypeQuest/refs/heads/main/TypeQuest/questions.json', function(data) {
        data.forEach((item, index) => {
            $('#questions-container').append(QuestionCardFactory(index + 1, item));
        });
        updateProgressBar();
    });

    // Factory function to create question cards
    function QuestionCardFactory(index, item) {
        return `
            <div class="card" id="question${index}">
                <div class="card-body">
                    <h5 class="card-title">Question ${index}</h5>
                    <p class="card-text">${item.question}</p>
                    <p class="card-text"><small class="text-muted">Type: ${item.type}, Function: ${item.function}</small></p>
                    <div class="form-group">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="question${index}" id="question${index}option1" value="1">
                            <label class="form-check-label" for="question${index}option1">Strongly Disagree</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="question${index}" id="question${index}option2" value="2">
                            <label class="form-check-label" for="question${index}option2">Disagree</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="question${index}" id="question${index}option3" value="3">
                            <label class="form-check-label" for="question${index}option3">Neutral</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="question${index}" id="question${index}option4" value="4">
                            <label class="form-check-label" for="question${index}option4">Agree</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="question${index}" id="question${index}option5" value="5">
                            <label class="form-check-label" for="question${index}option5">Strongly Agree</label>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Update progress bar
    function updateProgressBar() {
        const totalQuestions = $('#questions-container .card').length;
        const answeredQuestions = $('#questions-container .card input[type="radio"]:checked').length;
        const progress = (answeredQuestions / totalQuestions) * 100;

        $('#progress-bar')
            .css('width', `${progress}%`)
            .attr('aria-valuenow', progress)
            .text(`${Math.round(progress)}%`);
    }

    // Smooth scroll to the next question
    function scrollToNextQuestion(currentIndex) {
        const nextQuestion = $(`#question${currentIndex + 1}`);
        const headerHeight = $('header').outerHeight();

        if (nextQuestion.length) {
            $('html, body').animate({
                scrollTop: nextQuestion.offset().top - headerHeight - 20 // Adjust offset for sticky header
            }, 500);
        }
    }

    // Handle radio button change
    $(document).on('change', 'input[type="radio"]', function() {
        const currentIndex = $(this).attr('name').replace('question', '');
        updateProgressBar();
        scrollToNextQuestion(parseInt(currentIndex));
    });

    // Handle form submission
    $('#submit-button').click(function() {
        let allAnswered = true;
        $('#questions-container .card').each(function() {
            if ($(this).find('input[type="radio"]:checked').length === 0) {
                allAnswered = false;
                $(this).addClass('border border-danger');
            } else {
                $(this).removeClass('border border-danger');
            }
        });

        if (!allAnswered) {
            alert('Please answer all questions before submitting.');
        } else {
            //alert('Form submitted!');
        }
    });
});
