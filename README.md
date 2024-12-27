Date Started: 12/24/2024 
Date Closed: 12/27/2024

Project Name: Employee Management System

Source: GitHub Repo and zip file 

Objective: A Scalable employee management system that have role-based management and real-time communication

Core Features: 
	1. User Authentication using JWT
	2. Role-based access control
	3. Bulk import and export in CSV/Excel
	4. Real-time notification using socket.io
	5. Caching mechanism using Redis 
	6. Activity logging
	7  Segregated services
	8. Docker compose file

Working:
	Admin: CRUD employee details, manage role, bulk import/export
	Manager: Manages employee details to respective department
	Employee: View their details

Middleware:
	1. Prevent unauthenticated users access
	2. Role based operation, managed by hierarchy 
	3. Check origin for validate origin access
	4. Validate user inputs 
	5. Multer for file upload

Installation:
	1. Take project from zip or clone from GitHub
	2. Setup environment
	3. npm i : to download dependencies
	4. Attach own configs and variable if find any difficulty
	5. Setup headers, query, body for testing APIs, like: postman
	6. Go through the attached/notion documentation for reference
	7. Use JWT token for auth routes
	
