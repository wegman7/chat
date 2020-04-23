from django.contrib.auth.models import User
from rest_framework import serializers

from chat.models import Contact, Chat, Message

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = (
            'id',
            'username'
        )

class ContactSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Contact
        # fields = ('__all__')
        fields = (
            'user',
            'friends',
            'friends_usernames'
        )
        # depth = 2

class MessageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Message
        fields = ('__all__')

class ChatSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True)

    class Meta:
        model = Chat
        fields = (
            'id',
            'participants',
            'messages',
            'participants_usernames'
        )
        # depth = 1