# 🐱 Cat Training Simulator - BCBA Training Lab

## Overview

The Cat Training Simulator is an interactive educational tool designed to help BCBA (Board Certified Behavior Analyst) trainees understand how different reinforcement strategies, schedules, and interventions affect behavior over time.

## Features

### 🎯 Four Training Scenarios

1. **Jumping on Counter** (Easy)
   - Goal: Reduce counter-jumping behavior
   - Alternative: Sitting on floor
   - Recommended: DRA (Differential Reinforcement of Alternative behavior)

2. **Constant Meowing** (Medium)
   - Goal: Reduce excessive meowing
   - Alternative: Quiet behavior
   - Recommended: DRO (Differential Reinforcement of Other behavior)

3. **Sitting Calmly** (Easy)
   - Goal: Increase calm sitting
   - Alternative: Sitting calmly instead of running
   - Recommended: DRA with dense reinforcement

4. **Scratching Couch** (Hard)
   - Goal: Reduce furniture scratching
   - Alternative: Using scratching post
   - Recommended: DRI (Differential Reinforcement of Incompatible behavior)

## Intervention Types

### DRA - Differential Reinforcement of Alternative Behavior
Reinforce a different, functionally equivalent behavior. The alternative behavior serves the same function as the problem behavior.

### DRO - Differential Reinforcement of Other Behavior
Deliver reinforcement when the target behavior has NOT occurred for a specified time interval.

### DRI - Differential Reinforcement of Incompatible Behavior
Reinforce a behavior that physically cannot occur at the same time as the problem behavior.

### NCR - Non-Contingent Reinforcement
Deliver reinforcement on a time-based schedule, independent of behavior. Can help reduce problem behavior by reducing motivation.

### Extinction
Withhold all reinforcement for the target behavior. Note: May produce an extinction burst (temporary increase in behavior).

### Punishment
Apply aversive consequences to reduce behavior. ⚠️ Use with caution - can have unintended side effects.

## Reinforcement Schedules

### Continuous Reinforcement (CRF)
- Reinforce every single response
- Best for: Acquisition/learning new behaviors
- Results in: Rapid learning but quick satiation

### Fixed Ratio (FR)
- Reinforce after a fixed number of responses (e.g., FR-5 = reinforce every 5th response)
- Results in: High response rates with post-reinforcement pause

### Variable Ratio (VR)
- Reinforce after varying number of responses around a mean (e.g., VR-5 = average of 5 responses)
- Results in: Highest, most consistent response rates; resistant to extinction

### Fixed Interval (FI)
- Reinforce first response after a fixed time period (e.g., FI-10s)
- Results in: Scalloped response pattern, responding increases as interval ends

### Variable Interval (VI)
- Reinforce first response after varying time periods around a mean (e.g., VI-10s)
- Results in: Steady, moderate response rates; very resistant to extinction

### Extinction (EXT)
- No reinforcement delivered
- Used for: Reducing unwanted behaviors

## Key Behavioral Concepts Modeled

### Motivation Operations (MO)
- **High MO (70%+)**: Cat is highly motivated, more likely to engage in behaviors
- **Low MO (<30%)**: Cat is less motivated, behaviors are less frequent
- You can adjust MO manually to simulate establishing operations

### Satiation (SAT)
- Increases as reinforcers are delivered
- High satiation (>70%) reduces the effectiveness of reinforcement
- Decays slowly over time
- **Visual cue**: Sleepy cat emoji 😴 when highly satiated

### Extinction Burst
- Temporary increase in behavior when reinforcement is first withheld
- The simulation detects and logs extinction bursts
- **Visual cue**: Agitated cat emoji 😾 with intense shaking animation

## Using the Simulator

### Getting Started
1. Click on the **🐱 Training Lab** tab in the main navigation
2. Select a scenario from the scenario cards
3. Click **Start Lab** to begin

### During a Session
1. **Top Bar Controls**:
   - View session progress and time remaining
   - Adjust Motivation (MO) slider (only when paused)
   - Play/Pause the simulation
   - Restart current session
   - Start next session (after completion)

2. **Cat Stage** (Left Panel):
   - Watch the animated cat exhibit behaviors
   - Visual indicators show when behaviors occur
   - Reinforcement effects display treats and sparkles
   - Monitor real-time MO, Satiation, and Burst levels

3. **Control Panel** (Right Panel):
   - **Intervention Strategy**: Choose your intervention type
   - **Reinforcement Schedule**: Set schedule type and parameters
   - **Reinforcer Type**: Select treat, clicker, or praise
   - **Magnitude**: Adjust reinforcer strength (1-3)
   - **Manual Actions**: Manually deliver reinforcement
   - **Session Statistics**: Track behaviors and reinforcers delivered

4. **Graphs** (Left Panel):
   - Real-time line graphs showing behavior rates over time
   - Red line: Target (problem) behavior rate
   - Green line: Alternative behavior rate
   - Rates shown as responses per minute

