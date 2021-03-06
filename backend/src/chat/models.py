from django.contrib.auth.models import User
from django.db import models

class Contact(models.Model):
    user = models.ForeignKey(User, related_name='friends', on_delete=models.CASCADE)
    friends = models.ManyToManyField('self', blank=True)

    def username(self):
        return self.user.username

    def friends_usernames(self):
        friends = []
        for friend in self.friends.all():
            friends.append(friend.user.username)
        return friends
    
    def __str__(self):
        return self.user.username

class Message(models.Model):
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.contact.user.username

class Chat(models.Model):
    participants = models.ManyToManyField(Contact)
    messages = models.ManyToManyField(Message, blank=True)

    def participants_usernames(self):
        participants = []
        for participant in self.participants.all():
            participants.append(participant.user.username)
        return participants

    def last_10_messages(self):
        return self.messages.content.order_by('-timestamp').all()[:10]

    def __str__(self):
        return '{}'.format(self.pk)