### GrubGram

GrubGram is a full-stack web application designed to help users manage their meals, track nutrition, and share their food experiences. It combines social media features with meal planning and logging tools, making it a comprehensive platform for food enthusiasts and health-conscious individuals.

Features:

User Authentication
### Registration: Users can sign up with their full name, email, and password.
### Login: Secure login using JWT-based authentication.
### Profile Setup: Users can set up their profile with details like age, height, weight, activity level, dietary preferences, and allergies.

Meal Management
### Meal Logging: Log meals with detailed food items and nutritional information fetched from the Nutritionix API.
### Meal Planning: Generate personalized meal plans using the Edamam API based on meal type, calorie range, diet, and health preferences.

Social Features
### Feed: View posts shared by other users, including images, titles, and descriptions.
### Create Posts: Share food experiences by creating posts with optional image uploads.
### Comments: Add and manage comments on posts.

Analytics
### Macro and Calorie Tracking: (Planned feature) Analyze nutritional intake and track progress over time.
### Responsive Design
### Optimized for both desktop and mobile devices with a clean and user-friendly interface.

Tech Stack:

Frontend
### React: For building the user interface.
### React Router: For client-side routing.
### Axios: For making API requests.
### Socket.IO Client: For real-time updates in the feed.
### CSS: Custom styles for a polished look.

Backend
### Node.js: Server-side runtime.
### Express: Web framework for building RESTful APIs.
### MongoDB: Database for storing user data, posts, and meal logs.
### Mongoose: ODM for MongoDB.
### Socket.IO: For real-time communication.
### Multer: For handling image uploads.

APIs
### Nutritionix API: For analyzing nutritional information of food items.
### Edamam API: For generating meal plans.

Installation
Prerequisites
Node.js (v20.17.0 or later)
MongoDB (local or cloud instance)
Environment variables for API keys and database connection.
Steps
Clone the repository:

git clone https://github.com/your-username/GrubGram.git
cd GrubGram

Install dependencies:

npm install

Set up environment variables: Create a .env file in the config directory with the following:

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NUTRITIONIX_APP_ID=your_nutritionix_app_id
NUTRITIONIX_API_KEY=your_nutritionix_api_key
EDAMAM_APP_ID=your_edamam_app_id
EDAMAM_APP_KEY=your_edamam_app_key

Start the backend server:

npm run backend

Start the frontend:

npm start

Contributing
We welcome contributions! Please follow these steps:

Fork the repository.
Create a new branch for your feature or bug fix.
Commit your changes and push them to your fork.
Submit a pull request to the development branch.
License
This project is licensed under the MIT License.

Acknowledgments
Nutritionix API
Edamam API
Create React App
MUI for Material-UI components.