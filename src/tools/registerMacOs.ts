import { z } from 'zod'
import { getOSType } from '@/utils'
import { exec } from 'child_process'
import { promisify } from 'util'
import { setTimeout as sleep } from 'timers/promises'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { OptionsType } from '@/types'

const execPromise = promisify(exec)

export default function register(server: McpServer, options: OptionsType) {
  const openMacOsAppTool = server.registerTool(
    'MacOs Open App',
    {
      title: 'MacOs Open App',
      description: 'MacOs Open App',
      inputSchema: {
        appName: z.string().describe('app name'),
      },
    },
    async ({ appName }) => {
      const { success, data, message } = await openMacOsApp(appName, options)
      await sleep(2000)
      return {
        content: [
          {
            type: 'text',
            text: success ? data! : message!,
          },
        ],
      }
    },
  )

  const findInAppTool = server.registerTool(
    'Find In App',
    {
      title: 'Find In App',
      description: 'Find In App',
      inputSchema: {
        appPath: z.string().describe('app path'),
        keyword: z.string().describe('search keyword'),
      },
    },
    async ({ appPath, keyword }) => {
      await findInApp(appPath, keyword, options)
      await sleep(2000)
      return {
        content: [
          {
            type: 'text',
            text: `find ${keyword} in ${appPath}`,
          },
        ],
      }
    },
  )

  const inputMessageTool = server.registerTool(
    'Input Message',
    {
      title: 'Input Message',
      description: 'Input Message',
      inputSchema: {
        appPath: z.string().describe('app path'),
        message: z.string().describe('input message'),
      },
    },
    async ({ appPath, message }) => {
      await inputMessage(appPath, message, options)
      await sleep(2000)
      return {
        content: [
          {
            type: 'text',
            text: `input ${message} in ${appPath}`,
          },
        ],
      }
    },
  )

  if (getOSType() !== 'macOS') {
    openMacOsAppTool.disable()
    findInAppTool.disable()
    inputMessageTool.disable()
  }
}

export const openMacOsApp = async (appName: string, options: OptionsType) => {
  const app = options.apps.find(item => item.name === appName)
  if (!app) {
    return {
      success: false,
      message: `app ${appName} not found`,
    }
  }
  try {
    await execPromise(`open "${app.path}"`)
  } catch (error) {
    return {
      success: false,
      message: `open app ${app.name} failed: ${(error as Error).message}`,
    }
  }
  return {
    success: true,
    data: `appName: ${app.name}; appVersion: ${app.version}; appPath: ${app.path};`,
  }
}

export const findInApp = async (appPath: string, keyword: string, options: OptionsType) => {
  await execPromise(`osascript -e 'set originalClipboard to the clipboard
set the clipboard to "${keyword}"
tell application "${appPath}"
    activate
    delay 1
    tell application "System Events"
        key code 3 using command down
        delay 1
        key code 0 using command down
        delay 0.2
        key code 9 using command down
        delay 1
        key code 36
    end tell
end tell
set the clipboard to originalClipboard'`)
}

export const inputMessage = async (appPath: string, message: string, options: OptionsType) => {
  await execPromise(`echo '${message}' | pbcopy`)
  await execPromise(`osascript -e 'set originalClipboard to the clipboard
set the clipboard to "${message}"
tell application "${appPath}"
    activate
    tell application "System Events"
        key code 53
        delay 0.3
        key code 0 using command down
        delay 0.2
        key code 9 using command down
        delay 1
        key code 36
    end tell
end tell
set the clipboard to originalClipboard'`)
}
