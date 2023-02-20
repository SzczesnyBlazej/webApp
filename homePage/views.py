from django.contrib import messages
from django.contrib.auth import login, logout, authenticate, get_user_model
from django.contrib.auth.models import User
from django.http import JsonResponse, HttpResponseRedirect
from django.shortcuts import render, redirect

from homePage.forms import SignUpForm, UserLoginForm


def index(request):
    return render(request, 'index.html')


def register(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            user.refresh_from_db()
            user.save()
            login(request, user)
            return JsonResponse({'success': True})

    else:
        form = SignUpForm()
    return render(request, 'user/register.html', {'form': form})


def logout_request(request):
    logout(request)
    return HttpResponseRedirect('/')


def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        try:
            user = authenticate(request, username=username, password=password)
            if user is not None:
                # print(user)
                login(request, user)
                return JsonResponse({'success': True})
        except:
            pass

        try:
            UserModel = get_user_model()
            userEmail = UserModel.objects.get(email=username)
            user = authenticate(request, username=userEmail, password=password)
            if user is not None:
                login(request, user)
                return JsonResponse({'success': True})
        except:
            pass
        messages.info(request, 'Spróbuj ponownie! Nazwa użytkownika lub hasło są nieprawidłowe')

    return render(request, 'user/login.html')
