# Computer MCP Server

A computer mcp server

## Setup

### Usage
To use with `Desktop APP`, such as Claude, VSCode, [Cline](https://cline.bot/mcp-marketplace), Cherry Studio, Cursor, and so on, add the MCP server config below.

On Mac system:
```json
{
  "mcpServers": {
    "computer-mcp-server": {
      "command": "npx",
      "args": [
        "-y",
        "computer-mcp-server"
      ]
    }
  }
}
```

On Window system:

```json
{
  "mcpServers": {
    "computer-mcp-server": {
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "-y",
        "computer-mcp-server"
      ]
    }
  }
}
```

## License
[MIT](LICENSE)
