# course-management
 Course Management System API is an online management application. Its main purpose is to make efficient interaction between students and instructors in college during the period of submission of assignments and for getting appropriate feedback from instructors.

# Functional requirements
- [x] Should be functionality for registration in the system;
- [x] Should be functionality for authentication and authorization in the system;
- [x] There are three roles: admin, instructor, student;
- [x] Admin user should be predefined;
- [x] Admin should be able to manage all information in the system;
- [x] Admin should be able to assign a role for a new user;
- [x] Admin should be able to assign instructor for the course;
- [x] Student can take up to 5 courses at the same time;  (NOTE: I’ll check it on the group level)
- [x] Each course should have at least one instructor;
- [x] Each course contains at least 5 lessons;
- [x] The student should be able to upload a text file with homework;
- [x] The instructor should be able to put a mark for a student for each lesson;
- [x] The final mark for course is average by lessons;
- [x] The instructor should be able to give student final feedback for the course;
- [x] The instructor should be able to see list of his courses;
- [x] The instructor should be able to see list of students per course;
- [x] The student should be able to see his courses;
- [x] The student should be able to see list of lessons per course with all related information;
- [x] To pass the course student should get a minimum of 80% for final grade;

# Technical requirements
- [x] JS/TS;
- [x] Express/NestJS;
- [x] Relational DB (PostgreSQL/MySQL);
- [x] ORM;
- [x] Database migration tool;
- [ ] Unit tests for controllers/services/DAO layers;
- [ ] e2e tests;
- [x] Totaly follow REST API specification;
- [x] Token based authentication(JWT is preferable);
- [x] API should be running inside Docker container;
- [x] Build CI/CD pipeline with Jenkins(preferable) - AWS CodePipeline;
- [x] Deploy your API to any cloud provider (AWS/GCP/Azure) - AWS Elastic Beanstalk/EC2;

