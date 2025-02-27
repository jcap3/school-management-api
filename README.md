# School Management API

This is a School Management API built with Node.js, Express, and MongoDB. It provides endpoints for managing students, classrooms, schools, and users.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
  - [Students](#students)
  - [Classrooms](#classrooms)
  - [Schools](#schools)
  - [Users](#users)
- [DB Schema design](#db-schema-design)

## Installation

1. Clone the repository:

```sh
git clone https://github.com/jcap3/school-management-api
```
```sh
cd school-management-api
```



2. Install the dependencies
```sh 
npm install
```

3. Populate .env file in the root directory
```sh
MONGO_URI=mongodb://mongoadmin:secret@localhost:27017/school-management
USER_PORT=3000
SERVICE_NAME=school-management-api
CACHE_PREFIX=school_
CACHE_REDIS=redis://localhost:6379
CORTEX_PREFIX=cortex_
CORTEX_REDIS=redis://localhost:6379
CORTEX_TYPE=redis
LONG_TOKEN_SECRET=test_long_token_secret
SHORT_TOKEN_SECRET=test_short_token_secret
NACL_SECRET=test_nacl_secret
INIT_SUPERADMIN_USER=superadmin
INIT_SUPERADMIN_PW=superadmin
JWT_SECRET=test_jwt_secret
```

Please note of the following .env values: 
```sh
INIT_SUPERADMIN_USER
INIT_SUPERADMIN_PW
```
The specified value here will be the initial superadmin user that can be used to call APIs initially (e.g. create a user of schooladmin).

4. Start the MongoDB and Redis servers if they are not already running. 

## Usage

1. Start the server
```sh
npm start
```
The server will start on http://localhost:3000.

## API Endpoints

### User

1. Login
- `POST /api/user/login`
- Request Body: 
```sh
{
  "username": "admin",
  "password": "securepassword123"
}
```
This will return a token that should be used when accessing other APIs

2. Create User
- `POST /api/user/createUser`
- Request: 
```sh
Header: 'Authorization: Bearer <token from login>'
Body:
{
  "username": "schooladmin",
  "password": "securepassword123",
  "role": "schooladmin",
  "school": "67bf834426c9a5a983d5524b"
}
```
Note: `school` is mandatory if role is a `schooladmin`. Otherwise, not present.

### Student

> Note: A user with the `schooladmin` role will only be able to perform CRUD operations based on their assigned school. While superadmin role can perform any operation.

1. Create Student
- `POST /api/student/createStudent`
- Request:
```sh
Header: 'Authorization: Bearer <token from login>'
Body:
{
    "name": "Bart Simpson",
    "age": 10,
    "program": "Elementary",
    "school": "67bf834426c9a5a983d5524b"
}
```

2. Get Student
- `GET /api/student/getStudent`
- Request:
```sh
Header: 'Authorization: Bearer <token from login>'
Body:
{
    "id": "67c06330abfe9b209e13643e"
}
```
This will return the details of the student with the specified ID.

3. Get Students
- `GET /api/students/getStudents`
- Request:
```sh
Header: 'Authorization: Bearer <token from login>'
```
Returns all students for superadmin. Returns all students based on what school the school admin is based.

4. Update Student
- `PUT /api/student/updateStudent`
- Request:
```sh
Header: 'Authorization: Bearer <token from login>'
Body:
{
    "id": "67bf867a7447adbe496c604a",
    "name": "Bart Simpson",
    "age": 11,
    "program": "Middle School",
    "school": "67bf834426c9a5a983d5524b"
}
```
This will update the details of the student with the specified ID.

5. Delete Student
- `DELETE /api/student/deleteStudent`
- Request:
```sh
Header: 'Authorization: Bearer <token from login>'
Body:
{
    "id": "67bf867a7447adbe496c604a"
}
```
This will delete the student with the specified ID.

6. Enroll Student in Classroom
- `POST /api/student/enrollStudent`
- Request:
```sh
Header: 'Authorization: Bearer <token from login>'
Body:
{
    "studentId": "60d21b4667d0d8992e610c85",
    "classroomId": "60d21b4667d0d8992e610c86"
}
```
This will enroll the student in the specified classroom as long as there is capacity.

### Classrooms

> Note: A user with the `schooladmin` role will only be able to perform CRUD operations based on their assigned school. While superadmin role can perform any operation.

1. Create Classroom
- `POST /api/classroom/createClassroom`
- Request:
```sh
Header: 'Authorization: Bearer <token from login>'
Body:
{
    "name": "Music room",
    "capacity": 15,
    "school": "67bf834426c9a5a983d5524b"
}
```

2. Get Classroom
- `GET /api/classroom/getClassroom`
- Request:
```sh
Header: 'Authorization: Bearer <token from login>'
Body:
{
    "id": "67c06330abfe9b209e13643e"
}
```
This will return the details of the classroom with the specified ID.

3. Get Classrooms
- `GET /api/classrooms/getClassrooms`
- Request:
```sh
Header: 'Authorization: Bearer <token from login>'
```
Returns all classrooms for superadmin. Returns all classrooms based on what school the school admin is based.

4. Update Classroom
- `PUT /api/classroom/updateClassroom`
- Request:
```sh
Header: 'Authorization: Bearer <token from login>'
Body:
{
    "id": "67c06330abfe9b209e13643e",
    "capacity": "5"
}
```
This will update the details of the classroom with the specified ID.

5. Delete Classroom
- `DELETE /api/classroom/deleteClassroom`
- Request:
```sh
Header: 'Authorization: Bearer <token from login>'
Body:
{
    "id": "67c06330abfe9b209e13643e"
}
```
This will delete the classroom with the specified ID.

### Schools

> Note: Only a user with the `superadmin` role can perform operations on schools.

1. Create School
- `POST /api/school/createSchool`
- Request:
```sh
Header: 'Authorization: Bearer <token from login>'
Body:
{
    "name": "Springfield Elementary",
    "address": "742 Evergreen Terrace, Springfield, IL",
    "phone": "555-987-6543",
    "email": "info@springfieldelementary.edu",
    "website": "http://www.springfieldelementary.edu",
    "principal": "Seymour Skinner",
    "established": 1980,
    "createdAt": "2025-02-27T00:00:00.000Z",
    "updatedAt": "2025-02-27T00:00:00.000Z"
}
```

2. Get School
- `GET /api/school/getSchool`
- Request:
```sh
Header: 'Authorization: Bearer <token from login>'
Body:
{
    "id": "67c06330abfe9b209e13643e"
}
```
This will return the details of the school with the specified ID.

3. Get Schools
- `GET /api/schools/getSchools`
- Request:
```sh
Header: 'Authorization: Bearer <token from login>'
```
Returns all schools.

4. Update School
- `PUT /api/school/updateSchool`
- Request:
```sh
Header: 'Authorization: Bearer <token from login>'
Body:
{
    "id": "67c06330abfe9b209e13643e",
    "name": "Springfield Elementary Updated",
    "address": "742 Evergreen Terrace Updated"
}
```
This will update the details of the school with the specified ID.

5. Delete School
- `DELETE /api/school/deleteSchool`
- Request:
```sh
Header: 'Authorization: Bearer <token from login>'
Body:
{
    "id": "67c06330abfe9b209e13643e"
}
```
This will delete the school with the specified ID.

## DB Schema Design

### Student Schema

```javascript
const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    program: {
        type: String,
        required: true
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true
    },
    classroom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classroom'
    }
}, { timestamps: true });
```

### Classroom Schema

```javascript
const classroomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true
    }
}, { timestamps: true });
```

### School Schema

```javascript
const schoolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    email: {
        type: String
    },
    website: {
        type: String
    },
    principal: {
        type: String
    },
    established: {
        type: Number
    }
}, { timestamps: true });
```

### User Schema

```javascript
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['superadmin', 'schooladmin'],
        required: true
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School'
    }
}, { timestamps: true });
```

### Relationships

- **Student**: A student is associated with a school and optionally a classroom. The `school` field in the student schema references the `School` schema, and the `classroom` field references the `Classroom` schema.
- **Classroom**: A classroom is associated with a school. The `school` field in the classroom schema references the `School` schema.
- **School**: A school can have multiple students and classrooms associated with it.
- **User**: A user can have a role of either `superadmin` or `schooladmin`. If the role is `schooladmin`, the user is associated with a specific school through the `school` field, which references the `School` schema.


