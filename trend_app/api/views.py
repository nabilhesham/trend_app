from rest_framework.viewsets import ModelViewSet
from .serializers import TrendNameSerializer, TrendSerializer
from trend_app.models import Trend, TrendName
from django.shortcuts import get_object_or_404

from rest_framework.decorators import action


class TrendNameViewSet(ModelViewSet):
    serializer_class = TrendNameSerializer
    queryset = TrendName.objects.all()


class TrendViewSet(ModelViewSet):
    queryset = Trend.objects.all()
    serializer_class = TrendSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        # get the search params from url
        get_name = self.request.query_params.get('name', None)
        get_type = self.request.query_params.get('type', None)

        # search in the db by name and type
        if get_name and get_type:
            get_name = str(get_name).lower()
            get_type = str(get_type).lower()
            trend_name = get_object_or_404(
                TrendName, name=get_name, search_type=get_type)
            return qs.filter(name=trend_name)

        # search in the db by name
        if get_name and not get_type:
            get_name = str(get_name).lower()
            trend_name = get_object_or_404(TrendName, name=get_name)
            return qs.filter(name=trend_name)

        return qs
