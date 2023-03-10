// ### rejestracja
$(document).ready(function() {
    $('#registerModal').on('show.bs.modal', function (e) {
        var modal = $(this);
        var url = "/register/";
        $.ajax({
            url: url,
            type: 'get',
            success: function(data) {
                modal.find('#register-form-wrapper').html(data);
            }
        });
    });

    $(document).on('submit', '#register-form', function(event) {
        event.preventDefault();
        var url = "/register/";
        $.ajax({
            url: url,
            type: 'post',
            data: $('#register-form').serialize(),
            success: function(data) {
                if (data.success) {
                    window.location.href = "/";
                } else {

                    $('#register-form-wrapper').html(data);

                }
            }
        });
    });
});

// ### login

$(document).ready(function() {
    $('#loginModal').on('show.bs.modal', function (e) {
        var modal = $(this);
        var url = "/login/";
        $.ajax({
            url: url,
            type: 'get',
            success: function(data) {
                modal.find('#login-form-wrapper').html(data);
            }
        });
    });

    $(document).on('submit', '#login-form', function(event) {
        event.preventDefault();
        var url = "/login/";
        $.ajax({
            url: url,
            type: 'post',
            data: $('#login-form').serialize(),
            success: function(data) {
                if (data.success) {
                    window.location.href = "/";
                } else {

                    $('#login-form-wrapper').html(data);

                }
            }
        });
    });
});


// ranking
$(document).ready(function() {
    $('#rankingModal').on('show.bs.modal', function (e) {
        var modalRanking = $(this);
        var url = "/showRank/";
        $.ajax({
            url: url,
            success: function(data) {
            var rankingScore = '<table class="table"><thead><tr><th scope="col">#</th><th scope="col">Gracz</th><th scope="col">Punkty</th></tr></thead><tbody>';
                for (var i = 0; i < data.rank.length; i++) {
                    rankingScore+='<tr><th scope="row">'+(i+1)+'</th>';
                    rankingScore+='<td>'+data.rank[i].user+'</td>';
//                    rankingScore+='<td>'+data.rank[i].games+'</td>';
                    rankingScore+='<td>'+data.rank[i].score+'</td></tr>';
                }
                rankingScore += '</tbody></table>';

                modalRanking.find('#wraperContext').html(rankingScore);
            }
        });
    });

    $('.rankButtons').on('click', function (e) {
        var modalRanking = $('#rankingModal');
        var url = "/showRankButton/";
        var csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        $.ajax({
            url: url,
            type: "POST",
            data: {'filtrujRanking':this.id},
            headers: { 'X-CSRFToken': csrftoken },
            success: function(data) {
            var rankingScore = '<table class="table"><thead><tr><th scope="col">#</th><th scope="col">Gracz</th><th scope="col">Gra</th><th scope="col">Punkty</th></tr></thead><tbody>';
                for (var i = 0; i < data.rank.length; i++) {
                    rankingScore+='<tr><th scope="row">'+(i+1)+'</th>';
                    rankingScore+='<td>'+data.rank[i].user+'</td>';
                    rankingScore+='<td>'+data.rank[i].games+'</td>';
                    rankingScore+='<td>'+data.rank[i].score+'</td></tr>';
                }
                rankingScore += '</tbody></table>';

                modalRanking.find('#wraperContext').html(rankingScore);
            }
        });
    });
});

