# Job Portal Website 🚀

A full-stack job portal that connects job seekers and employers with smart matching and recommendations. The platform includes resume parsing, AI-based resume ranking for employers, and personalized job recommendations for candidates.

---

## Features

### 👨‍💼 For Job Seekers

* Create and manage profile with skills, experience, and resume upload
* Apply to jobs directly from the platform
* Filter jobs by **location**, **salary**, and **role**
* Get **job recommendations** based on profile skills and activity
* Real-time notifications for new and relevant job postings

### 🧑‍💼 For Employers

* Post and manage job openings
* View applications for each job post
* **AI-based resume ranking** to quickly shortlist candidates
* Automatically see candidates ranked by how well their resume matches the job requirements

---

## AI & Machine Learning Implementation 🤖

### Resume Parsing

* Uploaded resumes are parsed to extract key information such as:
  * Skills
  * Experience
  * Education
* Parsed data is stored and used for matching and ranking.

### Resume Ranking for Employers

* When a job is posted, candidate resumes are **automatically ranked** based on:
  * Skill match with job requirements
  * Relevant experience
* This helps employers quickly identify the most suitable candidates without manual screening.

### Job Recommendation System

* A **Random Forest model** is used to recommend jobs to job seekers.
* Recommendations are based on:
  * User profile and skills
  * Past job applications
  * Browsing and interaction history

---

## Tech Stack 🛠️

* **Frontend:** React.js
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **AI / ML:** Python, Scikit-learn (Random Forest)
* **Authentication:** JWT
* **Other:** REST APIs

---

## Installation & Setup

### Prerequisites

* Node.js (v14+)
* MongoDB
* Python (v3.8+)

### Backend Setup

```bash
cd backend
npm install
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

### ML Model Setup

```bash
cd ml-service
pip install -r requirements.txt
python app.py
```

---

## Project Highlights

* Separate dashboards for **job seekers** and **employers**
* Smart AI features to reduce manual effort in hiring
* Real-time filtering and notifications
* Scalable and modular full-stack architecture

---

## Future Improvements

* Advanced NLP-based resume matching
* Company-specific ranking weights
* Interview scheduling module
* Admin analytics dashboard

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

