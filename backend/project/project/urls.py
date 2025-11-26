from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView

urlpatterns = [
    path("admin/", admin.site.urls),               # Django admin
    path("api/", include("app.urls")),             # Backend API endpoints
]

# 👇 Catch-All Route: Sends all other paths to React index.html
urlpatterns += [
    re_path(r"^.*$", TemplateView.as_view(template_name="index.html")),
]
