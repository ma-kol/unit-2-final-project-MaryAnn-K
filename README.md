<div align=center>
  <h1>Boxing Mindset: Full-Stack Web Application</h1>
</div>

<img width="1246" height="1167" alt="Image" src="https://github.com/user-attachments/assets/b2f3cf16-fed6-4087-b701-351371ad8ef1" />

<!--Elevator Pitch-->
## 💡 About the Project
Boxing Mindset is a full-stack web application designed to serve as a "one-stop" solution for amateur boxers to manage and enhance their training. The app includes the following features:
- Weight Management: Log weigh-ins, monitor trends, and match boxing weight classes
- Interval Timer (in development): Structured rounds with rest alerts
- Class Attendance (in development): Track gym participation and consistency

Built with a **React** frontend, **Spring Boot** backend, and **MySQL** database, the app provides a solid foundation for future features like user authentication, AI-driven training recommendations, and analytics.

🥊 Boxing Mindset is a "one-stop" platform to help boxers stay on top of their training and progress.

<!--Technologies Used-->
## 🛠️ Tech Stack
- Frontend
  - React
  - React Router
  - Vite
  - HTML
  - CSS
  - JavaScript
 
- Backend
  - Spring Boot
  - Maven
  - Java
  - SQL
  - MYSQL Database
 
<!--Installation Steps-->
## 🚀 Prerequisites & Installation
> [!NOTE]
> To run this project locally, you will need the following installed:
> - Node.js (LTS version)
> - npm
> - Java Development Kit (JDK) 21
> - Maven
> - MySQL Server (version 8.0+)

### Back End Setup (Java/Spring Boot/MySQL)

1️⃣ **Clone the repository:** In the terminal, navigate to the directory where you want the project to live, then execute the following commands:
    ```shell
    git clone https://github.com/ma-kol/unit-2-final-project-MaryAnn-K.git # or your link, if forked
    cd unit-2-final-project-MaryAnn-K/boxing-mindset-backend
    ```

2️⃣ **Configure secrets for database:** Create a new MySQL database named `weigh_in` and another one named `users`, then create an `.env` file at the project root directory (`boxing-mindset-backend`):

    ```properties
    # Location of your local database server
    DB_HOST=localhost
    DB_PORT=3306
    
    # Database name
    DB_NAME=boxing-mindset
    
    # Credentials
    DB_USER=root
    DB_PASS=[your_password]
    ```

3️⃣ **Create the database** Open MySQL and run:

```sql
CREATE DATABASE weigh_in;
CREATE DATABASE users;
```

4️⃣ **Create Users**

Before logging weigh-ins, you’ll need at least one user in the database. Run the following commands in MySQL:

```sql
-- Create a regular user
INSERT INTO users (email, display_name, role, created_at)
VALUES ('jane.doe@example.com', 'Jane Doe', 'user', NOW());

-- Create an admin/coach user
INSERT INTO user_account (email, display_name, role, created_at)
VALUES ('coach.mary@example.com', 'Coach Mary', 'coach', NOW());
```

🟢 After running these commands, the frontend will be able to select users and log weigh-ins.

5️⃣ **Run the Java/Spring Boot application:** If you do not have the application loaded in an IDE such as IntelliJ, go to the terminal and navigate to the root directory of the backend project. Then execute the following command to build and run the application (Hibernate will automatically create the tables): 

```bash
mvn spring-boot:run
```

🟢 The API should now be running on:

```
http://localhost:8080
```

⚠️ Make sure `application.properties` matches your database credentials.

---

### Front End Setup (React/Vite)

1️⃣ **Navigate to the front end project directory:** 
    ```shell
    cd ../boxing-mindset-frontend/boxing-mindset
    ```

2️⃣ **Install dependencies:** 
    ```shell
    npm install
    ```

3️⃣ **Run the React/Vite application:** 
    ```shell
    npm run dev
    ```
    
