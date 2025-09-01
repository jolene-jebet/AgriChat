# AgriChat Backend

This is the backend server for AgriChat, providing MySQL database integration for storing chat conversations and messages.

## Features

- **MySQL Database Integration**: Persistent storage for conversations and messages
- **RESTful API**: Complete CRUD operations for conversations and messages
- **Security**: CORS, rate limiting, and input validation
- **Fallback Support**: Graceful degradation when database is unavailable
- **Real-time Updates**: Automatic conversation timestamp updates

## Prerequisites

- Node.js (v16 or higher)
- MySQL Server (v8.0 or higher)
- npm or yarn

## Installation

1. **Clone the repository** (if not already done):
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your database credentials:
   ```env
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=agrichat
   DB_PORT=3306
   PORT=3000
   ```

4. **Set up MySQL database**:
   ```bash
   # Start MySQL service
   mysql.server start
   
   # Create database and tables
   mysql -u your_username -p < ../database/schema.sql
   ```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on port 3000 (or the port specified in your .env file).

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Conversations
- `POST /api/conversations` - Create new conversation
- `GET /api/conversations` - List all conversations
- `GET /api/conversations/:id` - Get specific conversation
- `PUT /api/conversations/:id` - Update conversation title
- `DELETE /api/conversations/:id` - Delete conversation
- `GET /api/conversations/search/:query` - Search conversations

### Messages
- `POST /api/conversations/:id/messages` - Add message to conversation
- `GET /api/conversations/:id/messages` - Get messages for conversation
- `GET /api/conversations/:id/messages/recent` - Get recent messages

### Statistics
- `GET /api/conversations/:id/stats` - Get conversation statistics
- `GET /api/stats` - Get overall statistics

## Database Schema

The application uses three main tables:

1. **users** - User accounts (for future authentication)
2. **conversations** - Chat sessions
3. **messages** - Individual messages within conversations

See `../database/schema.sql` for the complete schema.

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | MySQL host | `localhost` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | `` |
| `DB_NAME` | Database name | `agrichat` |
| `DB_PORT` | MySQL port | `3306` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `CORS_ORIGIN` | Allowed origin | `http://localhost:5000` |

### Security Features

- **CORS**: Configurable cross-origin requests
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: All inputs are validated and sanitized
- **SQL Injection Protection**: Parameterized queries using mysql2

## Testing

1. **Start the server**: `npm run dev`
2. **Test health endpoint**: `curl http://localhost:3000/health`
3. **Test API endpoints**: Use Postman or similar tool

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MySQL service is running
   - Verify credentials in `.env` file
   - Ensure database exists

2. **Port Already in Use**
   - Change `PORT` in `.env` file
   - Kill process using the port: `lsof -ti:3000 | xargs kill`

3. **CORS Issues**
   - Update `CORS_ORIGIN` in `.env` file
   - Ensure frontend URL matches

### Logs

The server provides detailed logging:
- Request logs with timestamps
- Database connection status
- Error details (in development mode)

## Development

### Project Structure

```
backend/
├── config/          # Database configuration
├── models/          # Database models
├── routes/          # API routes
├── utils/           # Utility functions
├── server.js        # Main server file
├── package.json     # Dependencies
└── .env             # Environment variables
```

### Adding New Features

1. **New Models**: Add to `models/` directory
2. **New Routes**: Add to `routes/api.js`
3. **New Endpoints**: Follow existing pattern in routes

## Deployment

### Production Considerations

- Use environment variables for all sensitive data
- Set `NODE_ENV=production`
- Configure proper CORS origins
- Set up database connection pooling
- Use PM2 or similar for process management
- Set up monitoring and logging

### Docker Support

To run with Docker:

```bash
# Build image
docker build -t agrichat-backend .

# Run container
docker run -p 3000:3000 --env-file .env agrichat-backend
```

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the logs
3. Verify database connectivity
4. Check environment configuration

## License

MIT License - see main project README for details.
