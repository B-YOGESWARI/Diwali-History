# 🪔 Diwali History

### Bringing the Stories of Diwali Closer Through Technology

Diwali has always been a festival filled with beautiful stories, traditions, and meaningful values. I wanted to create something that would help people explore the history and significance of Diwali in a simple, interactive, and engaging way.

That idea led me to build **Diwali History**, a web application that brings together cultural storytelling and technology. One of the main features of the website is **Ask About Diwali**, where visitors can ask questions about the festival and explore answers with relevant web sources.

While building this project, I got the opportunity to work with frontend development, Python, APIs, AI-powered web search, and cloud deployment. It was a hands-on learning experience that helped me understand how different technologies can work together to turn an idea into a real application.

## 🌐 Live Demo

You can explore my project here:

- **Live Website:** [Diwali History](https://diwali-history.netlify.app/)
- **Backend API:** [Diwali History Backend](https://diwali-history-backend.onrender.com/)
- **GitHub Repository:** [Diwali-History](https://github.com/B-YOGESWARI/Diwali-History)

## 💡 What Is Diwali History?

The main idea behind this project is to make learning about Diwali more interesting through technology.

The website allows visitors to explore the festival's stories, traditions, and cultural significance through an interactive experience. I also wanted to make it easier for people to find answers to their questions, so I added the **Ask About Diwali** feature.

Instead of simply reading static information, visitors can type a question and receive an answer through the connected backend and web-search service. Relevant sources are also displayed when available, allowing visitors to explore the information further.

For me, this project is not just about building a website. It is about finding meaningful ways to use technology to share our culture and traditions.

## ✨ Features I Built

- 🪔 **Diwali Stories and History:** Explore the history, traditions, and cultural significance of the festival.
- 🤖 **Ask About Diwali:** Ask questions about Diwali and receive AI-assisted answers using web search.
- 🔎 **Source Links:** Explore relevant sources returned with answers.
- 🎨 **Interactive Website Design:** Festive animations, cinematic visuals, and interactive elements make the experience more engaging.
- 📱 **Responsive Navigation:** Navigate the website through an interface designed to support different screen sizes.
- 🔗 **Backend Integration:** Connect the frontend to a Python-based API that processes questions and returns responses.
- ☁️ **Live Deployment:** Access the website online through Netlify, with the backend hosted on Render.
- 🌱 **Environmental Awareness:** Share the message of celebrating Diwali thoughtfully while caring for our surroundings.

## 🛠️ Technologies I Used

| Technology | How I Used It |
|---|---|
| HTML5 | To structure the website |
| CSS3 | To create the design, animations, and visual effects |
| JavaScript | To handle interactions and connect the frontend to the backend |
| Python | To develop the backend logic |
| FastAPI | To build the API used by the website |
| Uvicorn | To run the FastAPI application |
| Tavily API | To retrieve relevant web-search information for user questions |
| Netlify | To deploy the frontend |
| Render | To host the backend |
| Git and GitHub | To manage the source code and track changes |

## 🏗️ How It Works

I built the application with two main parts: the frontend, which visitors interact with, and the backend, which processes their questions.

```text
             Visitor
                |
                v
       Diwali History Website
          HTML, CSS, JS
                |
                v
         FastAPI Backend
             (Render)
                |
                v
          Tavily Web Search
                |
                v
      Answer + Available Sources
                |
                v
       Displayed on the Website
```

Here is how the **Ask About Diwali** feature works:

1. A visitor opens the website and navigates to Ask About Diwali.
2. They enter a question about the festival.
3. JavaScript sends the question to the FastAPI backend.
4. The backend uses Tavily to search for relevant web information.
5. The backend sends the response and available source details back to the website.
6. The visitor can read the answer and explore the sources.

Working on this integration helped me understand how frontend applications communicate with backend APIs and external services.

## 🚀 Running the Project Locally

If you would like to explore the code or run the project on your computer, follow these steps.

### Prerequisites

- Python
- Git
- pip
- A Tavily API key for the web-search feature

### 1. Clone the repository

```bash
git clone https://github.com/B-YOGESWARI/Diwali-History.git
cd Diwali-History
```

### 2. Create a virtual environment

```bash
python -m venv venv
```

On Windows, activate it using:

```bash
venv\Scripts\activate
```

On macOS or Linux, use:

```bash
source venv/bin/activate
```

### 3. Install the dependencies

If `requirements.txt` is available in the project root, run:

```bash
pip install -r requirements.txt
```

If the file is inside the `backend` folder, use its actual path instead.

### 4. Configure the API key

The Ask About Diwali feature uses a Tavily API key for web search. Configure the following environment variable in your local environment:

```text
TAVILY_API_KEY=your_tavily_api_key
```

Replace the placeholder with your actual key. Keep your API key private, and never upload it to GitHub.

### 5. Start the backend

If your FastAPI application is defined as `app` in `backend/main.py`, run this command from the project root:

```bash
uvicorn backend.main:app --reload --port 8001
```

The backend should then be available at:

[http://127.0.0.1:8001](http://127.0.0.1:8001)

If API documentation is enabled, you can explore it at:

[http://127.0.0.1:8001/docs](http://127.0.0.1:8001/docs)

### 6. Run the frontend

Open the project using VS Code and serve the website with Live Server or another local web server.

For example, if Live Server uses port `5500`, open:

[http://localhost:5500](http://localhost:5500)

Make sure the frontend API URL points to your local backend during local testing. For the deployed website, use the production Render backend URL.

*Note: The commands above assume the project uses the paths and configuration shown. Adjust them if your current project structure differs.*

## 🌱 Celebrate with a Thought

For me, Diwali is about more than lights and celebrations. It is also about happiness, hope, togetherness, and the values we carry into our everyday lives.

While working on this project, I wanted to share a small message about celebrating responsibly and caring for the environment.

Firecrackers can contribute to air and noise pollution and affect people, animals, and our surroundings. We can make our celebrations more thoughtful by choosing eco-friendly decorations, lighting diyas safely, spending time with family and friends, and reducing unnecessary pollution.

This is the idea behind **“Celebrate with a Thought.”** We can enjoy our traditions while also being mindful of the world around us.

**Celebrate the festival. Cherish the traditions. Protect our planet.** 🌍🪔

I hope Diwali History encourages visitors to explore the festival's stories, appreciate its cultural significance, and celebrate with a little more awareness and care.

## 🔮 What's Next?

This project is still a learning journey, and there are several things I would like to improve over time:

- Add more Diwali stories and historical information.
- Improve the quality and relevance of answers from Ask About Diwali.
- Explore more reliable sources of cultural and historical information.
- Improve error handling and the overall user experience.
- Make the website more accessible and improve the mobile experience.
- Continue exploring useful AI-powered features as the project grows.

## 👩‍💻 About Me

**Yogeswari Boreddi**

GitHub: [@B-YOGESWARI](https://github.com/B-YOGESWARI)

I enjoy learning new technologies and building applications that solve practical problems. Through this project, I explored how HTML, CSS, JavaScript, Python, APIs, and cloud platforms can work together in a real-world application.

There were challenges along the way, especially while connecting the frontend, backend, and external services. Working through them helped me learn more about debugging, deployment, and building applications beyond the local development environment.

I look forward to continuing to improve this project and exploring more ways to combine technology with meaningful ideas.

## 📌 Project Status

**Diwali History is live and available online.**

- The frontend is deployed on Netlify.
- The backend is deployed on Render.
- Ask About Diwali is integrated with the backend and web-search service.
- The project will continue to evolve as I add improvements and explore new ideas.

Thank you for taking the time to explore my project! 🪔
