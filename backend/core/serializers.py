from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import (
    CareerRecommendation,
    Option,
    PersonalizedTest,
    Question,
    RoadmapStep,
    StudentAnswer,
    TestRequest,
)

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'first_name',
            'last_name',
            'role',
            'qualification',
            'interests',
        )


class StudentRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'password',
            'first_name',
            'last_name',
            'qualification',
            'interests',
        )

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data, role=User.Roles.STUDENT)
        user.set_password(password)
        user.save()
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        return data


class TestRequestSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)

    class Meta:
        model = TestRequest
        fields = (
            'id',
            'student',
            'interests_snapshot',
            'qualification_snapshot',
            'status',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('status', 'created_at', 'updated_at')


class TestRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestRequest
        fields = ('interests_snapshot', 'qualification_snapshot')


class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ('id', 'label', 'description', 'order')


class OptionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ('label', 'description', 'order')


class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True)

    class Meta:
        model = Question
        fields = ('id', 'prompt', 'order', 'options')


class QuestionCreateSerializer(serializers.ModelSerializer):
    options = OptionCreateSerializer(many=True)

    class Meta:
        model = Question
        fields = ('prompt', 'order', 'options')

    def create(self, validated_data):
        options_data = validated_data.pop('options')
        question = Question.objects.create(**validated_data)
        for option_data in options_data:
            Option.objects.create(question=question, **option_data)
        return question


class PersonalizedTestSerializer(serializers.ModelSerializer):
    request = TestRequestSerializer()
    questions = QuestionSerializer(many=True)

    class Meta:
        model = PersonalizedTest
        fields = ('id', 'request', 'status', 'assigned_at', 'completed_at', 'questions')


class StudentAnswerSerializer(serializers.ModelSerializer):
    question = serializers.PrimaryKeyRelatedField(queryset=Question.objects.all())
    option = serializers.PrimaryKeyRelatedField(queryset=Option.objects.all())

    class Meta:
        model = StudentAnswer
        fields = ('question', 'option')

    def validate(self, attrs):
        if attrs['option'].question_id != attrs['question'].id:
            raise serializers.ValidationError("Option does not belong to question")
        return attrs

    def create(self, validated_data):
        student = self.context['request'].user
        answer, _ = StudentAnswer.objects.update_or_create(
            question=validated_data['question'],
            student=student,
            defaults={'option': validated_data['option']},
        )
        return answer


class RoadmapStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoadmapStep
        fields = ('id', 'order', 'title', 'description')


class RoadmapStepCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoadmapStep
        fields = ('order', 'title', 'description')


class CareerRecommendationSerializer(serializers.ModelSerializer):
    steps = RoadmapStepSerializer(many=True)

    class Meta:
        model = CareerRecommendation
        fields = ('id', 'career_name', 'summary', 'created_at', 'steps')


class CareerRecommendationCreateSerializer(serializers.ModelSerializer):
    steps = RoadmapStepCreateSerializer(many=True)

    class Meta:
        model = CareerRecommendation
        fields = ('career_name', 'summary', 'steps')

    def create(self, validated_data):
        steps_data = validated_data.pop('steps')
        recommendation = CareerRecommendation.objects.create(**validated_data)
        for step_data in steps_data:
            RoadmapStep.objects.create(recommendation=recommendation, **step_data)
        return recommendation

