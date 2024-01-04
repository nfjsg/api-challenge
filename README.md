# Social Network App

## Description
This is a social network application that allows users to share thoughts and reactions.

## Features
- User registration and authentication
- Posting and deleting thoughts
- Adding and removing friends
- Reacting to thoughts

## Technologies Used
- Node.js
- Express.js
- MongoDB
- Mongoose

## Getting Started
1. Clone the repository
2. Install dependencies: `npm install`
3. Start the server: `npm start`

## API Endpoints
- **GET /api/users**: Get all users
- **GET /api/users/:id**: Get a single user by ID
- **POST /api/users**: Create a new user
- **POST /api/users/:userId/friends/:friendId**: Add a friend to a user's friend list
- **PUT /api/users/:id**: Update a user by ID
- **DELETE /api/users/:id**: Remove a user by ID
- **DELETE /api/users/:userId/friends/:friendId**: Remove a friend from a user's friend list

- **GET /api/thoughts**: Get all thoughts
- **GET /api/thoughts/:id**: Get a single thought by ID
- **POST /api/thoughts**: Create a new thought
- **PUT /api/thoughts/:id**: Update a thought by ID
- **DELETE /api/thoughts/:id**: Remove a thought by ID
- **POST /api/thoughts/:thoughtId/reactions**: Add a reaction to a thought
- **DELETE /api/thoughts/:thoughtId/reactions/:reactionId**: Remove a reaction from a thought

## Contributing
Feel free to contribute to this project. Fork the repository and submit pull requests.

## License
This project is licensed under the [MIT License](LICENSE).

