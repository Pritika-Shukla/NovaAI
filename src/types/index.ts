export interface Interview {
  id: string
  created_at: string
  overall_rating: number | null
  recommendation: string | null
  feedback: string
  transcript: TranscriptMessage[]
  technical_knowledge_score: number | null
  communication_score: number | null
  problem_solving_score: number | null
}

export interface Report {
  id: string
  created_at: string
  overall_rating: number | null
  technical_knowledge_score: number | null
  communication_score: number | null
  problem_solving_score: number | null
  recommendation: string | null
  feedback: string
  transcript: TranscriptMessage[]
  resume_analysis: unknown
}

export interface ResumeData {
  user_id: string
  file_name: string
  file_path: string
  resume_analysis: unknown
  downloadUrl?: string
  created_at?: string
  updated_at?: string
}

export interface Resume {
  id: string
  file_name: string
  file_path: string
  downloadUrl?: string
  created_at?: string
  updated_at?: string
}

export interface UploadResponse {
  resume: ResumeData | null
  error?: string
}

export interface Message {
  role: string
  content: string
}

export interface TranscriptMessage {
  role: string
  content: string
  timestamp?: string
}

export interface AssistantConfig {
  model?: {
    provider?: string
    model?: string
    messages?: Message[]
  }
  [key: string]: unknown
}

export interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export interface HeaderProps {
  onMenuClick: () => void
}

export interface GoogleLoginButtonProps {
  label?: string
  isSignup?: boolean
}

export interface ResumeDisplayProps {
  onUploadNew: () => void
  refreshKey?: number
}

export interface ResumeUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUploadSuccess?: () => void
}

export interface DashboardContentProps {
  activeTab: string
}

export interface VapiWidgetProps {
  apiKey: string
  assistantId: string
  theme?: 'light' | 'dark'
  mode?: 'text' | 'voice'
  assistantConfig?: AssistantConfig
}

export type AuthActionResult = {
  success: boolean
  message?: string
  error?: string
}

export type DivGridProps = {
  className?: string
  rows: number
  cols: number
  cellSize: number
  borderColor: string
  fillColor: string
  clickedCell: { row: number; col: number } | null
  onCellClick?: (row: number, col: number) => void
  interactive?: boolean
}

export type CellStyle = React.CSSProperties & {
  ["--delay"]?: string
  ["--duration"]?: string
}