$(document).ready(function () {
    checkPathName();
    if (window.location.pathname == "/guessWho/") {
        if (!(localStorage.getItem("wynik"))) {
            localStorage.setItem("wynik", 0);
            localStorage.setItem("trial", 0);
            var odp = localStorage.getItem("wynik");
            var trials = localStorage.getItem("trial");
            $('#score').html(odp);
            $('#trial').html(trials);
        }
        else {
            var odp = localStorage.getItem("wynik");
            var trials = localStorage.getItem("trial");
            $('#score').html(odp);
            $('#trial').html(trials);
        }
        $('.flip-card').click(function () {
            var index = $('.flip-card').index(this);
            if (!$(this).hasClass("flipped")) {
                $(this).toggleClass('flipped');
                var x = $(this).find('.flip-card-front')
                var y = $(this).find('.flip-card-back')
                $(x).css("display", "none");
                $(y).css("display", "inline-block");
                var scoreToGet = parseInt($('#scoretoGet').text())
                $('#scoretoGet').html(scoreToGet - 1);
            }
        });
    }
    else if (window.location.pathname == "/whoMore/") {

        if (!(localStorage.getItem("wynik"))) {
            localStorage.setItem("wynik", 0);
            var odp = localStorage.getItem("wynik");
            $('#score').html(odp);
        }
        else {
            var odp = localStorage.getItem("wynik");
            $('#score').html(odp);
        }
    }
    else if (window.location.pathname == "/scatter/") {
        $(window).on('beforeunload', function(){
            localStorage.removeItem("firstLetterOfSurname");
        });
        if (!(localStorage.getItem("wynik"))) {
            localStorage.setItem("wynik", 0);
            var odp = localStorage.getItem("wynik");
            $('#score').html(odp);
        }
        else {
            var odp = localStorage.getItem("wynik");
            $('#score').html(odp);
        }
    }


    function checkPathName() {
        if ((localStorage.getItem("currentPathname")) !== window.location.pathname) {
            localStorage.removeItem("wynik");
            localStorage.removeItem("trial");
            localStorage.removeItem("firstLetterOfSurname");
            localStorage.setItem("currentPathname", window.location.pathname);
        }
    }


    $('#my-form').submit(function (event) {
        event.preventDefault();
        var surname = $('input[name="surname"]').val();
        var correctAnswer = $('input[name="correctAnswer"]').val();
        var csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
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
                addScoreToRank();
                $('#trial').html(localStorage.getItem("trial"));
                localStorage.setItem("trial", 1 + +localStorage.getItem("trial"));
                $('#trial').html(localStorage.getItem("trial"));
                var x = data
                if (x == 'B????dna odpowied??') {
                    var wrongAnswer = $('#summary');
                    $(wrongAnswer).css("display", "inline-block");
                    $(wrongAnswer).css("opacity", "1");
                    $('#summary').html(data);
                    setTimeout(removeWrongAnswer, 3000);
                }
                else {
                    var scoreToGet = parseInt($('#scoretoGet').text());
                    localStorage.setItem("wynik", scoreToGet + +localStorage.getItem("wynik"));
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

                if (x != 'B????dna odpowied??') {
                    $(".selected").find('div.cardStyle').css("background", "linear-gradient(#19A186, #F2CF43)");
                    $(".hideAnswer").css('display', 'none');
                    $(".showAnswer").css('display', 'inline-block');
                    $('#score').html(1 + +localStorage.getItem("wynik"));
                    localStorage.setItem("wynik", 1 + +localStorage.getItem("wynik"));
                    skipPlayer(1500);

                }
                else {
                    $(".selected").find('div.cardStyle').css("background", "linear-gradient(#FE0944, #FEAE96)");
                    $("#modalContentText").html(data);
                    $("#currentScore").html(' ' + +localStorage.getItem("wynik") + 'pkt');
                    $("#bsModal3").modal('show');
                    addScoreToRank();
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
                if (localStorage.getItem("firstLetterOfSurname")) {
                    advicesForScatter();
                }
            }
        });
    });


    $('#checkSurnameScratter').submit(function (event) {
        event.preventDefault();
        var myAnswer = $("#campiagn_search_id")[0].value;
        var correctAnswer = $("input[name='correctSurnameAnswer']")[0].value;
        var answerLabel = $('#summary');
        myAnswer = myAnswer.toLowerCase();
        correctAnswer = correctAnswer.toLowerCase();
        function animateAnswerLabel() {
            answerLabel.animate({
                opacity: "-=1"
            }, 2000, function () {
                $(answerLabel).css("opacity", "1");
                $(answerLabel).css("display", "none");
            });
        }
        var originalAnswer = correctAnswer;
        correctAnswer = removeDiacritics(correctAnswer);
        myAnswer = removeDiacritics(myAnswer);

        if (myAnswer == correctAnswer) {
            $(answerLabel).css("display", "inline-block");
            $(answerLabel).css("opacity", "1");
            $(answerLabel).css("background", "linear-gradient(#19A186, #F2CF43)");
            $(answerLabel).html('Poprawna odpowied??!');
            localStorage.setItem("wynik", 1 + +localStorage.getItem("wynik"));
            $('#score').html(+localStorage.getItem("wynik"));
            $('#campiagn_search_id').val('');
            $('#answerOne').html(originalAnswer.charAt(0).toUpperCase() + originalAnswer.slice(1));
            addScoreToRank();
            localStorage.removeItem("firstLetterOfSurname");
            skipPlayer(3000);
        }
        else {
            $(answerLabel).html('B????dna odpowied??!');
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
            localStorage.removeItem("firstLetterOfSurname");
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
function advicesForGuessWho(){
    var cardsToBeUnveiled = $(document).find(".card .align-items-center").not('.flipped');
    var randomCard = cardsToBeUnveiled[Math.floor(Math.random() * cardsToBeUnveiled.length)];
    $(randomCard).click();
}

function advicesForScatter(){
    var correctAnswer = $('input[name="correctSurnameAnswer"]').val();

    if (!(localStorage.getItem("firstLetterOfSurname"))) {
        localStorage.setItem("firstLetterOfSurname", correctAnswer[0]);
        var firstLetter=localStorage.getItem("firstLetterOfSurname");
    }
    else {
        var firstLetter=localStorage.getItem("firstLetterOfSurname");

    }
    var inputs = $.map($('.numberCircle'), function (div) {
            return div.innerHTML
        });
    var myCircles = $('.numberCircle');
    for(var i=0; i<inputs.length;i++){
        if(inputs[i]==firstLetter){
            $(myCircles[i]).css("background", "linear-gradient(#19A186, #F2CF43)");
            return false;
        }
    }
}
function getGameName(){
    var game=window.location.pathname;
    game=game.substring(1, game.length-1);
    return game
}
function getScore(){
    var currentScores=localStorage.getItem("wynik");
    return currentScores
}

function addScoreToRank(){
    var game = getGameName();
    var scores = getScore();
    $.ajax({
        type: 'POST',
        url: '/addScoreToRank/',
        data: {game: game, scores: scores},
        success: function(response) {

        },
        error: function(response) {

        }
    });
}