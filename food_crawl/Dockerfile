# Start with a base image containing Python
FROM python:3.10-slim

# Set the working directory
WORKDIR /app
RUN apt-get update && apt-get install -y \
    wget \
    unzip \
    chromium \
    chromium-driver
# Copy the poetry lock file and install dependencies
COPY pyproject.toml .
COPY poetry.lock .
RUN pip install poetry && poetry install --no-dev

# Copy the rest of the application code
COPY . .

# Set the entry point for the container
ENV PATH="/usr/bin/chromium:${PATH}"
CMD ["poetry", "run","scrapy","crawl", "food_crawl"]
