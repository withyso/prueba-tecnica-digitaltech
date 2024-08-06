from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Enum as SQLEnum, DateTime
from datetime import datetime
from enum import Enum

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    password = db.Column(db.String(15), unique=False, nullable=False)
    username = db.Column(db.String(20), unique=True, nullable=False)
    name = db.Column(db.String(20), unique=False, nullable=False)
    surname = db.Column(db.String(20), unique=False, nullable=False)
    avatar = db.Column(db.String(500), unique=False, nullable=True)
    post = db.relationship("Post", back_populates="author")

    def __repr__(self):
        return f'Usuario con username {self.username}'

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "name" : self.name,
            "surname" : self.surname,
            # do not serialize the password, its a security breach
        }

#Esta clase es solo para poder tener mejor legibilidad y mantenimiento del estado de la columna Status
class PostStatus(Enum):
    DRAFTED = 'drafted'
    DELETED = 'deleted'
    PUBLISHED = 'published'

class Post(db.Model): 
    __tablename__ = 'post'
    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.String(30), unique=False, nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    author = db.relationship(User, back_populates="post")
    created_at = db.Column(DateTime, default=datetime.utcnow)
    location = db.Column(db.String(25), unique=False, nullable=True)
    status = db.Column(SQLEnum(PostStatus), nullable=False, default=PostStatus.DRAFTED)
    image = db.Column(db.String(500), unique=False, nullable=False)

    def __repr__(self):
        return f'Post con el mensaje {self.message}'

    def serialize(self):
        return {
            "id": self.id,
            "message": self.message,
            "author" : self.author.username,
            "location" : self.location,
            "image" : self.image
        }

class PostLikes(db.Model):
    __tablename__ = 'postlikes'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user_id_relationship = db.relationship(User)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)
    post_id_relationship = db.relationship(Post)

    def __repr__(self):
        return f'El usuario {self.user_id}'

    def serialize(self):
        return {
            "id": self.id,
            "user_id" : self.user_id,
            "post_id" : self.post_id,
        }
