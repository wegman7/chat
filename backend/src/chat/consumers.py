import json
import asyncio
from asgiref.sync import async_to_sync
from django.contrib.auth.models import User
from channels.generic.websocket import WebsocketConsumer

from .models import Contact, Message, Chat


class ChatConsumer(WebsocketConsumer):
    # groups = ["broadcast"]

    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        async_to_sync(self.channel_layer.group_add)(self.room_name, self.channel_name)
        print('connected')
        self.accept()

    def receive(self, text_data=None, bytes_data=None):
        # convert json data to dict
        data = json.loads(text_data)
        
        self.commands[data['command']](self, data)

        # self.close()

    def createMessage(self, username):
        pass

    def retreiveMessages(self, data):
        chat_id = data['chat_id']
        chat = Chat.objects.get(id=chat_id)
        messages = chat.messages.all()
        data = []
        for message in messages:
            data.append({
                'id': message.id,
                'author': message.contact.user.username,
                'content': message.content,
                'timestamp': str(message.timestamp)
            })
        data = {
            'type': 'old_messages',
            'messages': data
        }
        self.sendMessage(data)
    
    def messageToDict(self, message):
        return {
            'id': message.id,
            'author': message.contact.user.username,
            'content': message.content,
            'timestamp': str(message.timestamp)
        }
    
    def createMessage(self, data):
        user = User.objects.get(username=data['author'])
        contact = Contact.objects.get(user=user)
        chat = Chat.objects.get(id=self.room_name)
        new_message = Message.objects.create(
            contact = contact,
            content = data['content']
        )
        chat.messages.add(new_message)
        new_message_json = json.dumps(self.messageToDict(new_message))
        content = {
            'type': 'new_message',
            'message': new_message_json
        }
        async_to_sync(self.channel_layer.group_send)(
            self.room_name,
            {
                "type": "sendMessageToGroup",
                "text": json.dumps(content)
            }
        )
    
    def sendMessageToGroup(self, event):
        self.send(text_data=event["text"])
    
    def sendMessage(self, data):
        data_to_send = json.dumps(data)
        self.send(text_data=data_to_send)
    
    commands = {
        'fetch_messages': retreiveMessages,
        'new_message': createMessage
    }

    def disconnect(self, close_code):
        # Called when the socket closes
        async_to_sync(self.channel_layer.group_discard)(self.room_name, self.channel_name)
        pass