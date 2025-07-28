export interface OptionsType {
  name: string
  version: string
  port: number
  apps: AppType[]
}

export interface AppType {
  name: string
  version: string
  path: string
}
