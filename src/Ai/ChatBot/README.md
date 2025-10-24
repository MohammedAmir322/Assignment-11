# Volunteer Live Chat Service

This feature provides AI-powered live chat functionality for the volunteer platform using Google's Gemini AI.

## Features

- **AI-Powered Responses**: Uses Gemini 2.5 Flash model for intelligent responses
- **Volunteer-Specific Context**: Trained to help with volunteer-related queries
- **Real-time Chat**: Instant responses with loading indicators
- **Chat History**: Maintains conversation context
- **Responsive Design**: Works on all device sizes
- **Quick Actions**: Predefined quick response buttons
- **Error Handling**: Graceful error handling with user-friendly messages

## Components

### 1. SimpleChat
The main chat component with a floating button interface.

### 2. VolunteerChatBot
Advanced chat component with additional features like quick actions.

### 3. LiveChat
Basic chat implementation.

### 4. useChat Hook
Custom hook for managing chat state and functionality.

### 5. chatService
Service class for handling AI API calls and chat logic.

## Setup

1. **Environment Variables**: Add your Gemini API key to `.env`:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

2. **Installation**: The required dependencies are already installed:
   - `@google/genai`
   - `react-icons`
   - `framer-motion`

## Usage

### Basic Integration
```jsx
import { SimpleChat } from './features/chat';

function App() {
  return (
    <div>
      {/* Your app content */}
      <SimpleChat />
    </div>
  );
}
```

### Using the Hook
```jsx
import { useChat } from './features/chat';

function MyComponent() {
  const { messages, isLoading, sendMessage, clearChat } = useChat();
  
  const handleSend = async () => {
    await sendMessage("How do I register as a volunteer?");
  };
  
  return (
    <div>
      {/* Your chat UI */}
    </div>
  );
}
```

### Using the Service Directly
```jsx
import { chatService } from './features/chat';

async function getResponse() {
  try {
    const response = await chatService.generateResponse("Hello");
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}
```

## Customization

### Adding Quick Responses
Edit the `getQuickResponse` method in `chatService.js`:

```javascript
const quickResponses = {
  'your-keyword': 'Your response here',
  // Add more responses
};
```

### Modifying the AI Context
Update the `buildPrompt` method in `chatService.js` to change how the AI responds to different types of queries.

### Styling
The components use Tailwind CSS classes. You can customize the appearance by modifying the className props.

## API Configuration

The chat service uses the Gemini 2.5 Flash model. You can modify the model in the `generateResponse` method:

```javascript
const response = await this.ai.models.generateContent({
  model: "gemini-2.5-flash", // Change model here
  contents: prompt,
});
```

## Error Handling

The service includes comprehensive error handling:
- Network errors
- API key issues
- Rate limiting
- Invalid responses

All errors are caught and displayed as user-friendly messages.

## Performance

- Chat history is limited to prevent memory issues
- Messages are optimized for smooth scrolling
- Loading states provide good UX feedback
- Debounced input handling

## Security

- API key is stored in environment variables
- Input validation prevents malicious content
- Error messages don't expose sensitive information

## Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Check if `VITE_GEMINI_API_KEY` is set in `.env`
   - Ensure the API key is valid and has proper permissions

2. **Chat Not Responding**
   - Check browser console for errors
   - Verify network connection
   - Check if the Gemini API is accessible

3. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check if all required CSS classes are available

### Debug Mode

Enable debug logging by setting:
```javascript
localStorage.setItem('chat-debug', 'true');
```

This will log all API calls and responses to the console.