from rest_framework import serializers
from .models import Title,Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model=Task
        fields=['id','name','description']

class TitleSerializer(serializers.ModelSerializer):
    tasks=TaskSerializer(many=True,read_only=True)
    class Meta:
        model=Title
        fields=['id','name','tasks']