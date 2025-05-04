[![npm](https://img.shields.io/npm/v/mcp-simple-gateway)](https://www.npmjs.com/package/mcp-simple-gateway)

# MCP Simple Gateway

MCP Simple Gateway is a proxy server for Model Context Protocol (MCP) that allows you to aggregate and manage multiple MCP servers through a single interface.

## Key Features

- 🚀 Aggregation of multiple MCP servers
- 🔒 Token-based authentication support
- 📝 Flexible JSON-based configuration
- 🐳 Docker support
- 🔌 SSE and stdio MCP supported

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
    "options": {
      "logLevel": "debug",
      "logPretty": true,
      "authTokens": ["your-auth-token"]
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
    }
  }
}
```

### Configuration Parameters

- `proxyServer.options`:

  - `logLevel`: Logging level (debug, info, warn, error)
  - `logPretty`: Log formatting
  - `authTokens`: Array of authentication tokens (used as default for all servers)

- `mcpServers`: MCP servers configuration
  - `[serverName]`:
    - `command`: Command to start the server
    - `args`: Command arguments
    - `proxyOptions`: Proxy options for a specific server
      - `authTokens`: Array of authentication tokens (overrides `proxyServer.options.authTokens` for the specific server)

Based on the configuration above, the URLs for accessing MCP servers will be as follows:

```
http://localhost:3000/time/sse
http://localhost:3000/filesystem/sse
```

- `localhost:3000` - proxy server address and port (default)
- `/time/sse` and `/filesystem/sse` - paths to corresponding MCP servers that match the keys in the `mcpServers` configuration

## Roadmap

- [ ] CORS support
- [ ] Streamable HTTP support

## License

MIT
