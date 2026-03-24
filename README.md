# **Boxing Mindset: Full-Stack Web Application**

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
> - npm or yarn
> - Java Development Kit (JDK) 21
> - Maven
> - MySQL Server (version 8.0+)

### Back End Setup (Java/Spring Boot/MySQL)

1️⃣ **Clone the repository:** In the terminal, navigate to the directory where you want the project to live, then execute the following commands:
    ```shell
    git clone https://github.com/ma-kol/unit-2-final-project-MaryAnn-K.git # or your link, if forked
    cd unit-2-final-project-MaryAnn-K/boxing-mindset-backend
    ```

2️⃣ **Configure secrets for database:** Create a new MySQL database named `weigh-in` and another one named `users`, then create an `.env` file at the project root directory (`boxing-mindset-backend`): 
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
<!--Wireframes-->
<!--ER Diagram-->
<!--Description of unsolved problems or future features-->
