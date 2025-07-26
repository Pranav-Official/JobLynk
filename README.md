# Readme
The following a guide on how to setup the project locally and later, design and implementaion details.
## Local Setup
### pre-requsites
1. The project is made with bun instead of traditional nodejs runtime. This is mainly because of the faster nature and all-in-one tooklit of bun and also a personal decision to use a newer tool.
2. The project uses workos authkit as auth provider so workos account and authkit setup is needed refer [link](https://workos.com/docs/authkit/vanilla/nodejs)
3. The project us AWS S3 bucket for document uploads, so an AWS IAM account with S3 bucket setup will also be needed.
4. The project uses Postgres as the database, so installation of postgress db is also needed

### Setup
1. Clone the git repo
2. Navigate to the joblynk-be folder. This is the Backend folder.
3. Create a .env file in the root. Populate the values as per the example provided in file eg ```env.example```
4. Run the following commands in the terminal to setup backend
   ```
   bun i // install the required packages
   bun dev // start the dev server
   ```
   project uses sequalize as database ORM, starting the dev server will automatically create tables if connection to postgres is successful
5. Now navidate the joblynk-fend folder in the base folder of the project
6. Create a .env file in the root. Populate the values as per the example provided in file eg ```env.example```
7. Run the following commands in the terminal to setup backend
   ```
   bun i // install the required packages
   bun dev // start the dev server
   ```
8. Start by opening the fronted at localhost:3000. Start by logging in, creating account and proceeding as a recruited to add jobs.

## Screenshots

### Homepage
<img width="860" height="540" alt="image" src="https://github.com/user-attachments/assets/a40b9730-db72-41ef-8f8b-30d4f4190aae" />

### Login
<img width="860" height="540" alt="image" src="https://github.com/user-attachments/assets/bfedf951-1f9a-4192-b5c0-f059782d8ddb" />

### Onboarding
<img width="860" height="540" alt="image" src="https://github.com/user-attachments/assets/4bb00317-1e4d-4d26-ac92-abbcf265665f" />

### Job Board
<img width="1902" height="1180" alt="image" src="https://github.com/user-attachments/assets/ce24a4bb-cdaf-4d5a-87f0-8ba146f84740" />

### Dashboard
<img width="1896" height="1187" alt="image" src="https://github.com/user-attachments/assets/b8cd0655-1e29-4b5e-8741-632aa6054201" />


## Project Implementation

### Database Design
<img width="1216" height="728" alt="Untitled" src="https://github.com/user-attachments/assets/18dfbbff-6997-4b9d-8e3a-363c63a22d6c" />

#### Considerations
1. I mainly went for a design that fits the core objectives of of user management - recuiter and seeker, jobs and application.

### Backend design
<img width="372" height="617" alt="image" src="https://github.com/user-attachments/assets/8f61fc4b-fca7-4870-a6e2-633780636230" />

The above is the overall backend struture.

#### Authentication
1. I went for integrating an Auth provider instead of implemeting auth from scratch. As I feel proper auth from scratch requires lot of development as handing of lots of edgecases.
2. I went with WorkOS AuthKit as it its newer but still well supported Auth provider. 
3. AuthKit is an enterprise grade auth provider with many enterprise level features such as easy 3rd party identity provider support. It has secure password storage and good session management as well.
4. This allowed me to easily integrate "Sign in with Google" which without an OAuth provider integration, I think requires you to have extensive configuration in Google Cloud platform.

##### Working of AuthKit
1. It primiarly work with authenticating session with a sealed encrypted session cookie.
2. This session cookie will be containing the acess token
3. When a user tries to create an account, We hit the login endpoint which redirects to a login page provided by workos. the user can login with email password or sign in with google. This creates an account in the workos project and starts a session for teh user
4. Up on login the page hits a session provider callback endpoint in our backend. this then provides a sealed cookie that is kept in the browser and send to back with every request.

#### Access control
1. There are routes and endpoints that require authentication or role such as 'seeker' or 'recruiter'
2. This is done with the help of middleware - Auth check middleware as well as Role check middleware

#### DB operations
1. Database operation are done using ORM in this case Sequalize.

### Frontend Design
<img width="351" height="904" alt="image" src="https://github.com/user-attachments/assets/bb7d989e-9734-4586-8d27-6442d18c07f0" />

The above is the frontend structure
#### Considerations
1. The FE utilizes Vite as the dev server and build tool
2. The project uses Tanstack-router for page based routing. This allows to easy routing based on url.
3. Certrain routes are also protected based on auth status.
4. The project uses Tanstack Query (formerly react-query) for api request management and caching.

## Learnings
Throughout this project i have learnt many things
1. WorkOS integration was a new thing for me. First time doing in this project. While its easier compared to tradition own database, hashed password storage with bcrypt and signing your own JWTs and managing sessions, It still required lots of configuration partially because its new to me.
2. WorkOS documentation was good, but still required some figuring out on my part, especially on the cookie session part.
3. Sequalize was the ORM i choose for db operations. Primarily because i was previosly familiar with it. But this was a mistake. Sequalize by itself was good, but only for Javascript. From what I learnt, using sequalize with Typescpit require additional configuratiosn that are not well documented.
4. This caused issues especially with migrations. The best move would be to use a well supported ORM for typescrpit such as Prisma. But as of now i sticked on with sequalize.
5. Even tho I have experience with react, it was mainly with NextJs. which has its own set of features like file based navigation etc. But this time i went with a plain react setup with vite and TanStack router on top.


