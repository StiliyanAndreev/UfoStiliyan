Fighting UFOs Part 2
Fighting UFOs Part 2 is a single-page web application developed using Angular. It features an interactive UFO battle game, user authentication, and score management, all integrated into a responsive and visually appealing interface. The backend functionality is implemented using Node.js and Express, with a dedicated optionsserver.js running on port 3500.

Features
User Authentication
Register with username, email, and password.
Login to access the game and manage scores.
Logout to securely end the session.
Gameplay
Play a UFO battle game with customizable settings (number of UFOs and time).
Earn points by hitting UFOs; missed shots deduct points.
View game rules and adjust preferences before starting.
Score Management
Save your scores and view them in the records section.
Compare scores globally and on your profile.
Preferences
Customize game settings locally or remotely.
Save preferences to the server or retrieve them for consistent gameplay.
Getting Started
Install Dependencies
Navigate to the Angular project directory and run:
bash
Copy code
npm install
Navigate to the backend directory (containing optionsserver.js) and run:
bash
Copy code
npm install
Start the Development Servers
Backend Server (Node.js)

Navigate to the directory containing optionsserver.js.
Run:
bash
Copy code
node optionsserver.js
The server will start on http://localhost:3500.
Frontend Server (Angular)

Navigate to the Angular project directory.
Run:
bash
Copy code
ng serve
Open http://localhost:4200 to view the application.
Build the Application
Run:
bash
Copy code
ng build
The build artifacts will be stored in the dist/ directory.
Run Tests
Unit Tests: Run:
bash
Copy code
ng test
Tests will execute via Karma.
End-to-End Tests: Run:
bash
Copy code
ng e2e
Ensure a compatible testing package is set up before running.
Backend Overview
The optionsserver.js backend is a Node.js and Express server that:

Manages game preferences by saving and retrieving them from a MySQL database.
Runs on http://localhost:3500.
Endpoints
Save Preferences: POST /preferences
Body: { username, ufos, time }
Retrieve Preferences: GET /preferences/:username
Database Configuration
The server connects to a remote MySQL database using the following credentials:

Host: wd.etsisi.upm.es
Port: 3306
Database: marsbd
Table: prefView
Fields: user (varchar), ufos (int), time (int)
User: class
Password: Class24_25
Tools Used
Angular CLI: Version 17.3.11
TypeScript: For writing modular and maintainable code.
Node.js and Express: For backend server and API functionality.
MySQL: For storing game preferences.
HTML/CSS: For creating a responsive and engaging user interface.
Future Improvements
Enhance security by implementing HTTPS.
Add support for more customizable game settings.
Optimize backend for scalability.