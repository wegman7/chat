from rest_framework import viewsets

from .serializers import ContactSerializer, ChatSerializer
from chat.models import Contact, Chat

class ContactViewSet(viewsets.ModelViewSet):

    serializer_class = ContactSerializer
    queryset = Contact.objects.all()

    # def get_queryset(self):
    #     queryset = Contact.objects.filter(user=self.request.user)
    #     return queryset

class ChatViewSet(viewsets.ModelViewSet):

    serializer_class = ChatSerializer
    queryset = Chat.objects.all()