from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .forms import CustomUserChangeForm, CustomUserCreationForm
from .models import (
    CareerRecommendation,
    Option,
    PersonalizedTest,
    Question,
    RoadmapStep,
    StudentAnswer,
    TestRequest,
    User,
)


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = User
    list_display = ('email', 'role', 'is_active', 'is_staff')
    list_filter = ('role', 'is_staff', 'is_active')
    ordering = ('email',)
    search_fields = ('email', 'first_name', 'last_name')

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'qualification', 'interests')}),
        (
            'Permissions',
            {
                'fields': (
                    'role',
                    'is_active',
                    'is_staff',
                    'is_superuser',
                    'groups',
                    'user_permissions',
                )
            },
        ),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )


@admin.register(TestRequest)
class TestRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('student__email',)


class OptionInline(admin.TabularInline):
    model = Option
    extra = 0


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('prompt', 'personalized_test', 'order')
    list_filter = ('personalized_test',)
    inlines = [OptionInline]


@admin.register(PersonalizedTest)
class PersonalizedTestAdmin(admin.ModelAdmin):
    list_display = ('id', 'request', 'admin', 'status', 'assigned_at')
    list_filter = ('status',)
    search_fields = ('request__student__email',)


@admin.register(CareerRecommendation)
class CareerRecommendationAdmin(admin.ModelAdmin):
    list_display = ('id', 'personalized_test', 'career_name', 'created_at')


@admin.register(RoadmapStep)
class RoadmapStepAdmin(admin.ModelAdmin):
    list_display = ('title', 'recommendation', 'order')
    ordering = ('recommendation', 'order')


@admin.register(StudentAnswer)
class StudentAnswerAdmin(admin.ModelAdmin):
    list_display = ('student', 'question', 'option', 'submitted_at')
    search_fields = ('student__email',)

    add_fieldsets = (
        (
            None,
            {
                'classes': ('wide',),
                'fields': ('email', 'role', 'password1', 'password2', 'is_staff', 'is_superuser', 'is_active'),
            },
        ),
    )
