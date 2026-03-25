<div align=center>
  <h1>Boxing Mindset: Full-Stack Web Application</h1>
</div>

<!--Elevator Pitch-->
## 💡 About the Project
Boxing Mindset is a full-stack web application designed to serve as a "one-stop" solution for amateur boxers to manage and enhance their training. The app includes the following features:
- Weight Management: Log weigh-ins, monitor trends, and match boxing weight classes
- Interval Timer (in development): Structured rounds with rest alerts
- Class Attendance (in development): Track gym participation and consistency

Built with a **React** frontend, **Spring Boot** backend, and **MySQL** database, the app provides a solid foundation for future features like user authentication, AI-driven training recommendations, and analytics.

🥊 A one-stop platform to help boxers stay on top of their training and progress.

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

4️⃣ **Run the Java/Spring Boot application:** If you do not have the application loaded in an IDE such as IntelliJ, go to the terminal and navigate to the root directory of the backend project. Then execute the following command to build and run the application (Hibernate will automatically create the tables): 

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


<!--ER Diagram-->
## 📊 Entity Relationship Diagram (ERD)

The database is designed to support a weight tracking system for users, allowing them to record and monitor their weight over time. The schema focuses on simplicity while maintaining a clear relationship between users and their weight history.

### 🧩 Entities
user_account

Stores all registered users in the system.

Fields:

id (Primary Key) – Unique identifier for each user
email – User’s email address
display_name – Public-facing name of the user
role – Defines user permissions (user or coach)
created_at – Timestamp of when the account was created
weight_entry

Stores individual weight records for users over time.

Fields:

id (Primary Key) – Unique identifier for each weight entry
user_id (Foreign Key) – References user_account.id
recorded_at – Date and time of the weigh-in
weight_lbs – Recorded weight in pounds
notes – Optional notes related to the weigh-in

### 🔗 Relationships
user_account ↔️ weight_entry: One-to-Many
weight_entry ↔️ user_account: Many-to-One

<details>
<summary>[https://dbdiagram.io/d/6994b9a8bd82f5fce2f9f6d8](https://dbdiagram.io/d/ERD-Boxing-Mindset-SQL-DBD-69929aa9bd82f5fce2c946ae)</summary>

</details>

<!--Description of unsolved problems or future features-->
