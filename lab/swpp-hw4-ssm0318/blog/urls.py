from django.urls import path
from blog import views

urlpatterns = [
    path('signout/', views.signout, name='signout'),
    path('signin/', views.signin, name='signin'),
    path('signup/', views.signup, name='signup'),
    path('token/', views.token, name='token'),
    path('article/', views.article, name='article'),
    path('article/<int:article_id>/', views.article_detail, name='article_detail'),
    path('article/<int:article_id>/comment/', views.article_comment, name='article_comment'),
    path('comment/<int:comment_id>/', views.comment_detail, name='comment_detail'),
]