🟢 The frontend application will start and can be found in a browser, typically at:

```
http://localhost:5173
```

---
<!--Wireframes-->
## 📸 Key Visuals

### Wireframes

<details>
  <summary>https://www.figma.com/design/h9nswSyeNU0e5e65vVtXcv/Boxing-Mindset-Wireframes?node-id=1-2&t=7NO5iy3CxDaZOR2e-0</summary>
</details>

## Weight Management Feature (User View)
<img width="1210" height="992" alt="Image" src="https://github.com/user-attachments/assets/16183079-930a-4342-b6f8-50eb6fd91f48" />

<img width="1161" height="1014" alt="Image" src="https://github.com/user-attachments/assets/e7419664-adea-499f-b011-b5f5c9f5e301" />

## Weight Management Feature (Admin View)
<img width="1215" height="1181" alt="Image" src="https://github.com/user-attachments/assets/06a50b2e-1a5e-43b3-9126-45d5e18eb6d1" />

<!--ER Diagram-->
## 📊 Entity Relationship Diagram (ERD)

The database is designed to support a weight tracking system for users, allowing them to record and monitor their weight over time. The schema focuses on simplicity while maintaining a clear relationship between users and their weight history.

### 🧩 Entities
*user_account*

Stores all registered users in the system.

| Field | Description |
|------|------------|
| id (Primary Key) | Unique identifier for each user |
| email | User’s email address |
| display_name | Public-facing name of the user |
| role | Defines user permissions (`user` or `coach`) |
| created_at | Timestamp of when the account was created |

*weight_entry*

Stores individual weight records for users over time.

| Field | Description |
|------|------------|
| id (Primary Key) | Unique identifier for each weight entry |
| user_id (Foreign Key) | References user_account.id |
| recorded_at | Date and time of the weigh-in |
| weight_lbs | Recorded weight in pounds |
| notes | Optional notes related to the weigh-in |

### 🔗 Relationships
user_account ↔️ weight_entry: One-to-Many
weight_entry ↔️ user_account: Many-to-One

<details>
<summary>https://dbdiagram.io/d/ERD-Boxing-Mindset-SQL-DBD-69929aa9bd82f5fce2c946ae</summary>
</details>

---

## ⚙️ API Endpoints

## Weigh-Ins 🥊

| Method | Endpoint | Description |
|------|------|------|
| GET | /api/weigh-ins | Retrieve all weigh-ins |
| GET | /api/weigh-ins/user/{userId} | Retrieve all weigh-ins for a specific user (sorted by newest first) |
| GET | /api/weigh-ins/latest/{userId} | Retrieve the latest weigh-in for a specific user |
| POST | /api/weigh-ins/add  | Create a new weigh-in |
| PUT | /api/weigh-ins/{id} | Update an existing weigh-in |
| DELETE | /api/weigh-ins/{id} | Delete a weigh-in |

## Users 👤

| Method | Endpoint | Description |
|------|------|------|
| GET | /api/users | Retrieve all users |

<!--Description of unsolved problems or future features-->
## 🌟 Future Enhancements

This project is designed with scalability in mind, with several planned features to enhance both functionality and user experience:

- **⏱️ Advanced Interval Timer**  
  Expand the timer into a fully customizable training tool with configurable rounds, rest periods, and audio/visual cues tailored for boxing workouts.

- **📅 Class Attendance Tracking**  
  Introduce a class management system where users can join sessions and coaches can track attendance for improved accountability and progress monitoring.

- **🔐 Full Authentication & Authorization**  
  Implement secure user authentication (signup/login) with role-based access control to support both athletes and coaches.

- **🥊 AI-Generated Boxing Drills**  
  Integrate AI to generate personalized boxing drills based on user goals and progress, seamlessly paired with the interval timer for guided workouts.


## 👩‍💻 Author
Mary Ann K.

## 📄 License

This project was developed for educational purposes as part of the **LaunchCode Software Development Program**.
