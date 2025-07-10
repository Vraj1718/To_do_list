from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages
from .models import Task
from django.contrib.auth.decorators import login_required
from datetime import date

def register_view(request):
    if request.user.is_authenticated:
        return redirect('home')

    if request.method == "POST":
        username = request.POST['username'].strip()
        password = request.POST['password']
        confirm_password = request.POST['confirm_password']

        if password != confirm_password:
            messages.error(request, "Passwords do not match")
            return render(request, 'todo/register.html', {'username': username})


        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already taken")
            return render(request, 'todo/register.html', {'username': username})

        user = User.objects.create_user(username=username, password=password)
        login(request, user)
        return redirect('home')

    return render(request, 'todo/register.html')



def login_view(request):
    if request.user.is_authenticated:
        return redirect('home')

    if request.method == "POST":
        username = request.POST['username'].strip()
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user:
            login(request, user)
            return redirect('home')
        else:
            messages.error(request, "Invalid credentials")
            return render(request, 'todo/login.html', {'username': username})
    return render(request, 'todo/login.html')


def logout_view(request):
    logout(request)
    return redirect('login')


@login_required
def index(request):
    priority_filter = request.GET.get('priority')
    tasks = Task.objects.filter(user=request.user)

    if priority_filter:
        tasks = tasks.filter(priority=priority_filter)

    tasks = tasks.order_by('completed', 'due_date')  # Optional: organize by status and date
    return render(request, 'todo/index.html', {'tasks': tasks})


@login_required
def add_task(request):
    if request.method == 'POST':
        title = request.POST['title'].strip()
        description = request.POST['description'].strip()
        due_date = request.POST['due_date']
        priority = request.POST['priority']
        Task.objects.create(
            user=request.user,
            title=title,
            description=description,
            due_date=due_date,
            priority=priority
        )
        messages.success(request, "Task added successfully")
        return redirect('home')
    return render(request, 'todo/add_task.html')


@login_required
def edit_task(request, task_id):
    task = get_object_or_404(Task, id=task_id, user=request.user)
    if request.method == 'POST':
        task.title = request.POST['title'].strip()
        task.description = request.POST['description'].strip()
        task.due_date = request.POST['due_date']
        task.priority = request.POST['priority']
        task.save()
        messages.success(request, "Task updated successfully")
        return redirect('home')
    return render(request, 'todo/edit_task.html', {'task': task})


@login_required
def delete_task(request, task_id):
    task = get_object_or_404(Task, id=task_id, user=request.user)
    task.delete()
    messages.success(request, "Task deleted successfully")
    return redirect('home')


@login_required
def complete_task(request, task_id):
    task = get_object_or_404(Task, id=task_id, user=request.user)
    task.completed = True
    task.save()
    messages.success(request, "Task marked as complete")
    return redirect('home')
