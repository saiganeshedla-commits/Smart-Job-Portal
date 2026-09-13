import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");

  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showApplications, setShowApplications] = useState(false);
  const [showAddJob, setShowAddJob] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [userName, setUserName] = useState(
    localStorage.getItem("user_name") || ""
  );

  const [userRole, setUserRole] = useState(
    localStorage.getItem("user_role") || ""
  );

  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [salary, setSalary] = useState("");
  const [experience, setExperience] = useState("");
  const [jobType, setJobType] = useState("");

  const loadJobs = () => {
    fetch("http://localhost:5000/api/jobs")
      .then((response) => response.json())
      .then((data) => setJobs(data))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const closeAll = () => {
    setShowRegister(false);
    setShowLogin(false);
    setShowApplications(false);
    setShowAddJob(false);
  };

  const handleRegister = () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        role: "student",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message || data.error);

        if (data.message === "Registration successful") {
          setName("");
          setEmail("");
          setPassword("");
          closeAll();
        }
      })
      .catch(() => alert("Registration failed"));
  };

  const handleLogin = () => {
    if (!loginEmail || !loginPassword) {
      alert("Please enter email and password");
      return;
    }

    fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: loginEmail,
        password: loginPassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message || data.error);

        if (data.message === "Login successful") {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user_id", data.user.id);
          localStorage.setItem("user_name", data.user.name);
          localStorage.setItem("user_role", data.user.role);

          setUserName(data.user.name);
          setUserRole(data.user.role);

          setLoginEmail("");
          setLoginPassword("");
          closeAll();
        }
      })
      .catch(() => alert("Login failed"));
  };

  const handleAddJob = () => {
    if (userRole !== "recruiter") {
      alert("Only recruiters can add jobs");
      return;
    }

    if (
      !jobTitle ||
      !company ||
      !location ||
      !skills ||
      !salary ||
      !experience ||
      !jobType
    ) {
      alert("Please fill all job fields");
      return;
    }

    fetch("http://localhost:5000/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        job_title: jobTitle,
        company,
        location,
        skills,
        salary,
        experience,
        job_type: jobType,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message || data.error);

        if (data.message === "Job added successfully") {
          setJobTitle("");
          setCompany("");
          setLocation("");
          setSkills("");
          setSalary("");
          setExperience("");
          setJobType("");

          closeAll();
          loadJobs();
        }
      })
      .catch(() => alert("Failed to add job"));
  };

  const handleApplications = () => {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      alert("Please login first");
      return;
    }

    fetch(`http://localhost:5000/api/applications/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setApplications(data);
        setShowApplications(true);
        setShowRegister(false);
        setShowLogin(false);
        setShowAddJob(false);
      })
      .catch(() => alert("Failed to load applications"));
  };

  const handleApply = (jobId) => {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      alert("Please login before applying");
      return;
    }

    fetch("http://localhost:5000/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        job_id: jobId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message || data.error);
      })
      .catch(() => alert("Application failed"));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_role");

    setUserName("");
    setUserRole("");
    closeAll();

    alert("Logout successful");
  };

  const filteredJobs = jobs.filter((job) => {
    const text = search.toLowerCase();

    return (
      job.job_title.toLowerCase().includes(text) ||
      job.company.toLowerCase().includes(text) ||
      job.skills.toLowerCase().includes(text) ||
      job.location.toLowerCase().includes(text)
    );
  });

  return (
    <div className="app">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-container">

          <div className="logo">
            <span>💼</span> SmartJob
          </div>

          <div className="nav-buttons">

            {!userName && (
              <>
                <button
                  className="nav-btn outline"
                  onClick={() => {
                    closeAll();
                    setShowRegister(true);
                  }}
                >
                  Register
                </button>

                <button
                  className="nav-btn"
                  onClick={() => {
                    closeAll();
                    setShowLogin(true);
                  }}
                >
                  Login
                </button>
              </>
            )}

            {userRole === "student" && (
              <button
                className="nav-btn"
                onClick={handleApplications}
              >
                My Applications
              </button>
            )}

            {userRole === "recruiter" && (
              <button
                className="nav-btn"
                onClick={() => {
                  closeAll();
                  setShowAddJob(true);
                }}
              >
                + Add Job
              </button>
            )}

            {userName && (
              <button
                className="nav-btn logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}

          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">

          <div className="hero-text">

            <p className="small-title">
              YOUR CAREER STARTS HERE
            </p>

            <h1>
              Find the right job.
              <br />
              <span>Build your future.</span>
            </h1>

            <p className="hero-description">
              Discover exciting job opportunities from leading companies
              and take the next step in your career.
            </p>

            <div className="hero-search">

              <span>🔍</span>

              <input
                type="text"
                placeholder="Search job title, company or skill..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <button>Search</button>

            </div>

          </div>

          <div className="hero-card">

            <div className="hero-icon">💼</div>

            <h3>Career Opportunities</h3>

            <p>
              Explore jobs matching your skills and interests.
            </p>

            <div className="hero-stat">
              <strong>{jobs.length}+</strong>
              <span>Jobs Available</span>
            </div>

          </div>

        </div>
      </section>

      {/* USER INFO */}
      {userName && (
        <div className="welcome-bar">

          <div>
            Welcome back, <strong>{userName}</strong> 👋
          </div>

          <div className="role-badge">
            {userRole}
          </div>

        </div>
      )}

      {/* REGISTER */}
      {showRegister && (
        <div className="modal-box">

          <h2>Create Account</h2>
          <p className="form-subtitle">
            Register as a student
          </p>

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="form-buttons">
            <button onClick={handleRegister}>
              Create Account
            </button>

            <button
              className="cancel-btn"
              onClick={() => setShowRegister(false)}
            >
              Cancel
            </button>
          </div>

        </div>
      )}

      {/* LOGIN */}
      {showLogin && (
        <div className="modal-box">

          <h2>Welcome Back</h2>
          <p className="form-subtitle">
            Login to your SmartJob account
          </p>

          <input
            type="email"
            placeholder="Email Address"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />

          <div className="form-buttons">
            <button onClick={handleLogin}>
              Login
            </button>

            <button
              className="cancel-btn"
              onClick={() => setShowLogin(false)}
            >
              Cancel
            </button>
          </div>

        </div>
      )}

      {/* ADD JOB */}
      {showAddJob && userRole === "recruiter" && (
        <div className="modal-box">

          <h2>Post a New Job</h2>
          <p className="form-subtitle">
            Add a new opportunity for students
          </p>

          <input
            placeholder="Job Title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />

          <input
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />

          <input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <input
            placeholder="Skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />

          <input
            placeholder="Salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />

          <input
            placeholder="Experience"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />

          <input
            placeholder="Job Type"
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
          />

          <div className="form-buttons">
            <button onClick={handleAddJob}>
              Post Job
            </button>

            <button
              className="cancel-btn"
              onClick={() => setShowAddJob(false)}
            >
              Cancel
            </button>
          </div>

        </div>
      )}

      {/* APPLICATIONS */}
      {showApplications && (
        <div className="applications-section">

          <div className="section-heading">
            <p>MY CAREER</p>
            <h2>My Applications</h2>
          </div>

          {applications.length === 0 ? (
            <div className="empty-box">
              You have not applied for any jobs yet.
            </div>
          ) : (
            <div className="applications-grid">

              {applications.map((application) => (
                <div
                  key={application.id}
                  className="application-card"
                >

                  <h3>{application.job_title}</h3>

                  <p>
                    🏢 {application.company}
                  </p>

                  <p>
                    📍 {application.location}
                  </p>

                  <span className="status">
                    {application.status}
                  </span>

                  <p className="date">
                    Applied:{" "}
                    {new Date(
                      application.applied_at
                    ).toLocaleString()}
                  </p>

                </div>
              ))}

            </div>
          )}

          <button
            className="close-section"
            onClick={() => setShowApplications(false)}
          >
            Close Applications
          </button>

        </div>
      )}

      {/* RECRUITER DASHBOARD */}
      {userRole === "recruiter" && (
        <section className="dashboard">

          <div>
            <p className="dashboard-label">
              RECRUITER DASHBOARD
            </p>

            <h2>
              Manage your job opportunities
            </h2>

            <p>
              Post new jobs and connect students with
              career opportunities.
            </p>
          </div>

          <button
            onClick={() => {
              closeAll();
              setShowAddJob(true);
            }}
          >
            + Post New Job
          </button>

        </section>
      )}

      {/* JOBS */}
      <main className="jobs-section">

        <div className="section-heading">

          <p>EXPLORE OPPORTUNITIES</p>

          <h2>Latest Job Openings</h2>

          <span>
            {filteredJobs.length} jobs found
          </span>

        </div>

        <div className="jobs-grid">

          {filteredJobs.map((job) => (

            <div
              className="job-card"
              key={job.id}
            >

              <div className="job-top">

                <div className="company-icon">
                  {job.company.charAt(0)}
                </div>

                <span className="job-type">
                  {job.job_type}
                </span>

              </div>

              <h3>{job.job_title}</h3>

              <p className="company-name">
                {job.company}
              </p>

              <div className="job-info">

                <span>📍 {job.location}</span>

                <span>💰 {job.salary}</span>

                <span>⏱ {job.experience}</span>

              </div>

              <div className="skills">
                {job.skills.split(",").map((skill, index) => (
                  <span key={index}>
                    {skill.trim()}
                  </span>
                ))}
              </div>

              {userRole === "student" && (
                <button
                  className="apply-btn"
                  onClick={() => handleApply(job.id)}
                >
                  Apply Now →
                </button>
              )}

            </div>

          ))}

        </div>

        {filteredJobs.length === 0 && (
          <div className="empty-box">
            No jobs found. Try another search.
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer>

        <div className="footer-logo">
          💼 SmartJob
        </div>

        <p>
          Smart Job Portal — Connecting talent with opportunity.
        </p>

        <span>
          © 2026 Smart Job Portal
        </span>

      </footer>

    </div>
  );
}

export default App;