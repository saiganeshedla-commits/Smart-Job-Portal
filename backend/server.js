const express = require("express");
const cors = require("cors");
const db = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = "smart_job_portal_secret";

// HOME
app.get("/", (req, res) => {
    res.send("Smart Job Portal Backend is Running");
});

// GET ALL JOBS
app.get("/api/jobs", (req, res) => {
    const sql = "SELECT * FROM jobs ORDER BY id DESC";

    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                error: "Database error"
            });
        }

        res.json(results);
    });
});

// REGISTER
app.post("/api/register", async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            error: "All fields are required"
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO users (name, email, password, role)
            VALUES (?, ?, ?, ?)
        `;

        db.query(
            sql,
            [name, email, hashedPassword, role || "student"],
            (err, result) => {

                if (err) {
                    console.log(err);

                    return res.status(500).json({
                        error: "Registration failed"
                    });
                }

                res.json({
                    message: "Registration successful",
                    user_id: result.insertId
                });
            }
        );

    } catch (error) {
        console.log(error);

        res.status(500).json({
            error: "Registration failed"
        });
    }
});

// LOGIN
app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: "Email and password are required"
        });
    }

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, results) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: "Database error"
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        const user = results[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    });
});

// ADD NEW JOB
app.post("/api/jobs", (req, res) => {

    const {
        job_title,
        company,
        location,
        skills,
        salary,
        experience,
        job_type
    } = req.body;

    if (
        !job_title ||
        !company ||
        !location ||
        !skills ||
        !salary ||
        !experience ||
        !job_type
    ) {
        return res.status(400).json({
            error: "All job fields are required"
        });
    }

    const sql = `
        INSERT INTO jobs
        (
            job_title,
            company,
            location,
            skills,
            salary,
            experience,
            job_type
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            job_title,
            company,
            location,
            skills,
            salary,
            experience,
            job_type
        ],
        (err, result) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    error: "Failed to add job"
                });
            }

            res.json({
                message: "Job added successfully",
                job_id: result.insertId
            });
        }
    );
});

// APPLY FOR JOB
app.post("/api/applications", (req, res) => {

    const { user_id, job_id } = req.body;

    if (!user_id || !job_id) {
        return res.status(400).json({
            error: "User ID and Job ID are required"
        });
    }

    // CHECK DUPLICATE APPLICATION
    const checkSql = `
        SELECT * FROM applications
        WHERE user_id = ? AND job_id = ?
    `;

    db.query(
        checkSql,
        [user_id, job_id],
        (checkErr, existingApplications) => {

            if (checkErr) {
                console.log(checkErr);

                return res.status(500).json({
                    error: "Database error"
                });
            }

            if (existingApplications.length > 0) {
                return res.status(400).json({
                    error: "You have already applied for this job"
                });
            }

            // INSERT APPLICATION
            const insertSql = `
                INSERT INTO applications
                (user_id, job_id)
                VALUES (?, ?)
            `;

            db.query(
                insertSql,
                [user_id, job_id],
                (err, result) => {

                    if (err) {
                        console.log(err);

                        return res.status(500).json({
                            error: "Application failed"
                        });
                    }

                    res.json({
                        message: "Application submitted successfully",
                        application_id: result.insertId
                    });
                }
            );
        }
    );
});

// GET MY APPLICATIONS
app.get("/api/applications/:user_id", (req, res) => {

    const userId = req.params.user_id;

    const sql = `
        SELECT
            applications.id,
            jobs.job_title,
            jobs.company,
            jobs.location,
            applications.status,
            applications.applied_at
        FROM applications
        JOIN jobs
            ON applications.job_id = jobs.id
        WHERE applications.user_id = ?
        ORDER BY applications.applied_at DESC
    `;

    db.query(
        sql,
        [userId],
        (err, results) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    error: "Failed to fetch applications"
                });
            }

            res.json(results);
        }
    );
});

// START SERVER
const PORT = 5000;

app.listen(PORT, () => {
    console.log(
        `Server running on http://localhost:${PORT}`
    );
});