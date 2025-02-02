# MemoryLens

## Overview

MemoryLens is a mobile application designed to assist individuals affected by memory loss, such as Alzheimer's patients. By leveraging advanced facial and object recognition technologies, the app helps users identify and remember important people, places, and items in their daily lives.

Users can store images of family members, friends, and familiar objects in the app's database. When the device's camera is pointed at someone or something, MemoryLens instantly recognizes and provides information about the person or object. The app also features voice-to-text functionality, allowing users to interact through a conversational chat interface, making it easier to ask questions and receive information about their saved memories.

## Setup Instructions

### Prerequisites

- Node.js installed on your system
- Expo Go app installed on your mobile device

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/MemoryLens.git
cd MemoryLens
```

2. Install Expo CLI globally:
```bash
npm install -g expo-cli
```

3. Install project dependencies:
```bash
npm install
```

### Configuration

#### Firebase Setup:
1. Create a Firebase project in the Firebase Console
2. Enable Firestore Database
3. Obtain your Firebase configuration
4. Update `firebaseConfig.js` with your credentials

### Running the Application

1. Start the development server:
```bash
npx expo start --tunnel
```

2. Use the Expo Go app on your mobile device to scan the QR code and test the application

## Implemented Features

### User Authentication and Data Management
- **Auth0 Integration**: Secure authentication to manage user sessions
- **Firestore Database**: Stores user profiles and memory data for seamless retrieval
- **Firebase Storage**: Used for storing images and voice notes uploaded by users
- **Cloudinary Integration**: Optimized image storage and transformations

### Memory Storage & Retrieval System
- **Upload Virtual Memories**: Users can store images of people, objects, or places
- **Add Labels & Notes**: Users can annotate their memories for future reference
- **Retrieve Past Interactions**: When an object or face is recognized, the app displays previous interactions in AR
- **Voice Playback**: Users can record and replay voice notes tied to saved memories

### Real-Time Recognition & AR Integration

#### Face Recognition (FaceNet Model)
- Allows users to identify a person when they forget who they are
- Uses a "Who is this?" button for instant identification
- Stores face embeddings in Firestore for personalized recognition

#### Object Recognition (YOLOv8 for Personalized Recognition)
- Users can manually label objects for personalized object recognition
- YOLOv8 enables training custom object detection models for user-specific items

#### Real-Time AR Integration (ViroReact)
- Users can scan objects and view saved labels directly from their phones 
- Recognized objects should trigger overlay labels

#### Location Recognition ("Where am I?")
- Helps users recognize where they are in their home
- Uses object positioning and prior labeled data for room identification

### AI-Powered Personalization
- **Manual Annotation System**: Users can train YOLOv8 to recognize specific objects they frequently forget
- **User-Trained Object Models**: Users can store their trained models for future use

## Technical Stack

| Component | Technology Used |
|-----------|----------------|
| Frontend | React Native (Expo) |
| Authentication | Auth0 |
| Database | Firestore |
| Storage | Firebase Storage, Cloudinary |
| Face Recognition | FaceNet |
| Object Recognition | YOLOv8 (User-Trained) |
| Augmented Reality | ViroReact |

## Future Improvements

- Train YOLOv8 models per user for better personalized recognition
- Refine object recognition to improve detection accuracy
- Enhance FaceNet accuracy with more diverse face embedding datasets
- Improve UI/UX for a more intuitive experience
- Indoor Navigation System (Post-Hackathon): Enable users to find specific objects or rooms

### Key Benefits:
- Reduces caregiver burden by allowing users to independently recognize faces and objects
- Enhances quality of life by providing instant memory retrieval
- Empowers patients to navigate their home environment with confidence
