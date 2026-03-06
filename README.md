# Vector - AI Graphic Design Tool

## Project Overview
Vector is a Capacitor/React application for AI-powered graphic design, utilizing Google Gemini and BytePlus (Seedream) models.

## Prerequisites
- Node.js (v18+)
- Android Studio (for APK building)
- BytePlus API Key (for Seedream models)
- Google Gemini API Key (optional, for fallback/free tier)

## Installation

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Setup Environment:**
    -   Copy `.env.example` to `.env` (if needed for local dev, though keys are managed in-app).
    -   Ensure `GEMINI_API_KEY` is set if you want to hardcode it, otherwise use the Settings UI.

## Development

1.  **Start Dev Server:**
    ```bash
    npm run dev
    ```
    Access at `http://localhost:3000`.

## Building for Android (APK)

To build the APK, you must follow these steps precisely to ensure the latest code is included.

1.  **Build Web Assets & Sync:**
    ```bash
    npm run build:android
    ```
    *This command runs `npm run build` (Vite build) and `npx cap sync android`.*

2.  **Open Android Studio:**
    ```bash
    npx cap open android
    ```

3.  **Build APK:**
    -   In Android Studio, go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
    -   The APK will be generated in `android/app/build/outputs/apk/debug/app-debug.apk`.

## Troubleshooting

### "Invalid or missing API key" for Seedream
-   Ensure you have entered the BytePlus API key in **Settings > Node_02**.
-   Check the logs for "KEY_LOADED" confirmation.

### "Gemini API Key missing" when using Seedream
-   This means the app is trying to fallback to Gemini because Seedream failed or was skipped.
-   Check the logs. If you see "BytePlus generation failed", it means the external engine error occurred.
-   The latest version (1.2+) disables automatic fallback to prevent confusion.

### Updates not showing in APK
-   Run `npm run build:android` again.
-   Ensure you are building the APK from the *updated* `android` folder.

## Project Structure
-   `src/services/bytePlusService.ts`: Handles Seedream API calls.
-   `src/services/imageService.ts`: Main entry point for image generation.
-   `src/App.tsx`: Main UI and logic.
-   `android/`: Native Android project files.


## Auto Router
- Select **Auto Router** in the app to choose the image provider from your prompt rules and instructions.
- Provider order can include Seedream, NVIDIA NIM, Cloudflare SDXL, Pollinations, AI Horde, and Hugging Face.
- Keep provider secrets in `.env`, not in the APK or frontend code.
# Trigger build Fri Mar  6 16:08:07 +08 2026
