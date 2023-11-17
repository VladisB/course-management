# Course-management
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
- [x] Unit tests for controllers/services/DAO layers; NOTE: Exist but not full coverage
- [x] e2e tests; NOTE: Exist but not full coverage
- [x] Unit tests for controllers/services/DAO layers; NOTE: Exist but not full coverage
- [x] e2e tests; NOTE: Exist but not full coverage
- [x] Totaly follow REST API specification;
- [x] Token based authentication(JWT is preferable);
- [x] API should be running inside Docker container;
- [x] Build CI/CD pipeline with Jenkins(preferable) - AWS CodePipeline;
- [x] Deploy your API to any cloud provider (AWS/GCP/Azure) - AWS Elastic Beanstalk/EC2;

# Part I: Setting up local environment
This part describes main dependencies and tools required to be installed on your local machine to run this application. Contains a set of instructions and references to the documentation.

## Download & Install
### 1) Install NVM, Node.js and NPM.

NVM is a Node Version Manager for Node.js, it's used to install and manage multiple active Node.js versions. It is possible to install and use it on these particular platforms: unix, macOS and Windows.

The first step is simplest: just install NVM with the `curl` or `wget` command provided in the [documentation](https://github.com/nvm-sh/nvm). Please follow the detailed instructions and verify the installation to avoid issues further.

When NVM is installed, you can run the following command to output current nvm version.
```
nvm -v
```

To list the available remote versions of Node.js, run this command.
```
nvm ls-remote
```

Or this, if you are running on Windows 10.
```
nvm list available
```

Install a specific version of Node.js.
**Note**: `Current node version of the project is 18.17.1 (LTS)`
```
nvm install 18.17.1
```

Set the Node.js version you just downloaded.
```
nvm use 18.17.1
```

List node versions available on your local machine and validate the default you are currently using.
```
nvm ls
```

Type the command `node -v` to check your version of Node.js and `npm -v` to output Node Package Manager version installed.

### 2) Set up Docker on macOS

Of course you can run the application without Docker, but it's highly recommended to use it for development and production environments with the same configuration.
Currently Docker setup is based on `node:18.17.1` image.

1. **Download Docker Desktop for Mac**: Visit the Docker Hub website and download the Docker Desktop for Mac installer. You'll need to create a Docker Hub account if you don't have one. You can download the installer from [here](https://hub.docker.com/editions/community/docker-ce-desktop-mac/).

2. **Install Docker Desktop**: Open the installer file you downloaded (it should be a `.dmg` file). Drag and drop the Docker app icon to the Applications folder.

3. **Start Docker Desktop**: Navigate to your Applications folder and click on Docker.app to start the application. The first time you open Docker Desktop, a window will open asking for your system password to install networking components and links to the Docker apps. Enter your password and click OK.

4. **Verify the installation**: You can verify that Docker Desktop started correctly by opening a terminal and running the command `docker version`. This will display information about the installed Docker version.

Remember, Docker Desktop for Mac requires that you're running macOS Sierra 10.12 or newer. Docker Desktop will use a significant amount of disk space and memory, as it runs a virtual machine in the background to host Docker.

### 3) Clone the repository, install node packages
Repository contains 2 main branches: `main` and `develop`. Others are development lifecycle branches which might be changed or removed at any time.

The `main` branch contains stable, production ready code.

The `develop` is main development branch, which contains latest features and the most recent updates of the api code base.

Run the following commands on your local machine to clone the repository and install dependencies:
```
git clone git@github.com:VladisB/course-management.git
cd course-management
git checkout develop
npm ci
```
## Configuration
### 1) Create .env file
The `.env` file is required to define and load the environment specific variables into `process.env`.

Create a `.env` file with name regarding to you environment(`.production.env` or `.development.env`) in the root directory of a project. Add environment-specific variables on new lines in the form of `NAME=VALUE`.

**Note**: Use `.env.example` template file to fill all required values in the `.env` config file.

The full list of environment variables used in version `1.0.0`:
* `APP_PORT`
* `APP_JWT`
* `APP_ACCESS_TOKEN_EXPIRES_IN`
* `APP_REFRESH_TOKEN_EXPIRES_IN`
* `APP_UPLOAD_RATE_LIMIT_TTL`
* `APP_UPLOAD_RATE_LIMIT`
* `APP_UPLOAD_FILE_SIZE_LIMIT_MB`
* `NODE_ENV`
* `DB_TYPE`
* `PG_DATABASE`
* `PG_HOST`
* `PG_PASSWORD`
* `PG_PORT`
* `PG_USER`
* `AWS_ACCESS_KEY_ID`
* `AWS_SECRET_ACCESS_KEY`
* `AWS_S3_REGION`
* `AWS_APP_BUCKET_NAME`
* `AWS_S3_URL_EXPIRES_IN_MIN`


## Start App

### 1) Run build command
Run build command to transpile TypeScript into JavaScript. The command should exit without errors.

```
npm run prebuild;
npm run build;
```

The output artifacts will be stored in a `/dist` folder. Make sure you have a `/dist` folder in the project root directory, it shouldn't be empty.

Build containers with docker-compose:
```
docker-compose build;
```

Run containers with docker-compose in detached mode:
```
docker-compose up -d;
```

Otherways, you can run `bash ./rebuild.sh` to run all commands at once.

By default app is running on port `3000`, base local address is: `http://localhost:3000`.

# Cloud infrastructure

<img src="./docs/img/cicd.png" alt="cicd" style="max-width:100%;">

# Future improvements
- [ ] Add swagger documentation

