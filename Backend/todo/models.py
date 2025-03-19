from django.db import models

class Title(models.Model):
    name = models.CharField(max_length=255)
    
class Task(models.Model):
    title=models.ForeignKey(Title,related_name='tasks', on_delete=models.CASCADE)
    name=models.CharField(max_length=255)
    description=models.TextField()