from django.contrib import admin
from .models import Student


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ("student_name", "program", "year_level", "email")
    search_fields = ("student_name", "email")
    list_filter = ("program", "year_level")