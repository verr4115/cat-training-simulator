# 🐱 Cat Training Simulator - BCBA Training Lab

An interactive educational tool for BCBA (Board Certified Behavior Analyst) trainees to learn about reinforcement strategies, schedules, and interventions through hands-on practice with a virtual cat.

## 🎯 Overview

Learn how different reinforcement strategies affect behavior over time by acting as the "BCBA-in-training" while the virtual cat acts as the learner. Choose when and how to reinforce, and watch how the cat's behavior changes in real-time!

## ✨ Features

### 🎓 Four Training Scenarios
- **Jumping on Counter** (Easy) - Reduce counter-jumping by reinforcing sitting on the floor
- **Constant Meowing** (Medium) - Reduce excessive meowing through quiet behavior reinforcement
- **Sitting Calmly** (Easy) - Increase calm sitting for grooming or vet visits
- **Scratching Couch** (Hard) - Replace couch scratching with scratching post use

### 📚 Six Intervention Types
- **DRA** - Differential Reinforcement of Alternative behavior
- **DRO** - Differential Reinforcement of Other behavior
- **DRI** - Differential Reinforcement of Incompatible behavior
- **NCR** - Non-Contingent Reinforcement
- **Extinction** - Withhold all reinforcement (with extinction burst modeling)
- **Punishment** - Aversive consequences (with ethical warnings)

### ⏱️ Six Reinforcement Schedules
- **CRF** - Continuous Reinforcement (every response)
- **FR** - Fixed Ratio (e.g., every 5th response)
- **VR** - Variable Ratio (average of N responses)
- **FI** - Fixed Interval (first response after fixed time)
- **VI** - Variable Interval (first response after varying time)
- **EXT** - Extinction (no reinforcement)

### 🧠 Real-Time Behavioral Modeling
- **Motivation Operations (MO)** - Adjustable motivation levels
- **Satiation** - Increases with reinforcement, reduces effectiveness
- **Extinction Burst** - Automatic detection and visualization
- **Behavior Competition** - Target vs. alternative behavior dynamics
- **Live Graphs** - Real-time behavior rate visualization with Plotly

### 🎨 Interactive Features
- **Animated Cat Stage** - Behavior-specific animations and expressions
- **Reinforcement Effects** - Visual feedback with treats and sparkles
- **Event Logging** - Chronological feed of all session events
- **Session Summaries** - Performance ratings, KPIs, and personalized insights
- **Manual Controls** - Deliver reinforcement, adjust parameters, pause/play

## 🚀 Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to the URL shown (usually `http://localhost:5173`)

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

## 📖 How to Use

1. **Select a Scenario** - Choose from four behavioral scenarios with different difficulty levels
2. **Configure Intervention** - Select your intervention type and reinforcement schedule
3. **Run the Session** - Watch the cat exhibit behaviors and monitor real-time graphs
4. **Review Performance** - Analyze session summary with KPIs and get recommendations
5. **Iterate** - Run multiple sessions to see long-term effects

## 🎓 Learning Objectives

By using this simulator, BCBA trainees will learn to:
- ✅ Identify appropriate interventions for different behavioral goals
- ✅ Understand the effects of different reinforcement schedules
- ✅ Recognize extinction bursts and respond appropriately
- ✅ Manage establishing operations and satiation
- ✅ Interpret behavior rate changes and inter-response times
- ✅ Make data-based decisions about intervention adjustments
- ✅ Practice ethical decision-making

## 🛠️ Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Plotly.js** - Interactive graphing
- **Modern CSS** - Animations and responsive design

## 📊 Technical Highlights

- Sophisticated behavioral simulation engine running at 10 Hz
- Probabilistic behavior generation with sigmoid functions
- Accurate schedule implementations (FR, VR, FI, VI)
- Dynamic motivation and satiation calculations
- Extinction burst detection algorithms
- Real-time rate calculations using sliding windows
- Smooth 60fps animations

## 📚 Documentation

See **CAT_SIMULATOR_GUIDE.md** for comprehensive documentation including:
- Detailed intervention explanations
- Schedule selection guide
- Best practices and tips
- Troubleshooting guide
- Technical details

## 🎯 Educational Use Cases

- BCBA training programs
- University ABA courses
- Self-paced learning for behavior analysts
- Workshop demonstrations
- Understanding schedule effects
- Practicing intervention selection

## 📱 Browser Compatibility

Works on all modern browsers:
- Chrome/Edge ✅
- Firefox ✅
- Safari ✅
- Mobile browsers ✅ (responsive design)

## 🔒 Privacy & Ethics

- **No Data Collection** - All simulation runs locally in your browser
- **Ethical Warnings** - Punishment use includes clear warnings about side effects
- **Evidence-Based** - Based on ABA principles and research literature

## 🤝 Credits

Built with principles from:
- Applied Behavior Analysis (ABA)
- Schedules of Reinforcement (Ferster & Skinner, 1957)
- Differential Reinforcement Procedures
- Motivation Operations (Michael, 1982)

## 📄 License

This project is open source and available for use by BCBAs and ABA professionals.

---

**Start training your virtual cat and master reinforcement strategies! 🐱✨**


