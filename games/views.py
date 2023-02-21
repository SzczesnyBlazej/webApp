import json
import random

from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from unidecode import unidecode
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.templatetags.static import static

from games.models import Rank
from myQuizGame.settings import BASE_DIR


def getPlayersJson():
    with open(str(BASE_DIR) + "/games/players/players.json", 'r') as file:
        data = json.load(file)
    return data


def guessWho(request):
    items = getPlayersJson()

    randomPlayer = random.choice(items)

    player = randomPlayer['player']
    playerimg = randomPlayer['playerimg']
    playerClubName = randomPlayer['playerDetails']['club']
    playerClubFlag = randomPlayer['playerDetails']['clubFlag']
    playerNation = randomPlayer['playerDetails']['nation']
    playerNationFlag = randomPlayer['playerDetails']['nationFlag']
    playerLeague = randomPlayer['playerDetails']['league']
    playerLeagueFlag = randomPlayer['playerDetails']['leagueFlag']
    playerHeight = randomPlayer['height']
    playerPosition = randomPlayer['position']

    surname = str(player).split()[-1]

    playerDetails = [['Zdjęcie zawodnika', playerimg], [playerClubName, playerClubFlag],
                     [playerNation, playerNationFlag],
                     [playerLeague, playerLeagueFlag], [playerHeight, static('img/updownarrow.png')],
                     [playerPosition, static('img/playerField.png')]]
    random.shuffle(playerDetails)

    return render(request, 'guessWho/guessWho.html', {
        'playerDetails': playerDetails,
        'surname': surname
    })


def checkPlayer(request):
    if request.method == 'POST':
        surname = request.POST.get('surname')
        answer = request.POST.get('correctAnswer')
        if unidecode(answer).lower() == str(surname).lower():
            return redirect('/guessWho')
        else:
            return HttpResponse('Błędna odpowiedź')
    return redirect('/guessWho')


def format_number(num_str):
    if num_str[-1] == 'K':
        return int(float(num_str[:-1]) * 1000)
    elif num_str[-1] == 'M':
        return int(float(num_str[:-1]) * 1000000)
    else:
        return int(num_str)


def whoMore(request):
    data = getPlayersJson()

    dataToCheck = ['height', 'rating', 'price']

    randomData = random.choice(dataToCheck)
    info = ''
    items = [record for record in data if int(record.get("rating", 0)) > 80]

    randomPlayer1 = random.choice(items)
    randomPlayer2 = random.choice(items)
    while randomPlayer1[randomData] == randomPlayer2[randomData]:
        randomPlayer2 = random.choice(items)
    if randomData == "rating":
        info = "Kto ma wyższą ocenę"
        randomPlayer1[randomData] = int(randomPlayer1[randomData])
        randomPlayer2[randomData] = int(randomPlayer2[randomData])
    if randomData == "price":
        info = "Kto jest droższy"
        randomPlayer1[randomData] = format_number(randomPlayer1[randomData].strip())
        randomPlayer2[randomData] = format_number(randomPlayer2[randomData].strip())
    if randomData == 'height':
        info = "Kto jest wyższy"
        randomPlayer1[randomData] = int(randomPlayer1[randomData].strip()[:3])
        randomPlayer2[randomData] = int(randomPlayer2[randomData].strip()[:3])

    player1 = [randomPlayer1['player'], randomPlayer1['playerimg'], randomPlayer1['playerDetails']['nationFlag'],
               randomPlayer1['playerDetails']['clubFlag'], randomPlayer1[randomData]]
    player2 = [randomPlayer2['player'], randomPlayer2['playerimg'], randomPlayer2['playerDetails']['nationFlag'],
               randomPlayer2['playerDetails']['clubFlag'], randomPlayer2[randomData]]
    return render(request, 'whoMore/whoMore.html', {'player1': player1, 'player2': player2, 'info': info})


def checkWhoMore(request):
    if request.method == 'POST':
        selected = request.POST.get('selected_option').strip('][').split(', ')
        allOptions = request.POST.get("all_options")
        result = [i.split(',') for i in allOptions[1:-1].split('],[')]
        allOptions = [[i.strip() for i in sublist] for sublist in result]

        playerPrice = ([max(lst) for lst in allOptions])
        res = [eval(i) for i in playerPrice]
        correct = max(res)

        if int(selected[-1]) < int(correct):
            return HttpResponse('Błędna odpowiedź')
        else:
            return redirect('/whoMore')
    return HttpResponse('Błędna odpowiedź')


def scatter(request):
    data = getPlayersJson()

    items = [record for record in data if int(record.get("rating", 0)) > 80]
    randomPlayer = random.choice(items)
    nationality = randomPlayer['playerDetails']['nationFlag']
    club = randomPlayer['playerDetails']['clubFlag']
    player = randomPlayer['player']
    surname = str(player).split()[-1].lower()
    surnameList = [*surname]
    random.shuffle(surnameList)

    return render(request, 'scatter/scatter.html',
                  {'nation': nationality, "club": club, 'surnameList': surnameList, 'surname': surname})


def scatterCheck(request):
    if request.method == 'POST':
        answer = request.POST.get('answer')
        inputs = request.POST.getlist('inputs[]')
        inputs = [unidecode(e) for e in inputs]
        answer = [*answer]
        answer = [x.lower() for x in answer]

        indexToMark = []

        for e in answer:
            if e in inputs:
                indexToMark.append(inputs.index(e))
                inputs[inputs.index(e)] = 'ok'
        return HttpResponse(indexToMark)


@csrf_exempt
@require_POST
def addScoreToRank(request):
    user = request.user
    games = request.POST.get('game')
    score = request.POST.get('scores')
    print('xddd')
    if user.is_authenticated:
        if Rank.objects.filter(user=user).filter(games=games).exists():
            actual = get_object_or_404(Rank, user=user, games=games)
            if int(actual.score) < int(score):
                actual.score = score
                actual.save()
        else:
            newScore = Rank(user=user, games=games, score=score)
            newScore.save()
    return JsonResponse({'success': True})
