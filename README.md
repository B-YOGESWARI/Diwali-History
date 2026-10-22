# 🪔 Diwali History
### Bringing the Stories of Diwali Closer Through Technology

Diwali is a festival filled with stories, traditions, and cultural significance. With this project, I wanted to explore how technology and AI could help bring these stories to life in a more engaging way.

**Diwali History** is a web application that explores Diwali's history through digital storytelling and experimental AI-powered video generation. I built this project to learn more about web development, backend integration, and the possibilities of emerging AI technologies.

## 🌐 Live Demo

You can explore the deployed application here:

- **Frontend:** https://diwali-history.netlify.app/
- **Backend:** https://diwali-history-backend.onrender.com/
- **GitHub Repository:** https://github.com/B-YOGESWARI/Diwali-History

## 💡 What Is This Project About?

The idea behind Diwali History is simple: combine historical storytelling with modern technology to make cultural stories more engaging.

The application has a frontend where users interact with the website and a Python backend that handles server-side logic and AI service integrations.

I also experimented with AI video-generation services to explore how historical stories and scene descriptions could be transformed into videos.

## ✨ What I Worked On

- Created a web interface using HTML, CSS, and JavaScript.
- Developed backend functionality using Python and FastAPI.
- Connected the frontend and backend through API requests.
- Organized the backend into separate agents and services for story, scene, and video-generation-related logic.
- Experimented with external AI services such as Luma AI and Hugging Face.
- Deployed the frontend on Netlify and the backend on Render.

This project is also a learning experience for me, especially in understanding how different parts of a web application work together.

## 🛠️ Technologies Used

- **HTML, CSS, and JavaScript** — For the website interface and interactions.
- **Python** — For backend development.
- **FastAPI** — For building backend APIs.
- **Uvicorn** — For running the Python application.
- **Netlify** — For frontend deployment.
- **Render** — For backend deployment.
- **Luma AI and Hugging Face** — For experimenting with AI video generation.
- **Git and GitHub** — For version control and managing the source code.

## 🏗️ How the Application Works

The application has two main parts:

```text
User
  |
  v
Frontend (Netlify)
HTML + CSS + JavaScript
  |
  v
Backend (Render)
Python + FastAPI
  |
  v
AI Service Integration
Luma AI / Hugging Face
  |
  v
Video Output
When generation succeeds
```

The frontend communicates with the backend, which handles the relevant application logic. When video generation is requested, the backend can interact with a configured AI service.

The final video-generation step is still experimental and may not succeed for every request.

## 🚀 Run the Project Locally

If you want to explore the source code or run the project on your computer, follow these steps.

### Prerequisites

- Python
- Git
- pip

### Step 1: Clone the repository

```bash
git clone https://github.com/B-YOGESWARI/Diwali-History.git
cd Diwali-History
```

### Step 2: Create a virtual environment

```bash
python -m venv venv
```

On Windows, activate it using:

```powershell
venv\Scripts\activate
```

### Step 3: Install dependencies

If the repository contains a `requirements.txt` file in the root directory, run:

```bash
pip install -r requirements.txt
```

### Step 4: Configure environment variables

Some backend features may require API credentials. Configure the required environment variables using the names expected by the application.

Keep your API keys private and never upload them to GitHub.

### Step 5: Start the backend

If the application entry point is `backend/main.py` and the FastAPI instance is named `app`, run:

```bash
uvicorn backend.main:app --reload
```

The API documentation may then be available at:

http://127.0.0.1:8000/docs

The exact commands may need adjustment depending on the current project configuration.

## 🎬 A Note About AI Video Generation

One of the interesting parts of this project was experimenting with AI video generation.

I explored services such as Luma AI and Hugging Face to understand how text prompts and historical scene descriptions could be converted into videos.

However, **video generation is still an experimental feature**. I encountered limitations with free credits and some technical issues while integrating the services.

The free usage available through AI video-generation services is limited. Once the available credits or request quota is exhausted, additional generations may not be possible without waiting for a reset or obtaining more credits. API errors and service availability can also affect the results.

The website and backend are deployed, but the complete video-generation workflow is not yet reliable end to end. Improving this is one of the areas for future development.

## 🔮 What I'd Like to Improve Next

There is still room to improve this project. Some of the next steps I'd like to explore are:

- Making the video-generation process more reliable.
- Improving API error handling and generation-status tracking.
- Improving how generated videos are retrieved and managed.
- Adding more historical stories and scenes.
- Improving communication between the frontend and backend.
- Exploring AI services that fit within the available budget.

## 👩‍💻 About the Developer

**Yogeswari Boreddi**

GitHub: [@B-YOGESWARI](https://github.com/B-YOGESWARI)

This project reflects my interest in software development and emerging AI technologies. It has been an opportunity to experiment, learn from integration challenges, and understand how different technologies can work together in a real-world application.

## 📌 Project Status

Diwali History is a deployed project that is still evolving. The frontend is hosted on Netlify, and the backend is hosted on Render. AI video generation remains experimental and requires further development.
