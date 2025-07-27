# AI Summarization Feature for Notely

## Overview

The AI summarization feature allows users to automatically generate concise summaries of their notes using OpenAI's GPT-3.5-turbo model. This feature helps users quickly understand the main points of their notes and can be used to populate the synopsis field.

## Features

- **Smart Summarization**: Uses OpenAI's GPT-3.5-turbo to generate intelligent, context-aware summaries
- **Minimum Content Requirement**: Requires at least 50 characters to ensure meaningful summaries
- **Real-time Feedback**: Shows loading state and success/error messages
- **Flexible Usage**: Works for both new notes and existing notes
- **Auto-synopsis**: Option to automatically apply generated summary to the note's synopsis field

## Implementation Details

### Backend (Server)

#### Dependencies

- `openai`: ^4.68.0 - For AI summarization functionality

#### Environment Variables

Add the following to your `.env` file:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

#### API Endpoints

1. **Summarize New Note Content**

   ```
   POST /api/entries/summarize
   Content-Type: application/json
   Authorization: Bearer <token>

   Body: {
     "content": "Your note content here..."
   }
   ```

2. **Summarize Existing Note**

   ```
   POST /api/entries/:id/summarize
   Content-Type: application/json
   Authorization: Bearer <token>

   Body: {
     "content": "Optional content override"
   }
   ```

#### Response Format

```json
{
  "summary": "Generated summary text...",
  "originalLength": 500,
  "summaryLength": 120
}
```

### Frontend (Client)

#### Components Modified

- `NoteEditor.tsx`: Added summarization button and dialog
- `EditNote.tsx`: Passes entry ID to NoteEditor

#### New Features Added

1. **Summarize Button**: Located in the note editor's menu (three dots)
2. **Summary Dialog**: Shows generated summary with option to apply to synopsis
3. **Smart Disabling**: Button is disabled when content is too short
4. **Loading States**: Visual feedback during summarization process

## Usage Instructions

### For Users

1. **Open a note** in edit mode or create a new note
2. **Write content** (minimum 50 characters required)
3. **Click the three dots menu** in the top-right corner of the editor
4. **Select "Summarize Note"** from the menu
5. **Wait for processing** - a loading spinner will appear
6. **Review the generated summary** in the dialog
7. **Choose to apply** the summary to the synopsis or cancel

### For Developers

#### Setting Up OpenAI API

1. Get an OpenAI API key from [OpenAI Platform](https://platform.openai.com/)
2. Add the API key to your server's `.env` file:
   ```env
   OPENAI_API_KEY=sk-your-api-key-here
   ```
3. Restart your server

#### Customizing the AI Model

You can modify the AI model and parameters in `server/src/controllers/entry.controller.ts`:

```typescript
const completion = await openai.chat.completions.create({
  model: "gpt-3.5-turbo", // Change to gpt-4 for better results
  messages: [
    {
      role: "system",
      content: "Your custom system prompt here...",
    },
    {
      role: "user",
      content: `Your custom user prompt here...`,
    },
  ],
  max_tokens: 150, // Adjust for longer/shorter summaries
  temperature: 0.3, // Adjust for more/less creative summaries
});
```

## Error Handling

The feature includes comprehensive error handling:

- **API Key Missing**: Shows appropriate error message
- **Content Too Short**: Prevents summarization and shows requirement
- **Network Errors**: Displays user-friendly error messages
- **Rate Limiting**: Handles OpenAI API rate limits gracefully

## Security Considerations

- API key is stored securely on the server
- User authentication required for all summarization requests
- Content validation prevents abuse
- Error messages don't expose sensitive information

## Performance Considerations

- Summarization is asynchronous and doesn't block the UI
- Loading states provide user feedback
- Error handling prevents crashes
- Minimum content requirement reduces unnecessary API calls

## Future Enhancements

Potential improvements for the AI summarization feature:

1. **Multiple Summary Styles**: Different summary types (bullet points, paragraph, etc.)
2. **Custom Prompts**: Allow users to customize summarization style
3. **Batch Summarization**: Summarize multiple notes at once
4. **Summary History**: Track and compare different summaries
5. **Language Support**: Support for multiple languages
6. **Offline Mode**: Cache summaries for offline access

## Troubleshooting

### Common Issues

1. **"AI summarization is not configured"**

   - Check if `OPENAI_API_KEY` is set in your `.env` file
   - Restart the server after adding the API key

2. **"Content is too short to summarize"**

   - Ensure your note has at least 50 characters
   - The feature requires meaningful content for good summaries

3. **"Failed to generate summary"**

   - Check your internet connection
   - Verify your OpenAI API key is valid
   - Check OpenAI service status

4. **Button is disabled**
   - Write more content (minimum 50 characters required)
   - Check if you're authenticated

### Debug Mode

To enable debug logging, add this to your server's environment:

```env
DEBUG=summarization
```

This will log detailed information about summarization requests and responses.
