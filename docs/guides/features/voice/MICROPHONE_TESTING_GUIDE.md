# Microphone Testing & Troubleshooting Guide

## New Features Added

### 1. **Explicit Permission Request**
- When you click "Voice ON", the browser will now explicitly request microphone access
- You'll see a browser permission prompt asking to allow microphone

### 2. **Visual Error Messages**
- Red error box appears if microphone issues are detected
- Yellow warning box shows permission status
- Detailed step-by-step instructions to fix issues

### 3. **Console Debugging**
- Open browser console (F12) to see detailed logs:
  - 🎤 Speech recognition started
  - 🔊 Audio capture started - microphone is active
  - 🎵 Sound detected
  - 🗣️ Speech detected
  - 📝 Transcript updates
  - ✅ Final transcript
  - ❌ Any errors with details

## Testing Steps

### Step 1: Open Browser Console
1. Press **F12** to open Developer Tools
2. Click on the **Console** tab
3. Keep it open while testing

### Step 2: Enable Voice Mode
1. Click **"Voice OFF"** button
2. Browser will prompt for microphone permission
3. Click **"Allow"**
4. Watch console for: `✅ Microphone access granted`

### Step 3: Check Status
Look for these console messages:
- `🎤 Starting speech recognition...`
- `🎤 Speech recognition started`
- `🔊 Audio capture started - microphone is active`

### Step 4: Test Your Voice
1. Say something clearly: "Hello, can you hear me?"
2. Watch for console messages:
   - `🎵 Sound detected` ← Your mic is working!
   - `🗣️ Speech detected` ← Speech recognized!
   - `📝 Transcript: "hello can you hear me"` ← It heard you!

### Step 5: Verify Full Flow
1. Ask a real question: "What are the current threats?"
2. Watch the transcript appear in real-time
3. Check for `✅ Final transcript: "what are the current threats"`
4. AI should respond with voice

## Common Issues & Solutions

### Issue 1: No Permission Prompt
**Symptoms:**
- No browser prompt appears
- Yellow warning box shows

**Solution:**
1. Check browser address bar for microphone icon (🎤)
2. Click it and select "Always allow"
3. Refresh page and try again

### Issue 2: Permission Denied
**Symptoms:**
- Red error box: "Microphone access denied"
- Console shows: `❌ Microphone access denied`

**Solution:**
1. Click lock icon in address bar
2. Find Microphone setting
3. Change from "Block" to "Allow"
4. Refresh page (F5)
5. Click "Voice ON" again

### Issue 3: No Sound Detected
**Symptoms:**
- Console shows: `🎤 Speech recognition started`
- But never shows: `🎵 Sound detected`

**Solutions:**
1. **Check Windows Sound Settings:**
   - Right-click speaker icon in taskbar
   - Click "Sound settings"
   - Scroll to "Input"
   - Make sure correct microphone is selected
   - Test microphone - speak and watch the blue bar move

2. **Check Microphone is Default:**
   - Windows Settings > System > Sound
   - Under "Input", select your microphone
   - Click "Test your microphone" and speak

3. **Check Browser Permissions:**
   - Chrome: Settings > Privacy and Security > Site Settings > Microphone
   - Make sure localhost:5173 is allowed

4. **Try Different Browser:**
   - Chrome/Edge work best
   - Firefox may need flags enabled

### Issue 4: Audio Capture Not Starting
**Symptoms:**
- Console shows: `🎤 Speech recognition started`
- But never shows: `🔊 Audio capture started`

**Solution:**
This means speech recognition started but can't access the microphone:
1. Close all other apps using microphone (Zoom, Teams, Discord)
2. Refresh browser page
3. Try again

### Issue 5: Speech Not Detected
**Symptoms:**
- Shows: `🔊 Audio capture started`
- Shows: `🎵 Sound detected`
- But never shows: `🗣️ Speech detected`

**Solution:**
Speech recognition works but can't understand you:
1. Speak louder and more clearly
2. Reduce background noise
3. Move closer to microphone
4. Check microphone sensitivity in Windows settings

## Console Log Reference

### Normal Flow (Everything Working):
```
Requesting microphone access...
✅ Microphone access granted
Microphone permission: granted
Voice mode enabled - starting listening
🎤 Starting speech recognition...
🎤 Speech recognition started
🔊 Audio capture started - microphone is active
🎵 Sound detected
🗣️ Speech detected
📝 Transcript: what are the threats Final: false
📝 Transcript: what are the current threats Final: true
✅ Final transcript: what are the current threats
🤐 Speech ended
🔇 Audio capture ended
🛑 Speech recognition ended
```

### Error Flow (Permission Denied):
```
Requesting microphone access...
❌ Microphone access denied: NotAllowedError
❌ Speech recognition error: not-allowed
Error details: Microphone access denied. Please allow microphone permissions.
```

### Error Flow (No Microphone):
```
✅ Microphone access granted
🎤 Starting speech recognition...
🎤 Speech recognition started
❌ Speech recognition error: audio-capture
Error details: No microphone found. Please connect a microphone.
```

## Quick Diagnostic Commands

Open Console (F12) and run these to check your setup:

### Check if microphone exists:
```javascript
navigator.mediaDevices.enumerateDevices().then(devices => {
  const mics = devices.filter(d => d.kind === 'audioinput');
  console.log('Microphones found:', mics.length);
  mics.forEach((mic, i) => console.log(`${i+1}:`, mic.label));
});
```

### Test microphone access:
```javascript
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    console.log('✅ Microphone access works!');
    stream.getTracks().forEach(track => track.stop());
  })
  .catch(err => console.error('❌ Microphone access failed:', err));
```

### Check Speech Recognition support:
```javascript
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
console.log('Speech Recognition supported:', !!SR);
```

## Windows Microphone Troubleshooting

### Enable Microphone Access for Apps:
1. Settings > Privacy > Microphone
2. Turn ON "Allow apps to access your microphone"
3. Turn ON "Allow desktop apps to access your microphone"

### Check Microphone is Not Muted:
1. Right-click speaker icon in taskbar
2. Open "Sound settings"
3. Under "Input", check volume is not at 0
4. Click "Device properties"
5. Make sure "Disable" is not checked

### Update Audio Drivers:
1. Device Manager
2. Sound, video and game controllers
3. Right-click your audio device
4. Update driver

## Browser-Specific Notes

### Chrome/Edge (Recommended):
- Full support for Web Speech API
- Best performance
- Clear permission prompts

### Firefox:
- May need to enable: `media.webspeech.recognition.enable` in about:config
- Less reliable than Chrome

### Safari:
- Limited support
- May not work on Windows

## Still Having Issues?

If microphone still not working after all checks:

1. **Restart browser completely**
2. **Test in Chrome Incognito mode** (rules out extensions)
3. **Try different microphone** if available
4. **Check Windows Microphone Privacy Settings**
5. **Restart computer** (sometimes helps reset audio drivers)

## Success Indicators

You know the microphone is working when you see:
- ✅ Console shows: `🔊 Audio capture started - microphone is active`
- ✅ Console shows: `🎵 Sound detected` when you speak
- ✅ Real-time transcript appears in the blue box
- ✅ No red error messages
- ✅ Status shows "Listening..." with pulsing red mic

---

**After following this guide, the console logs will tell you exactly where the issue is!**
