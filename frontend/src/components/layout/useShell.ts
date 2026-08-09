import { useOutletContext } from 'react-router-dom'
import type { ShellContext } from './AppShell'

export function useShell(): ShellContext {
  return useOutletContext<ShellContext>()
}