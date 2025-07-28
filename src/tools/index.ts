import registerGetData from './registerGetData'
import registerMacOs from './registerMacOs'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { OptionsType } from '@/types'

export const registerTools = (server: McpServer, options: OptionsType) => {
  registerGetData(server, options)
  registerMacOs(server, options)
}
