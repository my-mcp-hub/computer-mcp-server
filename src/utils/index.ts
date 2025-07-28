import * as os from 'os'
import { execSync } from 'child_process'
import type { ArgumentsCamelCase } from 'yargs'
import type { AppType, OptionsType } from '@/types'

export const getOSType = (() => {
  const platform = os.platform()
  const osType =
    platform === 'darwin' ? 'macOS' : platform === 'win32' ? 'Windows' : platform === 'linux' ? 'Linux' : platform
  return () => osType
})()

export function getOptions(
  argv: ArgumentsCamelCase,
  pkg: {
    name: string
    version: string
    apps: AppType[]
  },
) {
  return {
    name: pkg.name,
    version: pkg.version,
    apps: pkg.apps,
    port: argv.port,
  } as OptionsType
}

export function tryParseJSON(json: string, defaultValue = null) {
  try {
    return JSON.parse(json)
  } catch {
    return defaultValue
  }
}

export function getApps(): AppType[] {
  const osType = getOSType()
  if (osType === 'macOS') {
    const output = execSync('system_profiler SPApplicationsDataType -json', {
      encoding: 'utf8',
      maxBuffer: 1024 * 1024 * 10,
    })

    const data = tryParseJSON(output)
    return (
      data?.SPApplicationsDataType.map((item: any) => {
        return {
          name: item._name,
          version: item.version,
          path: item.path,
        }
      }) || []
    )
  }
  return []
}
