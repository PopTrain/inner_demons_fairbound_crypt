export interface DatabaseAPI {
    selectRepoPath: () => Promise<{ success: boolean; path?: string; hasGameFolder?: boolean }>
    loadDatabase: (entityType: string) => Promise<any>
    saveDatabase: (entityType: string, data: any) => Promise<boolean>
  }
  
  declare global {
    interface Window {
      api: DatabaseAPI
    }
  }