FROM ubuntu:latest
LABEL authors="smach"

ENTRYPOINT ["top", "-b"]
