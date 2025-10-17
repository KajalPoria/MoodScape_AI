##Project name
MoodScape AI

##Problem and solution
“Imagine if your environment could feel how you feel.
In today’s fast, digital life, people struggle with stress, burnout, and emotional imbalance — and most wellness apps offer only static solutions.

That’s why we built MoodScape AI — an intelligent, emotion-responsive platform that turns your mood into a personalized world of music, visuals, and micro-wellness actions, in real time.”

##Use of AI
1. Emotion Detection AI
The core AI module continuously analyzes user input — text, voice tone, or facial expression — to identify the emotional state.
It uses:
Natural Language Processing (NLP) models for text sentiment analysis.
Speech Emotion Recognition (SER) for detecting emotions from pitch, tone, and rhythm in the user’s voice.
Computer Vision (CV) via facial expression detection (smile, frown, eye movement, etc.) using APIs like MediaPipe, Azure Face API, or DeepFace.
The AI outputs an emotion label (like “happy”, “anxious”, “calm”) with an intensity score between 0–1.
🧩 Example:
User says, “I feel a bit nervous today.”
→ NLP model detects emotion = “anxious”, intensity = 0.7

2. Real-Time Adaptive Response Engine
Once the emotion is detected, the AI decision layer decides how to respond.
It uses an LLM (Large Language Model) or custom inference logic to choose:
Which music tone or soundscape to play (e.g., calm ambient, uplifting beats).
Which visual theme/environment to render (e.g., ocean waves, sunlight rays, dark minimal mood).
Which micro-action to suggest (like “Take a deep breath” or “Write one good thing about your day”).
This layer ensures the response feels human, empathetic, and relevant — not robotic.

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
