[![npm](https://img.shields.io/npm/v/mcp-simple-gateway)](https://www.npmjs.com/package/mcp-simple-gateway)

# MCP Simple Gateway

MCP Simple Gateway is a proxy server for Model Context Protocol (MCP) that allows you to aggregate and manage multiple MCP servers through a single interface.

## Key Features

- 🚀 Aggregation of multiple MCP servers
- 🔒 Token-based authentication support
- 📝 Flexible JSON-based configuration
- 🐳 Docker support
- 🔌 SSE, stdio and StreamableHTTP MCP supported

## Usage

### Running via CLI

```bash
npx mcp-simple-gateway --config config.json
```

### Running via Docker Compose

Example `docker-compose.yml`:

```yaml
services:
  mcp-gateway:
    platform: linux/amd64 # For Apple Silicon Users
    image: ghcr.io/denwakeup/mcp-simple-gateway:latest
    volumes:
      - ./config.json:/app/config.json
    ports:
      - '3000:3000'
    environment:
      - CONFIG_PATH=/app/config.json
```

## Configuration

Example configuration file (`config.json`):

```json
{
  "proxyServer": {
    "logLevel": "debug",
    "logPretty": true,
    "authTokens": ["your-auth-token"],
    "cors": {
      "origin": true
    }
  },
  "mcpServers": {
    "time": {
      "command": "uvx",
      "args": ["mcp-server-time", "--local-timezone=Europe/Moscow"],
      "proxyOptions": {
        "authTokens": ["server-specific-token"]
      }
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/app/files"]
    },
    "echo": {
      "type": "streamableHttp",
      "url": "http://localhost:8080/mcp"
    }
  }
}
```

### Configuration Parameters

- `proxyServer.options`:

  - `logLevel`: Logging level (debug, info, warn, error)
  - `logPretty`: Log formatting
  - `authTokens`: Array of authentication tokens (used as default for all servers)
  - `cors`: CORS [configuration](https://expressjs.com/id/resources/middleware/cors.html#configuration-options) options (optional)

- `mcpServers`: MCP servers configuration
  - `[serverName]`:
    - `command`: Command to start the server (for stdio servers)
    - `args`: Command arguments (for stdio servers)
    - `url`: URL of the server (for SSE and StreamableHTTP servers)
    - `type`: Server type (optional for stdio and SSE, required for StreamableHTTP)
    - `proxyOptions`: Proxy options for a specific server
      - `authTokens`: Array of authentication tokens (overrides `proxyServer.options.authTokens` for the specific server)

Based on the configuration above, the URLs for accessing MCP servers will be as follows:

```
http://localhost:3000/time/sse
http://localhost:3000/filesystem/sse
http://localhost:3000/echo/sse
```

- `localhost:3000` - proxy server address and port (default)
- `/time/sse`, `/filesystem/sse`, and `/echo/sse` - paths to corresponding MCP servers that match the keys in the `mcpServers` configuration

## Roadmap

- [x] CORS support
- [x] Streamable HTTP support

## License

MIT
