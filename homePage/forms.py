from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User


class SignUpForm(UserCreationForm):
    username = forms.CharField(label='Nazwa użytkownika', required=True, widget=forms.TextInput(attrs={
        'class': 'form-control form-control-sm',
        'placeholder': 'Nazwa użytkownika'
    }))
    email = forms.EmailField(required=True, widget=forms.EmailInput(attrs={
        'class': 'form-control form-control-sm',
        'placeholder': 'Email:'
    }))
    password1 = forms.CharField(label='Hasło', required=True, widget=forms.PasswordInput(attrs={
        'class': 'form-control form-control-sm',
        'placeholder': 'Hasło:'
    }))
    password2 = forms.CharField(label='Powtórz hasło', required=True, widget=forms.PasswordInput(attrs={
        'class': 'form-control form-control-sm',
        'placeholder': 'Powtórz Hasło:'
    }))

    # first_name = forms.CharField(max_length=30, required=False)
    # last_name = forms.CharField(max_length=30, required=False)
    # email = forms.EmailField(max_length=254)

    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')

    def clean(self):
        cleaned_data = super().clean()
        username = self.cleaned_data['username']
        if User.objects.filter(username=username).exists():
            # raise forms.ValidationError("Username already exists")
            msg = 'Nazwa użytkownika jest juz zajęta'
            self.add_error('username', msg)

        email = self.cleaned_data['email']
        if User.objects.filter(email=email).exists():
            print('wyłapało')
            # raise forms.ValidationError("Email already exists")
            msg = 'Email jest juz zajęty'
            self.add_error('email', msg)

        return cleaned_data

class UserLoginForm(forms.Form):
    email = forms.CharField(max_length=50)
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control'}))