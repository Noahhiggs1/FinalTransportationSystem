Here’s a clean, structured README you can use for your GitHub repository:

---

# Project Setup Guide

## Prerequisites

Before running this project, make sure you have the following installed:

* **Node.js & npm** (required for React)
* **Java (JDK)**
* **VS Code Extensions:**

  * Spring Boot Extension Pack

---

## ⚙️ Configuration Setup

### 1. Update Database Credentials

You **must update the database configuration** in the `application.properties` file to match your local environment.

* Replace the default **username** and **password** with your own:

  ```
  spring.datasource.username=your_username
  spring.datasource.password=your_password
  ```

### 2. Match Database Name

Ensure the database name in `application.properties` matches the one on your local machine:

```
spring.datasource.url=jdbc:mysql://localhost:3306/your_database_name
```

* If the names do not match, the application will not connect properly.

---

## ▶️ Running the Project

### Backend (Spring Boot)

1. Open the project in VS Code
2. Make sure the Spring Boot extensions are installed
3. Run the application using:

   * VS Code Run button
     OR
   * Terminal:

     ```
     ./gradlew.bat bootRun --no-daemon
     ```

---

### Frontend (React)

1. Navigate to the frontend directory:

   ```
   cd frontend
   cd tdemo-app
   ```
2. Install dependencies:

   ```
   npm install
   ```
3. Start the React app:

   ```
   npm run
   npm start
   ```

---

## 🌿 Git Workflow

* **Always create your own branch before making changes:**

  ```
  git checkout -b your-branch-name
  ```

* Only merge into the main branch if:

  * Your code runs successfully
  * There are no merge conflicts

* If unsure, open a pull request instead of merging directly.

---

## ⚠️ Important Notes

* Make sure your **database credentials and database name match your local setup**
* Ensure all required tools (npm, Java, VS Code extensions) are installed before running
* Avoid pushing directly to the main branch unless your changes are verified and merge-ready

---

If anything fails to run, double-check your configuration settings first—most issues come from mismatched database credentials or names.

References 
OpenAI. (2023). ChatGPT (Mar 14 version) [Large language model]. https://chat.openai.com/chat
Helped create the frontend of the code and integrate the frontend and the backend
