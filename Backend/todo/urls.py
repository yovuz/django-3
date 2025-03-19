from django.urls import path
from . import views
urlpatterns = [
    path('titles/',views.title_list, name='title_list'),
    path('titles/create/',views.title_create, name='title_create'),
    path('titles/<int:id>/delete/',views.title_delete, name='title_delete'),
    path('titles/<int:id>/tasks/',views.task_list, name='task_list'),
    path('titles/<int:id>/tasks/create/',views.task_create,name='task_create'),
    path('tasks/<int:id>/delete/',views.task_delete,name='task_delete'),
    path('tasks/<int:id>/update',views.task_update,name='task_update'),
    path('titles/<int:id>/update',views.title_update,name='title_update'),
]
