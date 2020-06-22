from rest_framework.routers import DefaultRouter
from .views import TrendNameViewSet, TrendViewSet

router = DefaultRouter()
router.register(r'trends', TrendViewSet, basename="trends")
router.register(r'trendnames', TrendNameViewSet, basename="trendnames")

urlpatterns = router.urls
