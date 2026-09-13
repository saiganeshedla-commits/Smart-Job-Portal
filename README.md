\# Smart Job Portal



A full-stack web application that connects students with recruiters through a simple and user-friendly job portal.



\## 🚀 Features



\### Student Features



\* Student registration and login

\* Browse available jobs

\* Search jobs

\* View job details

\* Apply for jobs

\* Prevent duplicate applications

\* View applied jobs and application status

\* Logout functionality



\### Recruiter Features



\* Recruiter login

\* Add new job opportunities

\* View available jobs

\* Manage job postings

\* Separate recruiter dashboard



\## 🛠️ Technologies Used



\### Frontend



\* React.js

\* Vite

\* HTML

\* CSS

\* JavaScript



\### Backend



\* Node.js

\* Express.js

\* REST API

\* JWT Authentication

\* bcryptjs



\### Database



\* MySQL



\## 🏗️ System Architecture



```text

Student / Recruiter

&#x20;       ↓

&#x20;  React Frontend

&#x20;       ↓

&#x20;  REST API

&#x20;       ↓

Node.js + Express

&#x20;       ↓

&#x20;    MySQL

```



\## 📂 Project Structure



```text

SmartJobPortal/

│

├── backend/

│   ├── db.js

│   ├── server.js

│   ├── package.json

│   └── package-lock.json

│

├── frontend-react/

│   ├── src/

│   │   ├── App.jsx

│   │   ├── App.css

│   │   ├── index.css

│   │   └── main.jsx

│   ├── public/

│   ├── package.json

│   └── vite.config.js

│

├── jobs.csv

├── .gitignore

└── README.md

```



\## 🔐 Authentication



The application provides separate access for:



\* Student

\* Recruiter



Passwords are securely hashed using bcryptjs, and JWT is used for authentication.



\## 🔌 Main REST APIs



| Method | Endpoint                     | Purpose                 |

| ------ | ---------------------------- | ----------------------- |

| GET    | `/`                          | Check backend server    |

| GET    | `/api/jobs`                  | Get all jobs            |

| POST   | `/api/register`              | Register a user         |

| POST   | `/api/login`                 | Login                   |

| POST   | `/api/jobs`                  | Add a job               |

| POST   | `/api/applications`          | Apply for a job         |

| GET    | `/api/applications/:user\_id` | Get user's applications |



\## 🗄️ Database



The project uses MySQL with three main tables:



\* `users`

\* `jobs`

\* `applications`



\### Users



Stores student and recruiter account information.



\### Jobs



Stores job title, company, location, skills, salary, experience, and job type.



\### Applications



Stores student applications and their status.



\## ▶️ How to Run the Project



\### 1. Start the Backend



Open PowerShell:



```powershell

cd C:\\Users\\2303a\\OneDrive\\Desktop\\SmartJobPortal\\backend

node server.js

```



Backend runs on:



```text

http://localhost:5000

```



\### 2. Start the Frontend



Open another PowerShell window:



```powershell

cd C:\\Users\\2303a\\OneDrive\\Desktop\\SmartJobPortal\\frontend-react

npm run dev

```



Frontend runs on:



```text

http://localhost:5173

```



\## 👤 User Roles



\### Student



Students can:



\* Register

\* Login

\* Search jobs

\* Apply for jobs

\* View their applications



\### Recruiter



Recruiters can:



\* Login

\* Add job opportunities

\* View job postings

\* Manage recruitment-related activities



\## 🌐 Project Repository



GitHub:



`https://github.com/saiganeshedla-commits/Smart-Job-Portal`



\## 🎯 Project Objective



The objective of Smart Job Portal is to provide a centralized platform where students can discover suitable job opportunities and recruiters can post job openings.



\## 🔮 Future Enhancements



\* Resume upload

\* Email notifications

\* A

ss

