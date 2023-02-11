
$(document).ready(function () {
    $('.flip-card').click(function () {
        var index = $('.flip-card').index(this);
        if (!$(this).hasClass("flipped")) {
            $(this).toggleClass('flipped');
            var x = $(this).find('.flip-card-front')
            var y = $(this).find('.flip-card-back')
            $(x).css("display", "none");
            $(y).css("display", "inline-block");
            var scoreToGet = $('#scoretoGet').text()
            var xx = parseInt(scoreToGet);
            $('#scoretoGet').html(xx - 1);
        }

    });
    if(window.location.pathname =="/scatter/" || window.location.pathname =="/guessWho/"){
       if(!(localStorage.getItem("wynik"))){
       localStorage.setItem("wynik", 0);
       localStorage.setItem("trial", 0);
       }
     }
    if (window.location.pathname == "/guessWho/" || window.location.pathname == "/whoMore/" || window.location.pathname == "/scatter/") {
        var odp = localStorage.getItem("wynik");
        var trials = localStorage.getItem("trial");

        if (!odp) {
            $('#score').html(0);
            $('#trial').html(0);
        }
        else {
            $('#score').html(odp);
            $('#trial').html(trials);
        }
    }
    else {
        localStorage.removeItem("wynik");
        localStorage.removeItem("trial");
    }

     

    $('#my-form').submit(function (event) {
        event.preventDefault();
        var surname = $('input[name="surname"]').val();
        var correctAnswer = $('input[name="correctAnswer"]').val();
        var csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        var scoreToGet = $('#scoretoGet').text();
        var wynik = $('#score').text();
        var removeWrongAnswer = function () {
            var wrongAnswer = $('#summary');

            wrongAnswer.animate({
                opacity: "-=1"
            }, 1000, function () {
                $(wrongAnswer).css("display", "none");
            });
        };

        $.ajax({
            headers: { 'X-CSRFToken': csrftoken },
            type: 'POST',
            url: '/checkPlayer/',
            data: {
                surname: surname,
                correctAnswer: correctAnswer,
            },
            success: function (data) {
                var trail = parseInt($('#trial').text());
                $('#trial').html(trail + 1);
                var x = data
                if (x == 'Błędna odpowiedź') {
                    var wrongAnswer = $('#summary');
                    $(wrongAnswer).css("display", "inline-block");
                    $(wrongAnswer).css("opacity", "1");
                    $('#summary').html(data);
                    setTimeout(removeWrongAnswer, 3000);
                }
                else {
                    var scoreToGet = parseInt($('#scoretoGet').text());
                    var trial = parseInt($('#trial').text());
                    var wynik = parseInt($('#score').text());

                    localStorage.setItem("wynik", scoreToGet + wynik);
                    localStorage.setItem("trial", trial);
                    window.location.href = "/guessWho";

                }
            }
        });
        return false;
    });

    $(".radio-content").click(function () {
        $(".radio-content").removeClass("selected");
        $(this).addClass("selected");
        $(this).parent().find("input[type='radio']").prop("checked", true);
        var csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        var selectedOption = $(this).parent().find("input[type='radio']").val();

        var radioButtons = $("input[type='radio']");
        var values = [];
        radioButtons.each(function () {
            values.push($(this).val());
        });
        $.ajax({
            headers: { 'X-CSRFToken': csrftoken },
            type: "POST",
            url: "/checkWhoMore/",
            data: { selected_option: selectedOption, all_options: values.join(",") },
            success: function (data) {
                var x = data;

                var score = parseInt($('#score').text());

                if (x != 'Błędna odpowiedź') {
                    $(".selected").find('div.cardStyle').css("background", "linear-gradient(#19A186, #F2CF43)");
                    $(".hideAnswer").css('display', 'none');
                    $(".showAnswer").css('display', 'inline-block');
                    $('#score').html(score + 1);
                    localStorage.setItem("wynik", score + 1);
                    skipPlayer(1500);

                }
                else {
                    $(".selected").find('div.cardStyle').css("background", "linear-gradient(#FE0944, #FEAE96)");
                    $("#modalContentText").html(data);
                    $("#currentScore").html(' ' + score + 'pkt');
                    $("#bsModal3").modal('show');
                    localStorage.removeItem("wynik");
                    $(".hideAnswer").css('display', 'none');
                    $(".showAnswer").css('display', 'inline-block');
                    skipPlayer(3000);

                }
            }
        });
    });

    $('#campiagn_search_id').on('keyup', function () {
        var answer = $("#campiagn_search_id")[0].value;
        var myCircles = $('.numberCircle');
        var inputs = $.map($('.numberCircle'), function (div) {
            return div.innerHTML
        });
        var csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        $.ajax({
            headers: { 'X-CSRFToken': csrftoken },
            type: "POST",
            url: "/scatterCheck/",
            data: { answer: answer, 'inputs[]': inputs },
            success: function (data) {
                var x = data;
                $(myCircles).each(function (index, element) {
                    $(element).css('background', '#2a2a2a');
                });
                for (var i = 0; i < x.length; i++) {
                    $(myCircles[x[i]]).css("background", "linear-gradient(#19A186, #F2CF43)");
                }
            }
        });
    });

    $('#checkSurnameScratter').submit(function (event) {
        event.preventDefault();
        var myAnswer = $("#campiagn_search_id")[0].value;
        var correctAnswer = $("input[name='correctSurnameAnswer']")[0].value;
        var odp = localStorage.getItem("wynik");
        var answerLabel = $('#summary');
        var scoreToGet = $('#score').text()
        var xx = parseInt(scoreToGet);

        function animateAnswerLabel() {
            answerLabel.animate({
                opacity: "-=1"
            }, 2000, function () {
                $(answerLabel).css("opacity", "1");
                $(answerLabel).css("display", "none");
            });
        }
        var originalAnswer=correctAnswer;
        correctAnswer=removeDiacritics(correctAnswer);
        myAnswer=removeDiacritics(myAnswer);
        

        if (myAnswer == correctAnswer) {
            $(answerLabel).css("display", "inline-block");
            $(answerLabel).css("opacity", "1");
            $(answerLabel).css("background", "linear-gradient(#19A186, #F2CF43)");
            $(answerLabel).html('Poprawna odpowiedź!');
            localStorage.setItem("wynik", parseInt(odp) + 1);
            $('#score').html(xx + 1);
            $('#campiagn_search_id').val('');
            $('#answerOne').html(originalAnswer.charAt(0).toUpperCase() + originalAnswer.slice(1));
            skipPlayer(3000);
        }
        else {
            $(answerLabel).html('Błędna odpowiedź!');
            $(answerLabel).css("display", "inline-block");
            $(answerLabel).css("background", "linear-gradient(#A40606, #D98324)");
            setTimeout(function () {
                animateAnswerLabel();
            }, 2000);
        }
    });

});
function skipPlayer(value) {
    $(document).ready(function () {
        setTimeout(function () {
            location.reload();
        }, value);
    });
}
function removeDiacritics(input) {
    var output = "";

    var normalized = input.normalize("NFD");
    var i = 0;
    var j = 0;

    while (i < input.length) {
        output += normalized[j];

        j += (input[i] == normalized[j]) ? 1 : 2;
        i++;
    }

    return output;
}