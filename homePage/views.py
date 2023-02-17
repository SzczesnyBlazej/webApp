from django.http import JsonResponse
from django.shortcuts import render, redirect

from homePage.forms import SignUpForm


def index(request):
    return render(request, 'index.html')


def register(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            return JsonResponse({'success': True})
        else:
            print(form.errors)
            return JsonResponse({'errors': form.errors})
    else:
        form = SignUpForm()
    return render(request, 'user/register.html', {'form': form})
