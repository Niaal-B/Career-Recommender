from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.db import models


class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', User.Roles.ADMIN)
        if extra_fields.get('is_staff') is not True or extra_fields.get('is_superuser') is not True:
            raise ValueError("Superuser must have is_staff=True and is_superuser=True.")
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    class Roles(models.TextChoices):
        STUDENT = 'student', 'Student'
        ADMIN = 'admin', 'Admin'

    username = None
    email = models.EmailField(unique=True)
    role = models.CharField(
        max_length=20,
        choices=Roles.choices,
        default=Roles.STUDENT,
    )
    qualification = models.CharField(max_length=255, blank=True)
    interests = models.TextField(blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.email} ({self.role})"

    objects = UserManager()


class TestRequest(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        IN_PROGRESS = 'in_progress', 'In progress'
        ASSIGNED = 'assigned', 'Assigned'
        COMPLETED = 'completed', 'Completed'

    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='test_requests')
    interests_snapshot = models.TextField(blank=True)
    qualification_snapshot = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Request {self.id} by {self.student.email}"


class PersonalizedTest(models.Model):
    class Status(models.TextChoices):
        DRAFT = 'draft', 'Draft'
        ASSIGNED = 'assigned', 'Assigned'
        COMPLETED = 'completed', 'Completed'

    request = models.OneToOneField(TestRequest, on_delete=models.CASCADE, related_name='personalized_test')
    admin = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_tests')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    assigned_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Personalized test for {self.request.student.email}"


class Question(models.Model):
    personalized_test = models.ForeignKey(PersonalizedTest, on_delete=models.CASCADE, related_name='questions')
    prompt = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Question {self.order} for test {self.personalized_test_id}"


class Option(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='options')
    label = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Option {self.order} for question {self.question_id}"


class StudentAnswer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    option = models.ForeignKey(Option, on_delete=models.CASCADE, related_name='answers')
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='answers')
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('question', 'student')

    def __str__(self):
        return f"Answer by {self.student.email} to question {self.question_id}"


class CareerRecommendation(models.Model):
    personalized_test = models.OneToOneField(PersonalizedTest, on_delete=models.CASCADE, related_name='recommendation')
    admin = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='recommendations')
    career_name = models.CharField(max_length=255)
    summary = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Recommendation for {self.personalized_test.request.student.email}"


class RoadmapStep(models.Model):
    recommendation = models.ForeignKey(CareerRecommendation, on_delete=models.CASCADE, related_name='steps')
    order = models.PositiveIntegerField()
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Step {self.order} for recommendation {self.recommendation_id}"
