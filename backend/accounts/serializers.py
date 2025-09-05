from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    # Map camelCase fields to Django's snake_case model fields
    firstName = serializers.CharField(source="first_name")
    lastName = serializers.CharField(source="last_name")
    password = serializers.CharField(write_only=True, validators=[validate_password])
    confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "firstName", "lastName", "email", "password", "confirm"]

    def validate(self, data):
        if data["password"] != data["confirm"]:
            raise serializers.ValidationError({"confirm": "Passwords do not match"})
        return data

    def create(self, validated_data):
        validated_data.pop("confirm")  # remove confirm before creating user
        return User.objects.create_user(**validated_data)

class UserSerializer(serializers.ModelSerializer):
    # Map camelCase fields to Django's snake_case model fields
    firstName = serializers.CharField(source="first_name")
    lastName = serializers.CharField(source="last_name")

    class Meta:
        model = User
        fields = ["id", "username", "firstName", "lastName", "email"]
