from chat.api.views import ContactViewSet, ChatViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'contact', ContactViewSet, basename='contact')
router.register(r'chat', ChatViewSet, basename='chat')
urlpatterns = router.urls