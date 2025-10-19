# Cat Images for Training Simulator

Place your cat images here with these exact filenames:

## Required Images:

### Idle/Resting States
- **`idle1.png`** - First idle frame (cat sitting/standing normally)
- **`idle2.png`** - Second idle frame (slight variation for animation)
  - These will cycle every 2 seconds to create a "breathing" animation effect

### Target Behaviors (Problem Behaviors)
- **`meowing.png`** - Cat meowing/making noise
- **`jumping.png`** - Cat jumping on counter
- **`scratching.png`** (optional) - Cat scratching furniture

### Special States
- **`reinforced.png`** - Cat receiving reinforcement/treat (happy cat!)
- **`sleepy.png`** (optional) - Cat when satiated/tired
- **`burst.png`** (optional) - Cat during extinction burst (frustrated)

## Image Guidelines:

- **Format**: PNG or JPG (PNG recommended for transparency)
- **Size**: Recommended 200x200px to 400x400px
- **Background**: Transparent PNG works best, but any background is fine
- **Style**: Keep consistent style across all images for best results

## How It Works:

The simulator will automatically display the appropriate image based on:
- Current behavior (idle, target behavior, alternative behavior)
- Animation state (reinforced, sleepy, burst)
- Scenario type (meowing vs jumping scenarios use different images)

If an image is missing, the simulator will fall back to emoji characters (🐱, 😸, etc.)

## Testing Your Images:

1. Place all images in this folder
2. Start the dev server: `npm run dev`
3. Select a scenario and watch your cat come to life!
4. The two idle images will alternate every 2 seconds when no behavior is happening

Have fun! 🐱

