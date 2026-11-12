from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("rad.urls")),
]

# Em desenvolvimento, o Django serve as fotos enviadas pelo painel.
# No PythonAnywhere, configure /media/ na aba "Web" (veja o README).
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
