from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User


class SignUpForm(UserCreationForm):
    first_name = forms.CharField(max_length=50, required=False, widget=forms.TextInput(attrs={
        'class': 'form-control form-control-sm',
        'placeholder': 'Imię:'
    }))
    last_name = forms.CharField(max_length=50, required=False, widget=forms.TextInput(attrs={
        'class': 'form-control form-control-sm',
        'placeholder': 'Nazwisko:'
    }))
    username = forms.CharField(widget=forms.TextInput(attrs={
        'class': 'form-control form-control-sm',
        'placeholder': 'Nazwa użytkownika'
    }))
    email = forms.EmailField(widget=forms.EmailInput(attrs={
        'class': 'form-control form-control-sm',
        'placeholder': 'Email:'
    }))
    password1 = forms.CharField(widget=forms.PasswordInput(attrs={
        'class': 'form-control form-control-sm',
        'placeholder': 'Hasło:'
    }))
    password2 = forms.CharField(widget=forms.PasswordInput(attrs={
        'class': 'form-control form-control-sm',
        'placeholder': 'Powtórz Hasło:'
    }))
    # first_name = forms.CharField(max_length=30, required=False)
    # last_name = forms.CharField(max_length=30, required=False)
    # email = forms.EmailField(max_length=254)

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password1', 'password2')
