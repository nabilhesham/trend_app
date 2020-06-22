from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from .models import TrendName, Trend

from .utils import get_data, save_to_database, get_from_api


def home(request):
    not_found = False
    # when submit the search form
    if request.GET:
        #  get the search type if region=>interest_by_region or historical=>get_historical_interest
        choice = request.GET.get('trend_type')
        # get the search keyword
        keyword = request.GET['keyword'].lower()

        # interest_by_region search
        if choice == "interest_by_region":

            # check for keywords number to meet requirements ( 2 keywords)
            # remove space if written
            keywords = [i.lstrip(' ') for i in keyword.split(
                ',') if i.startswith(' ') or i]
            if len(keywords) > 2 or len(keywords) < 2:
                print("error")
            elif keyword == "":
                print("error")
            else:
                counter = 0
                for i in keywords:

                    # check if the trends is already in the database or not by searching by the search_type and keywords
                    is_exist_type = TrendName.objects.filter(
                        search_type=choice)
                    is_exist_name = is_exist_type.filter(name=i)

                    # if the search didn't exist .. create a new object for the results and save it in the database
                    if not is_exist_name:
                        print("not exist")
                        # get the result from api
                        data = get_data(i, choice)
                        # save to database
                        save_to_database(i, data, choice)

                return redirect(reverse("search_results", kwargs={"trend_name1": keywords[0], "trend_name2": keywords[1], "search_type": choice}))

        # get_historical_interest search
        elif choice == "get_historical_interest":
            # check for the requirments of the search ( 1 keyword only )
            keywords = keyword.split(',')
            if len(keywords) > 1:
                print("error")
            elif keyword == "":
                print("error")
            else:
                counter = 0
                for i in keywords:

                    # check if the trends is already in the database or not by searching by the search_type and keywords
                    is_exist_type = TrendName.objects.filter(
                        search_type=choice)
                    is_exist_name = is_exist_type.filter(name=i)

                    # create a new result in the database
                    if not is_exist_name:
                        # get the result from api
                        data = get_data(i, choice)
                        # save to database
                        save_to_database(i, data, choice)

                return redirect(reverse("search_results", kwargs={"trend_name1": keywords[0], "trend_name2": "none", "search_type": choice}))
    return render(request, "home.html")


def search_results(request, trend_name1, search_type, trend_name2):
    # render the to the results page
    context = {}
    trend2 = ""

    # get from api
    if search_type == "get_historical_interest":
        if trend_name2 == "none":
            data = get_from_api(trend_name1, search_type)
            context['trend_1_json_data'] = data

    # get from database objects
    new_trend_name1 = get_object_or_404(
        TrendName, name=trend_name1, search_type=search_type)
    trend1 = Trend.objects.filter(name=new_trend_name1)
    context['trendData1'] = trend1
    if trend_name2 == "none":
        pass
    else:
        new_trend_name2 = get_object_or_404(
            TrendName, name=trend_name2, search_type=search_type)
        trend2 = Trend.objects.filter(name=new_trend_name2)
        context['trendData2'] = trend2

        # get from api
        if search_type == "intereset_by_region":
            trends_names = [trend_name1, trend_name2]
            data = get_from_api(trends_names, search_type)
            context['trend_1_json_data'] = data[0]
            context['trend_2_json_data'] = data[1]

    return render(request, "search_results.html", context)
