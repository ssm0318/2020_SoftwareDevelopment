from django.test import TestCase, Client
import json
from blog.models import Article, Comment
from django.contrib import auth
from django.contrib.auth.models import User
from blog.views import article_to_json, comment_to_json


class BlogTestCase(TestCase):
    def setUp(self):
        self.client = Client()

        User.objects.all().delete()
        User.objects.create_user(username='chris', password='chris')
        User.objects.create_user(username='bob', password='bob')
        User.objects.create_user(username='amy', password='amy')

        for i in range(5):
            Article.objects.create(title=f'article {i}',
                                   content=f'article content {i}',
                                   author=User.objects.all()[i % 3])

        for i in range(10):
            Comment.objects.create(article=Article.objects.all()[i % 5],
                                   content=f'comment {i}',
                                   author=User.objects.all()[i % 3])

    def test_csrf(self):
        # By default, csrf checks are disabled in test client
        # To test csrf protection we enforce csrf checks here
        client = Client(enforce_csrf_checks=True)
        response = client.post('/api/signup/', json.dumps({'username': 'username', 'password': 'password'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 403)  # Request without csrf token returns 403 response

        response = client.get('/api/token/')
        csrftoken = response.cookies['csrftoken'].value  # Get csrf token from cookie

        response = client.post('/api/signup/', json.dumps({'username': 'username', 'password': 'password'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)  # Pass csrf protection

    def test_signup(self):
        # Invalid Method (not POST)
        response = self.client.options('/api/signup/')
        self.assertEqual(response.status_code, 405)

        # JSON Error
        response = self.client.post(f'/api/signup/', {'username': 'david'})
        self.assertEqual(response.status_code, 400)

        # Success - Sign Up
        response = self.client.post('/api/signup/', json.dumps({'username': 'david', 'password': 'david'}),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 201)

        new_user = User.objects.get(username='david')
        self.assertEqual(new_user.username, 'david')

        # User Exists
        response = self.client.post('/api/signup/', json.dumps({'username': 'david', 'password': 'david'}),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_signin(self):
        # Invalid Method (not POST)
        response = self.client.options('/api/signin/')
        self.assertEqual(response.status_code, 405)

        # JSON Error
        response = self.client.post(f'/api/signin/', {'username': 'chris'})
        self.assertEqual(response.status_code, 400)

        # Sign In Fail
        response = self.client.post('/api/signin/', json.dumps({'username': 'chris', 'password': 'christ'}),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 401)
        self.assertFalse(auth.get_user(self.client).is_authenticated)

        # Success - Sign In
        response = self.client.post('/api/signin/', json.dumps({'username': 'chris', 'password': 'chris'}),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 204)
        test_user = auth.get_user(self.client)
        assert test_user.is_authenticated
        curr_user = User.objects.get(username='chris')
        self.assertEqual(curr_user.username, test_user.username)

    def test_signout(self):
        # Invalid Method (not GET)
        response = self.client.options('/api/signout/')
        self.assertEqual(response.status_code, 405)

        # Sign In First
        self.client.post('/api/signin/', json.dumps({'username': 'chris', 'password': 'chris'}),
                         content_type='application/json')
        auth_user = auth.get_user(self.client)
        assert auth_user.is_authenticated

        # Success - Sign Out
        response = self.client.get('/api/signout/', content_type='application/json')
        self.assertEqual(response.status_code, 204)
        auth_user = auth.get_user(self.client)
        assert not auth_user.is_authenticated

        # Fail Sign Out (user not signed in)
        response = self.client.get('/api/signout/')
        self.assertEqual(response.status_code, 401)

    def test_article_get(self):
        # Invalid Method (not GET)
        response = self.client.options('/api/article/')
        self.assertEqual(response.status_code, 405)

        # User Not Authenticated
        response = self.client.get('/api/article/')
        self.assertEqual(response.status_code, 401)

        response = self.client.post('/api/article/', json.dumps({'title': 'test_title', 'content': 'test_content'}),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 401)

        # Sign In First
        self.client.post('/api/signin/', json.dumps({'username': 'chris', 'password': 'chris'}),
                         content_type='application/json')
        auth_user = auth.get_user(self.client)
        assert auth_user.is_authenticated

        # JSON Error
        response = self.client.post('/api/article/', json.dumps({'content': 'test_content'}),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 400)

        # Success - Article Post
        response = self.client.post('/api/article/', json.dumps({'title': 'test_title', 'content': 'test_content'}),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 201)

        new_article = response.json()
        self.assertEqual(new_article, {'id': 6, 'title': 'test_title', 'content': 'test_content',
                                       'author': auth.get_user(self.client).id})

        # Success - Article Get
        response = self.client.get('/api/article/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), len(Article.objects.all()))
        self.assertEqual(response.json()[5], new_article)

    def test_article_detail(self):
        # Invalid Method (not GET)
        response = self.client.options('/api/article/1/')
        self.assertEqual(response.status_code, 405)

        # User Not Authenticated
        response = self.client.get('/api/article/1/')
        self.assertEqual(response.status_code, 401)

        response = self.client.put('/api/article/1/', json.dumps({'title': 'new_title', 'content': 'new_content'}),
                                   content_type='application/json')
        self.assertEqual(response.status_code, 401)

        response = self.client.delete('/api/article/1/')
        self.assertEqual(response.status_code, 401)

        # Sign In First
        self.client.post('/api/signin/', json.dumps({'username': 'chris', 'password': 'chris'}),
                         content_type='application/json')
        auth_user = auth.get_user(self.client)
        assert auth_user.is_authenticated

        # Resource Does Not Exist
        response = self.client.get('/api/article/1000/')
        self.assertEqual(response.status_code, 404)

        # Success - Article Detail Get
        article = auth_user.articles.all()[0]
        url_param = f'/api/article/{article.id}/'

        response = self.client.get(url_param)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), article_to_json(article))

        # JSON Error
        response = self.client.put('/api/article/1/', json.dumps({'content': 'new_content'}),
                                   content_type='application/json')
        self.assertEqual(response.status_code, 400)

        # Success - Article Put
        response = self.client.put(url_param, json.dumps({'title': 'new_title', 'content': 'new_content'}),
                                   content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(auth_user.articles.all()[0].title, 'new_title')
        self.assertEqual(auth_user.articles.all()[0].content, 'new_content')

        # Success - Article Delete
        response = self.client.delete(url_param)
        self.assertEqual(response.status_code, 200)
        assert not Comment.objects.filter(article=article)

        # User Not Authorized
        article = User.objects.get(username="bob").articles.all()[0]
        url_param = f'/api/article/{article.id}/'

        response = self.client.put(url_param, json.dumps({'title': 'new_title', 'content': 'new_content'}),
                                   content_type='application/json')
        self.assertEqual(response.status_code, 403)

        response = self.client.delete(url_param)
        self.assertEqual(response.status_code, 403)

    def test_comment_get(self):
        comment_article = Article.objects.get(id=1)

        # Invalid Method (not GET)
        response = self.client.options('/api/article/1/comment/')
        self.assertEqual(response.status_code, 405)

        # User Not Authenticated
        response = self.client.get('/api/article/1/comment/')
        self.assertEqual(response.status_code, 401)

        response = self.client.post('/api/article/1/comment/', json.dumps({'content': 'test_content'}),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 401)

        # Sign In First
        self.client.post('/api/signin/', json.dumps({'username': 'chris', 'password': 'chris'}),
                         content_type='application/json')
        auth_user = auth.get_user(self.client)
        assert auth_user.is_authenticated

        # JSON Error
        response = self.client.post('/api/article/1/comment/', json.dumps({'commment': 'test_content'}),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 400)

        # Success - Comment Post
        response = self.client.post('/api/article/1/comment/', json.dumps({'content': 'test_content'}),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 201)

        new_comment = response.json()
        self.assertEqual(new_comment, {'id': 11, 'article': 1, 'content': 'test_content',
                                       'author': auth.get_user(self.client).id})

        # Success - Comment Get
        response = self.client.get('/api/article/1/comment/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), len(comment_article.comments.all()))
        self.assertEqual(response.json()[len(comment_article.comments.all())-1], new_comment)

    def test_comment_detail(self):
        comment_article = Article.objects.get(id=1)
        # Invalid Method (not GET)
        response = self.client.options('/api/comment/1/')
        self.assertEqual(response.status_code, 405)

        # User Not Authenticated
        response = self.client.get('/api/comment/1/')
        self.assertEqual(response.status_code, 401)

        response = self.client.put('/api/comment/1/', json.dumps({'content': 'new_content'}),
                                   content_type='application/json')
        self.assertEqual(response.status_code, 401)

        response = self.client.delete('/api/comment/1/')
        self.assertEqual(response.status_code, 401)

        # Sign In First
        self.client.post('/api/signin/', json.dumps({'username': 'chris', 'password': 'chris'}),
                         content_type='application/json')
        auth_user = auth.get_user(self.client)
        assert auth_user.is_authenticated

        # Resource Does Not Exist
        response = self.client.get('/api/comment/1000/')
        self.assertEqual(response.status_code, 404)

        # Success - Comment Detail Get
        comment = comment_article.comments.all()[0]
        url_param = f'/api/comment/{comment.id}/'

        response = self.client.get(url_param)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), comment_to_json(comment))

        # JSON Error
        response = self.client.put(url_param, json.dumps({'comment': 'new_content'}),
                                   content_type='application/json')
        self.assertEqual(response.status_code, 400)

        # Success - Comment Put
        response = self.client.put(url_param, json.dumps({'content': 'new_content'}),
                                   content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(comment_article.comments.all()[0].content, 'new_content')

        # Success - Comment Delete
        response = self.client.delete(url_param)
        self.assertEqual(response.status_code, 200)

        # User Not Authorized
        comment = User.objects.get(username="bob").comments.all()[0]
        url_param = f'/api/comment/{comment.id}/'

        response = self.client.put(url_param, json.dumps({'content': 'new_content'}),
                                   content_type='application/json')
        self.assertEqual(response.status_code, 403)

        response = self.client.delete(url_param)
        self.assertEqual(response.status_code, 403)