5. **Event Log** (Left Panel):
   - Chronological feed of all session events
   - Color-coded by event type
   - Shows reinforcements, behaviors, bursts, and more

### Session Summary
After each session, you'll receive:
- **Performance Rating**: Based on behavior change goals
- **Behavior Changes**: Percentage change in target and alternative behaviors
- **Session Statistics**: IRTs, reinforcers delivered, motivation levels
- **Strategy Used**: Review your intervention and schedule choices
- **Insights & Recommendations**: AI-generated tips for improvement

## Best Practices & Tips

### For Reducing Target Behaviors
1. Choose DRA, DRO, or DRI interventions
2. Put target behavior on Extinction (EXT)
3. Use rich schedules (CRF or VR-3) for alternative behavior initially
4. Expect and prepare for extinction burst
5. Gradually thin the schedule as behavior improves

### For Increasing Alternative Behaviors
1. Start with continuous reinforcement (CRF) or dense schedules (FR-2, VR-3)
2. Use high-magnitude reinforcers (3)
3. Gradually thin to VI or VR schedules for maintenance
4. Monitor satiation levels - take breaks if needed

### Schedule Selection Guide
- **Acquisition**: CRF → FR-2 → VR-3
- **Maintenance**: VI-10 or VR-5
- **Resistance to extinction**: VR or VI schedules
- **Steady responding**: VI schedules
- **High rates**: VR schedules

### Managing Satiation
- Use varied reinforcers
- Reduce magnitude when satiation is high
- Take breaks between sessions
- Consider shorter, more frequent sessions

### Understanding Extinction
- **Initial increase** (burst) is normal and expected
- **Variability** in behavior increases during extinction
- **Spontaneous recovery** may occur in later sessions
- **Consistency** is key - don't reinforce during burst!

## Educational Learning Objectives

By using this simulator, BCBA trainees will learn to:

1. ✅ Identify appropriate interventions for different behavioral goals
2. ✅ Understand the effects of different reinforcement schedules
3. ✅ Recognize extinction bursts and respond appropriately
4. ✅ Manage establishing operations and satiation
5. ✅ Interpret behavior rate changes and inter-response times
6. ✅ Make data-based decisions about intervention adjustments
7. ✅ Understand the relationship between MO, reinforcement history, and behavior
8. ✅ Practice ethical decision-making (e.g., punishment warnings)

## Technical Details

### Simulation Engine
The simulator uses a sophisticated behavioral model that includes:
- **Probabilistic behavior generation** based on current state
- **Dynamic motivation and satiation calculations**
- **Schedule contingency checking** (FR, VR, FI, VI)
- **Extinction burst detection algorithms**
- **Behavior competition** (target vs. alternative)
- **Real-time rate calculations** using sliding windows

### Update Frequency
- Simulation runs at 10 Hz (10 ticks per second, dt=0.1s)
- Graphs update every 1 second
- Rates calculated using 10-second sliding window

### Animation System
- Behavior-specific animations (jumping, meowing, scratching)
- Reinforcement effects with particle animations
- State-based cat expressions (happy, sleepy, agitated, calm)
- Smooth transitions between animation states

## Troubleshooting

### Behavior not changing?
- Check that your intervention is appropriate for the goal
- Ensure reinforcement schedule is dense enough for acquisition
- Verify you're reinforcing the alternative behavior, not target
- Allow enough time - behavior change takes multiple responses

### Extinction burst too intense?
- This is realistic! Real extinction can be challenging
- Stay consistent - don't accidentally reinforce during burst
- Consider if pure extinction is best, or if DRA/DRO is more humane

### Cat always sleepy?
- Satiation is too high - reduce reinforcer magnitude
- Take longer breaks between sessions
- Use more varied reinforcers (though all types have similar effects in this model)

### Graphs not showing data?
- Ensure behaviors are occurring (may take a few seconds to start)
- Check that simulation is not paused
- If graph is flat, behaviors may be very low frequency

## Future Enhancements

Potential additions to the simulator:
- [ ] Multiple cat personalities (different baseline rates)
- [ ] Function-based scenarios (attention, escape, tangible, sensory)
- [ ] Fading and shaping modules
- [ ] Multi-component interventions (e.g., DRA + prompting)
- [ ] Save/export session data
- [ ] Leaderboards and challenges
- [ ] More complex competing behaviors
- [ ] Response cost and token economy systems

## Credits

This simulator was designed to provide hands-on learning for behavior analysts in training, combining principles of:
- Applied Behavior Analysis (ABA)
- Schedules of Reinforcement (Ferster & Skinner, 1957)
- Differential Reinforcement Procedures
- Motivation Operations (Michael, 1982)
- Extinction and Extinction Burst phenomena

---

**Have fun learning and training your virtual cat! 🐱✨**

