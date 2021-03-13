from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .connection import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    networks = relationship("Network", back_populates="owner")
    images = relationship("Image", back_populates="owner")


class Network(Base):
    __tablename__ = "networks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    known_classes = Column(String)
    public_access = Column(Boolean)
    url = Column(String, nullable=True)
    task = Column(String, nullable=False)
    config_url = Column(String, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    owner = relationship("User", back_populates="networks")


class Image(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    url = Column(String, unique=True, index=True)
    content_type = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    owner = relationship("User", back_populates="images")
    annotation = relationship(
        "Annotation", back_populates="image", uselist=False)


class Annotation(Base):
    __tablename__ = "annotations"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    url = Column(String)
    content_type = Column(String)
    image_id = Column(Integer, ForeignKey("images.id"))

    image = relationship("Image", back_populates="annotation")
