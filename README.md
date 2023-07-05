# URL Shortener Microservice

This is the third project of the "Back End Development and APIs" certification by Free Code Camp. The goal of this project is to build a full stack JavaScript app that is functionally similar to [this example](https://url-shortener-microservice.freecodecamp.rocks/).

## Description

The URL Shortener Microservice project aims to create an application that allows users to shorten URLs. It fulfills the following requirements:

- You can `POST` a URL to `/api/shorturl` and get a JSON response with `original_url` and `short_url` properties. For example: `{ original_url: 'https://freeCodeCamp.org', short_url: 1 }`.
- When you visit `/api/shorturl/<short_url>`, you will be redirected to the original URL.
- If you pass an invalid URL that doesn't follow the valid `http://www.example.com` format, the JSON response will contain `{ error: 'invalid url' }`.

## Accessing the Service

You can access and test the URL Shortener Microservice by clicking on the following link: [URL Shortener Microservice](https://url-shortener-microservice-6swq.onrender.com/)

## Technologies Used

This project utilizes the following technologies:

- Node.js
- Express.js
- MongoDB 

Feel free to explore and modify the code to further enhance the functionality of the URL Shortener Microservice. Happy coding!
