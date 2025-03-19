from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Title, Task
from .serializers import TitleSerializer,TaskSerializer

@api_view(['GET'])
def title_list(request):
    titles=Title.objects.all()
    serializer=TitleSerializer(titles,many=True)
    return Response(serializer.data)

@api_view(['Post'])
def title_create(request):
    serializer=TitleSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def title_delete(request,id):
    try:
        title=Title.objects.get(id=id)
    except Title.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    title.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def task_list(request,id):
    task=Task.objects.filter(title_id=id)
    serializer=TaskSerializer(task, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def task_create(request,id):
    try:
        title=Title.objects.get(id=id)
    except Title.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer=TaskSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(title=title)
        return Response(serializer.data,status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def task_delete(request,id):
    try:
        task=Task.objects.get(id=id)
    except Task.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    task.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['PUT'])
def task_update(request,id):
    try:
        task=Task.objects.get(id=id)
    except Task.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer=TaskSerializer(task,data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data,status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def title_update(request,id):
    try:
        title=Title.objects.get(id=id)
    except Title.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer=TaskSerializer(title,data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data,status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)