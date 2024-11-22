from django.db import DataError, IntegrityError
from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest, HttpResponseNotFound, HttpResponseForbidden
from django.contrib.auth.models import User
from blog.models import Article, Comment
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from json import JSONDecodeError
from django.views.decorators.http import require_http_methods
import json


def login_required_401(func):
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return HttpResponse(status=401)
        return func(request, *args, **kwargs)
    return wrapper


@require_http_methods(['POST'])
def signup(request):
    try:
        req_data = json.loads(request.body.decode())
        username = req_data['username']
        password = req_data['password']
    except(KeyError, JSONDecodeError):
        return HttpResponseBadRequest()
    try:
        User.objects.create_user(username=username, password=password)
        return HttpResponse(status=201)
    except(DataError, IntegrityError):
        return HttpResponseBadRequest()


@require_http_methods(['POST'])
def signin(request):
    try:
        req_data = json.loads(request.body.decode())
        username = req_data['username']
        password = req_data['password']
    except(KeyError, JSONDecodeError):
        return HttpResponseBadRequest()
    user = authenticate(username=username, password=password)
    if user is not None:
        login(request, user)
        return HttpResponse(status=204)
    return HttpResponse(status=401)


@require_http_methods(['GET'])
@login_required_401
def signout(request):
    logout(request)
    return HttpResponse(status=204)


@require_http_methods(['GET'])
@ensure_csrf_cookie
def token(request):
    return HttpResponse(status=204)


def article_to_json(article):
    return {'id': article.id, 'title': article.title, 'content': article.content, 'author': article.author_id}


@require_http_methods(['GET', 'POST'])
@login_required_401
def article(request):
    if request.method == 'GET':
        article_list = [article_to_json(article) for article in Article.objects.all()]
        return JsonResponse(article_list, safe=False, status=200)
    else:
        try:
            request_data = request.body.decode()
            title = json.loads(request_data)['title']
            content = json.loads(request_data)['content']
        except(KeyError, JSONDecodeError):
            return HttpResponseBadRequest()
        article = Article.objects.create(title=title, content=content, author=request.user)
        return JsonResponse(article_to_json(article), status=201)


@require_http_methods(['GET', 'PUT', 'DELETE'])
@login_required_401
def article_detail(request, article_id):
    try:
        article = Article.objects.get(id=article_id)
    except Article.DoesNotExist:
        return HttpResponseNotFound()

    if request.method == 'GET':
        return JsonResponse(article_to_json(article), status=200)
    else:
        if request.user != article.author:
            return HttpResponseForbidden()
        if request.method == 'PUT':
            try:
                request_data = request.body.decode()
                title = json.loads(request_data)['title']
                content = json.loads(request_data)['content']
            except(KeyError, JSONDecodeError):
                return HttpResponseBadRequest()
            article.title = title
            article.content = content
            article.save()
            return JsonResponse(article_to_json(article), status=200)
        else:
            article.delete()
            return HttpResponse(status=200)


def comment_to_json(comment):
    return {'id': comment.id, 'article': comment.article_id, 'content': comment.content, 'author': comment.author_id}


@require_http_methods(['GET', 'POST'])
@login_required_401
def article_comment(request, article_id):
    article = Article.objects.get(id=article_id)
    if request.method == 'GET':
        comment_list = [comment_to_json(comment) for comment in article.comments.all()]
        return JsonResponse(comment_list, safe=False, status=200)
    else:
        try:
            request_data = request.body.decode()
            content = json.loads(request_data)['content']
        except(KeyError, JSONDecodeError):
            return HttpResponseBadRequest()
        comment = Comment.objects.create(article=article, content=content, author=request.user)
        return JsonResponse(comment_to_json(comment), status=201)


@require_http_methods(['GET', 'PUT', 'DELETE'])
@login_required_401
def comment_detail(request, comment_id):
    try:
        comment = Comment.objects.get(id=comment_id)
    except Comment.DoesNotExist:
        return HttpResponseNotFound()

    if request.method == 'GET':
        return JsonResponse(comment_to_json(comment), status=200)
    else:
        if request.user != comment.author:
            return HttpResponseForbidden()
        if request.method == 'PUT':
            try:
                request_data = request.body.decode()
                content = json.loads(request_data)['content']
            except(KeyError, JSONDecodeError):
                return HttpResponseBadRequest()
            comment.content = content
            comment.save()
            return JsonResponse(comment_to_json(comment), status=200)
        else:
            comment.delete()
            return HttpResponse(status=200)
