'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { 
  Play, 
  Users, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Plus,
  Trash2,
  Settings,
  Zap,
  GitBranch,
  Mail,
  UserCheck,
  Bot,
  ChevronDown,
  ChevronRight,
  GripVertical,
  MoreHorizontal,
  Save,
  Eye,
  X,
  ArrowLeft,
  Undo2,
  Redo2,
  HelpCircle,
  Lightbulb,
  Copy,
  Sparkles,
  MousePointer2,
  Info,
  Check,
  AlertTriangle,
  Layers,
  ZoomIn,
  ZoomOut
} from 'lucide-react'

// Types
interface WorkflowDocument {
  id: number
  name: string
  status: 'draft' | 'pending' | 'in_progress' | 'completed' | 'declined' | 'expired'
  type: string
  createdAt: string
  folder: string
  size: string
}

interface WorkflowNode {
  id: string
  type: 'trigger' | 'signer' | 'condition' | 'action' | 'ai-review' | 'notification' | 'end'
  position: { x: number; y: number }
  data: NodeData
  connections: string[]
  validated?: boolean
  errors?: string[]
}

interface NodeData {
  label: string
  description?: string
  config?: Record<string, any>
}

interface SignerConfig {
  name: string
  email: string
  role: string
  order: number
  deadline: number
  reminderDays: number
  required: boolean
}

interface WorkflowConfig {
  id: string
  name: string
  description: string
  status: 'draft' | 'active' | 'paused'
  tags: string[]
  autoRun: boolean
  timeout: number
  retryAttempts: number
  stopOnError: boolean
  nodes: WorkflowNode[]
  selectedDocuments: WorkflowDocument[]
  createdAt: string
  updatedAt: string
}

interface HistoryState {
  nodes: WorkflowNode[]
  name: string
}

// Workflow Templates
const workflowTemplates = [
  {
    id: 'simple-approval',
    name: 'Simple Approval',
    description: 'Single signer approval flow',
    icon: UserCheck,
    signers: 1,
    preview: '1 signer → Complete'
  },
  {
    id: 'two-party',
    name: 'Two-Party Agreement',
    description: 'Both parties sign in sequence',
    icon: Users,
    signers: 2,
    preview: 'Party A → Party B → Complete'
  },
  {
    id: 'manager-approval',
    name: 'Manager Approval Chain',
    description: 'Employee → Manager → Director',
    icon: GitBranch,
    signers: 3,
    preview: 'Employee → Manager → Director'
  },
  {
    id: 'parallel-review',
    name: 'Parallel Review',
    description: 'Multiple reviewers sign simultaneously',
    icon: Layers,
    signers: 3,
    preview: '3 Signers (parallel) → Complete'
  }
]

// Template generator
const generateTemplateNodes = (templateId: string): WorkflowNode[] => {
  const baseNodes: WorkflowNode[] = [
    {
      id: 'trigger-1',
      type: 'trigger',
      position: { x: 400, y: 50 },
      data: {
        label: 'Document Uploaded',
        description: 'Workflow starts when document is uploaded',
        config: { event: 'document-uploaded' }
      },
      connections: ['signer-1'],
      validated: true
    }
  ]

  switch (templateId) {
    case 'simple-approval':
      return [
        ...baseNodes,
        {
          id: 'signer-1',
          type: 'signer',
          position: { x: 400, y: 180 },
          data: {
            label: 'Approver',
            description: 'Document approval',
            config: { name: '', email: '', role: 'approver', order: 1, deadline: 48, reminderDays: 1, required: true }
          },
          connections: ['end-1'],
          validated: false
        },
        {
          id: 'end-1',
          type: 'end',
          position: { x: 400, y: 310 },
          data: { label: 'Complete', description: 'Approval received' },
          connections: [],
          validated: true
        }
      ]
    
    case 'two-party':
      baseNodes[0].connections = ['signer-1']
      return [
        ...baseNodes,
        {
          id: 'signer-1',
          type: 'signer',
          position: { x: 400, y: 180 },
          data: {
            label: 'Party A',
            description: 'First party signature',
            config: { name: '', email: '', role: 'party', order: 1, deadline: 72, reminderDays: 2, required: true }
          },
          connections: ['signer-2'],
          validated: false
        },
        {
          id: 'signer-2',
          type: 'signer',
          position: { x: 400, y: 310 },
          data: {
            label: 'Party B',
            description: 'Second party signature',
            config: { name: '', email: '', role: 'party', order: 2, deadline: 72, reminderDays: 2, required: true }
          },
          connections: ['end-1'],
          validated: false
        },
        {
          id: 'end-1',
          type: 'end',
          position: { x: 400, y: 440 },
          data: { label: 'Agreement Complete', description: 'Both parties have signed' },
          connections: [],
          validated: true
        }
      ]

    case 'manager-approval':
      baseNodes[0].connections = ['signer-1']
      return [
        ...baseNodes,
        {
          id: 'signer-1',
          type: 'signer',
          position: { x: 400, y: 180 },
          data: {
            label: 'Employee',
            description: 'Initial submission',
            config: { name: '', email: '', role: 'employee', order: 1, deadline: 24, reminderDays: 1, required: true }
          },
          connections: ['signer-2'],
          validated: false
        },
        {
          id: 'signer-2',
          type: 'signer',
          position: { x: 400, y: 310 },
          data: {
            label: 'Manager',
            description: 'Manager approval',
            config: { name: '', email: '', role: 'manager', order: 2, deadline: 48, reminderDays: 1, required: true }
          },
          connections: ['signer-3'],
          validated: false
        },
        {
          id: 'signer-3',
          type: 'signer',
          position: { x: 400, y: 440 },
          data: {
            label: 'Director',
            description: 'Final approval',
            config: { name: '', email: '', role: 'director', order: 3, deadline: 72, reminderDays: 2, required: true }
          },
          connections: ['end-1'],
          validated: false
        },
        {
          id: 'end-1',
          type: 'end',
          position: { x: 400, y: 570 },
          data: { label: 'Approved', description: 'All approvals received' },
          connections: [],
          validated: true
        }
      ]

    case 'parallel-review':
      return [
        {
          ...baseNodes[0],
          connections: ['signer-1', 'signer-2', 'signer-3']
        },
        {
          id: 'signer-1',
          type: 'signer',
          position: { x: 200, y: 180 },
          data: {
            label: 'Reviewer 1',
            description: 'First reviewer',
            config: { name: '', email: '', role: 'reviewer', order: 1, deadline: 48, reminderDays: 1, required: true }
          },
          connections: ['end-1'],
          validated: false
        },
        {
          id: 'signer-2',
          type: 'signer',
          position: { x: 400, y: 180 },
          data: {
            label: 'Reviewer 2',
            description: 'Second reviewer',
            config: { name: '', email: '', role: 'reviewer', order: 1, deadline: 48, reminderDays: 1, required: true }
          },
          connections: ['end-1'],
          validated: false
        },
        {
          id: 'signer-3',
          type: 'signer',
          position: { x: 600, y: 180 },
          data: {
            label: 'Reviewer 3',
            description: 'Third reviewer',
            config: { name: '', email: '', role: 'reviewer', order: 1, deadline: 48, reminderDays: 1, required: true }
          },
          connections: ['end-1'],
          validated: false
        },
        {
          id: 'end-1',
          type: 'end',
          position: { x: 400, y: 340 },
          data: { label: 'Review Complete', description: 'All reviews submitted' },
          connections: [],
          validated: true
        }
      ]

    default:
      return baseNodes
  }
}

// Sample documents available for workflows
const availableDocuments: WorkflowDocument[] = [
  {
    id: 1,
    name: 'Employment Agreement - John Smith',
    status: 'draft',
    type: 'Contract',
    createdAt: '2026-02-15',
    folder: 'HR Documents',
    size: '245 KB',
  },
  {
    id: 2,
    name: 'NDA - Acme Corporation',
    status: 'draft',
    type: 'NDA',
    createdAt: '2026-02-28',
    folder: 'Legal',
    size: '156 KB',
  },
  {
    id: 3,
    name: 'Service Agreement - Project Alpha',
    status: 'draft',
    type: 'Agreement',
    createdAt: '2026-03-01',
    folder: 'Projects',
    size: '512 KB',
  },
  {
    id: 4,
    name: 'Vendor Contract - Supplies Co',
    status: 'draft',
    type: 'Contract',
    createdAt: '2026-03-03',
    folder: 'Procurement',
    size: '89 KB',
  },
  {
    id: 5,
    name: 'Partnership Agreement - TechStart',
    status: 'draft',
    type: 'Agreement',
    createdAt: '2026-02-10',
    folder: 'Partnerships',
    size: '320 KB',
  },
  {
    id: 6,
    name: 'Lease Agreement - Office Space',
    status: 'draft',
    type: 'Lease',
    createdAt: '2026-01-15',
    folder: 'Facilities',
    size: '412 KB',
  },
]

// Default workflow
const createDefaultWorkflow = (): WorkflowConfig => ({
  id: 'wf-' + Date.now(),
  name: '',
  description: '',
  status: 'draft',
  tags: ['signature'],
  autoRun: true,
  timeout: 86400000,
  retryAttempts: 3,
  stopOnError: false,
  nodes: [],
  selectedDocuments: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
})

interface SignatureWorkflowBuilderProps {
  documentId?: string
  documentName?: string
  onSave?: (workflow: WorkflowConfig) => void
  onPublish?: (workflow: WorkflowConfig) => void
  onClose?: () => void
  initialWorkflow?: WorkflowConfig
}

export function SignatureWorkflowBuilder({ 
  documentId, 
  documentName = 'Untitled Document',
  onSave,
  onPublish,
  onClose,
  initialWorkflow
}: SignatureWorkflowBuilderProps) {
  // State
  const [workflow, setWorkflow] = useState<WorkflowConfig>(initialWorkflow || createDefaultWorkflow())
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null)
  const [showTemplates, setShowTemplates] = useState(!initialWorkflow && workflow.nodes.length === 0)
  const [zoom, setZoom] = useState(1)
  const [showHelp, setShowHelp] = useState(false)
  const [activeTab, setActiveTab] = useState<'properties' | 'settings'>('properties')
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showDocumentPicker, setShowDocumentPicker] = useState(false)
  const [documentSearchQuery, setDocumentSearchQuery] = useState('')
  const [sidebarTab, setSidebarTab] = useState<'steps' | 'documents'>('steps')
  
  // History for undo/redo
  const [history, setHistory] = useState<HistoryState[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  
  // Drag state
  const [draggingNode, setDraggingNode] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  
  const canvasRef = useRef<HTMLDivElement>(null)

  // Pre-select document when documentId is provided via URL params
  useEffect(() => {
    if (documentId && documentName) {
      const docIdNum = parseInt(documentId)
      const selectedDoc = availableDocuments.find(d => d.id === docIdNum)
      if (selectedDoc) {
        setWorkflow(prev => ({
          ...prev,
          selectedDocuments: [selectedDoc]
        }))
        setSidebarTab('documents')
      } else {
        // Document not in available list, create a placeholder
        const newDoc: WorkflowDocument = {
          id: docIdNum,
          name: documentName,
          status: 'draft',
          type: 'Document',
          createdAt: new Date().toISOString().split('T')[0],
          folder: 'Documents',
          size: '0 KB'
        }
        setWorkflow(prev => ({
          ...prev,
          selectedDocuments: [newDoc]
        }))
        setSidebarTab('documents')
      }
    }
  }, [documentId, documentName])

  // Node type configurations
  const nodeTypes = {
    trigger: { icon: Zap, color: 'bg-emerald-500', borderColor: 'border-emerald-500', bgLight: 'bg-emerald-50' },
    signer: { icon: UserCheck, color: 'bg-blue-500', borderColor: 'border-blue-500', bgLight: 'bg-blue-50' },
    condition: { icon: GitBranch, color: 'bg-amber-500', borderColor: 'border-amber-500', bgLight: 'bg-amber-50' },
    action: { icon: Play, color: 'bg-purple-500', borderColor: 'border-purple-500', bgLight: 'bg-purple-50' },
    'ai-review': { icon: Bot, color: 'bg-pink-500', borderColor: 'border-pink-500', bgLight: 'bg-pink-50' },
    notification: { icon: Mail, color: 'bg-orange-500', borderColor: 'border-orange-500', bgLight: 'bg-orange-50' },
    end: { icon: CheckCircle2, color: 'bg-gray-500', borderColor: 'border-gray-500', bgLight: 'bg-gray-50' }
  }

  // Save history state
  const saveHistory = useCallback((nodes: WorkflowNode[], name: string) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push({ nodes: JSON.parse(JSON.stringify(nodes)), name })
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
    setCanUndo(newHistory.length > 1)
    setCanRedo(false)
  }, [history, historyIndex])

  // Undo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setWorkflow(prev => ({ ...prev, nodes: JSON.parse(JSON.stringify(history[newIndex].nodes)) }))
      setCanUndo(newIndex > 0)
      setCanRedo(true)
    }
  }, [history, historyIndex])

  // Redo
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setWorkflow(prev => ({ ...prev, nodes: JSON.parse(JSON.stringify(history[newIndex].nodes)) }))
      setCanUndo(true)
      setCanRedo(newIndex < history.length - 1)
    }
  }, [history, historyIndex])

  // Handle save - define before keyboard shortcuts
  const handleSave = useCallback(async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    const updatedWorkflow = { ...workflow, updatedAt: new Date().toISOString() }
    localStorage.setItem(`workflow-${workflow.id}`, JSON.stringify(updatedWorkflow))
    onSave?.(updatedWorkflow)
    setIsSaving(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 2000)
  }, [workflow, onSave])

  // Delete node - define before keyboard shortcuts
  const deleteNode = useCallback((nodeId: string) => {
    const nodeToDelete = workflow.nodes.find(n => n.id === nodeId)
    if (!nodeToDelete || nodeToDelete.type === 'trigger' || nodeToDelete.type === 'end') return

    const newNodes = workflow.nodes.filter(n => n.id !== nodeId)
    
    // Reconnect nodes
    newNodes.forEach(node => {
      if (node.connections.includes(nodeId)) {
        node.connections = nodeToDelete.connections
      }
    })

    // Reposition remaining nodes
    let yPos = 50
    newNodes.forEach(node => {
      node.position.y = yPos
      yPos += 130
    })

    setWorkflow(prev => ({ ...prev, nodes: newNodes, updatedAt: new Date().toISOString() }))
    saveHistory(newNodes, workflow.name)
    setSelectedNode(null)
  }, [workflow, saveHistory])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault()
        if (e.shiftKey) {
          handleRedo()
        } else {
          handleUndo()
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
      if (e.key === 'Escape') {
        setSelectedNode(null)
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNode && selectedNode.type !== 'trigger' && selectedNode.type !== 'end') {
          deleteNode(selectedNode.id)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleUndo, handleRedo, handleSave, selectedNode, deleteNode])

  // Select template
  const selectTemplate = (templateId: string) => {
    const nodes = generateTemplateNodes(templateId)
    const template = workflowTemplates.find(t => t.id === templateId)
    setWorkflow(prev => ({
      ...prev,
      name: template?.name || 'Untitled Workflow',
      nodes
    }))
    saveHistory(nodes, workflow.name)
    setShowTemplates(false)
  }

  // Start from scratch
  const startFromScratch = () => {
    const nodes = generateTemplateNodes('simple-approval')
    setWorkflow(prev => ({
      ...prev,
      name: 'Custom Workflow',
      nodes
    }))
    saveHistory(nodes, 'Custom Workflow')
    setShowTemplates(false)
  }

  // Add a new node
  const addNode = useCallback((type: WorkflowNode['type']) => {
    const endNode = workflow.nodes.find(n => n.type === 'end')
    
    const newNode: WorkflowNode = {
      id: `${type}-${Date.now()}`,
      type,
      position: { 
        x: 400, 
        y: endNode ? endNode.position.y : 180
      },
      data: {
        label: type === 'signer' ? `Signer ${workflow.nodes.filter(n => n.type === 'signer').length + 1}` :
               type === 'condition' ? 'Condition' :
               type === 'action' ? 'Action' :
               type === 'ai-review' ? 'AI Review' :
               type === 'notification' ? 'Send Notification' : 'Node',
        config: type === 'signer' ? {
          name: '',
          email: '',
          role: 'signer',
          order: workflow.nodes.filter(n => n.type === 'signer').length + 1,
          deadline: 48,
          reminderDays: 1,
          required: true
        } : {}
      },
      connections: [],
      validated: false
    }

    // Insert before end node and reconnect
    const endNodeIndex = workflow.nodes.findIndex(n => n.type === 'end')
    const newNodes = [...workflow.nodes]
    
    if (endNodeIndex > 0) {
      const prevNode = newNodes[endNodeIndex - 1]
      prevNode.connections = [newNode.id]
      newNode.connections = [workflow.nodes[endNodeIndex].id]
      newNodes[endNodeIndex].position.y += 130
      newNodes.splice(endNodeIndex, 0, newNode)
    } else {
      newNodes.push(newNode)
    }

    setWorkflow(prev => ({ ...prev, nodes: newNodes, updatedAt: new Date().toISOString() }))
    saveHistory(newNodes, workflow.name)
    setSelectedNode(newNode)
  }, [workflow, saveHistory])

  // Duplicate node
  const duplicateNode = useCallback((nodeId: string) => {
    const nodeToDuplicate = workflow.nodes.find(n => n.id === nodeId)
    if (!nodeToDuplicate || nodeToDuplicate.type === 'trigger' || nodeToDuplicate.type === 'end') return

    const newNode: WorkflowNode = {
      ...JSON.parse(JSON.stringify(nodeToDuplicate)),
      id: `${nodeToDuplicate.type}-${Date.now()}`,
      position: { x: nodeToDuplicate.position.x + 20, y: nodeToDuplicate.position.y + 20 },
      data: {
        ...nodeToDuplicate.data,
        label: `${nodeToDuplicate.data.label} (Copy)`
      },
      validated: false
    }

    const newNodes = [...workflow.nodes, newNode]
    setWorkflow(prev => ({ ...prev, nodes: newNodes }))
    saveHistory(newNodes, workflow.name)
    setSelectedNode(newNode)
  }, [workflow, saveHistory])

  // Update node data
  const updateNodeData = useCallback((nodeId: string, data: Partial<NodeData>) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.map(node => 
        node.id === nodeId 
          ? { ...node, data: { ...node.data, ...data } }
          : node
      ),
      updatedAt: new Date().toISOString()
    }))
  }, [])

  // Update node config
  const updateNodeConfig = useCallback((nodeId: string, config: Record<string, any>) => {
    const newNodes = workflow.nodes.map(node => 
      node.id === nodeId 
        ? { 
            ...node, 
            data: { ...node.data, config: { ...node.data.config, ...config } },
            validated: !!(config.name && config.email)
          }
        : node
    )
    
    setWorkflow(prev => ({ ...prev, nodes: newNodes, updatedAt: new Date().toISOString() }))
    
    if (selectedNode?.id === nodeId) {
      setSelectedNode(prev => prev ? {
        ...prev,
        data: { ...prev.data, config: { ...prev.data.config, ...config } },
        validated: !!(config.name && config.email)
      } : null)
    }
  }, [selectedNode, workflow.nodes])

  // Validate workflow
  const validateWorkflow = useCallback(() => {
    const signerNodes = workflow.nodes.filter(n => n.type === 'signer')
    const invalidSigners = signerNodes.filter(n => {
      const config = n.data.config as SignerConfig
      return !config?.name || !config?.email
    })
    return {
      isValid: invalidSigners.length === 0 && workflow.name.trim() !== '' && workflow.selectedDocuments.length > 0,
      errors: [
        ...(!workflow.name.trim() ? ['Workflow name is required'] : []),
        ...(workflow.selectedDocuments.length === 0 ? ['At least one document must be selected'] : []),
        ...invalidSigners.map(n => `${n.data.label}: Name and email required`)
      ]
    }
  }, [workflow])

  // Handle publish
  const handlePublish = () => {
    const validation = validateWorkflow()
    if (!validation.isValid) {
      alert('Please fix the following errors:\n\n' + validation.errors.join('\n'))
      return
    }
    
    const publishedWorkflow = { ...workflow, status: 'active' as const, updatedAt: new Date().toISOString() }
    localStorage.setItem(`workflow-${workflow.id}`, JSON.stringify(publishedWorkflow))
    setWorkflow(publishedWorkflow)
    onPublish?.(publishedWorkflow)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 2000)
  }

  // Get workflow completion percentage
  const getCompletionPercentage = () => {
    let totalSteps = 3 // name, documents, signers
    let completedSteps = 0
    
    // Check workflow name
    if (workflow.name.trim() !== '') completedSteps++
    
    // Check documents selected
    if (workflow.selectedDocuments.length > 0) completedSteps++
    
    // Check signers
    const signerNodes = workflow.nodes.filter(n => n.type === 'signer')
    if (signerNodes.length > 0) {
      const validSigners = signerNodes.filter(n => {
        const config = n.data.config as SignerConfig
        return config?.name && config?.email
      })
      if (validSigners.length === signerNodes.length) completedSteps++
    }
    
    return Math.round((completedSteps / totalSteps) * 100)
  }

  // Drag handlers
  const handleDragStart = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.preventDefault()
    e.stopPropagation()
    const node = workflow.nodes.find(n => n.id === nodeId)
    if (!node) return
    
    const canvasRect = canvasRef.current?.getBoundingClientRect()
    if (!canvasRect) return
    
    const scrollLeft = canvasRef.current?.scrollLeft || 0
    const scrollTop = canvasRef.current?.scrollTop || 0
    
    setDraggingNode(nodeId)
    setIsDragging(true)
    setDragOffset({
      x: (e.clientX - canvasRect.left + scrollLeft) / zoom - node.position.x,
      y: (e.clientY - canvasRect.top + scrollTop) / zoom - node.position.y
    })
  }, [workflow.nodes, zoom])

  const handleDrag = useCallback((e: MouseEvent) => {
    if (!draggingNode || !canvasRef.current) return
    
    const canvasRect = canvasRef.current.getBoundingClientRect()
    const scrollLeft = canvasRef.current.scrollLeft || 0
    const scrollTop = canvasRef.current.scrollTop || 0
    
    const newX = Math.max(0, (e.clientX - canvasRect.left + scrollLeft) / zoom - dragOffset.x)
    const newY = Math.max(0, (e.clientY - canvasRect.top + scrollTop) / zoom - dragOffset.y)
    
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.map(node =>
        node.id === draggingNode
          ? { ...node, position: { x: newX, y: newY } }
          : node
      )
    }))
  }, [draggingNode, dragOffset, zoom])

  const handleDragEnd = useCallback(() => {
    if (draggingNode) {
      saveHistory(workflow.nodes, workflow.name)
    }
    setDraggingNode(null)
    setIsDragging(false)
  }, [draggingNode, workflow.nodes, workflow.name, saveHistory])

  // Global mouse event listeners for drag
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDrag)
      window.addEventListener('mouseup', handleDragEnd)
      return () => {
        window.removeEventListener('mousemove', handleDrag)
        window.removeEventListener('mouseup', handleDragEnd)
      }
    }
  }, [isDragging, handleDrag, handleDragEnd])

  // Render connection lines with better styling
  const renderConnections = () => {
    const lines: JSX.Element[] = []
    
    workflow.nodes.forEach(node => {
      node.connections.forEach(targetId => {
        const targetNode = workflow.nodes.find(n => n.id === targetId)
        if (!targetNode) return

        const startX = node.position.x + 140
        const startY = node.position.y + 80
        const endX = targetNode.position.x + 140
        const endY = targetNode.position.y

        const midY = (startY + endY) / 2
        const path = `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`

        lines.push(
          <svg key={`${node.id}-${targetId}`} className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id={`gradient-${node.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            <path
              d={path}
              fill="none"
              stroke={`url(#gradient-${node.id})`}
              strokeWidth="2"
              className="transition-all duration-300"
            />
            {/* Arrow head */}
            <polygon 
              points={`${endX},${endY} ${endX-6},${endY-10} ${endX+6},${endY-10}`}
              fill="#8b5cf6"
              className="transition-all duration-300"
            />
          </svg>
        )
      })
    })

    return lines
  }

  // Template Selection Screen
  if (showTemplates) {
    return (
      <div className="h-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-8 relative">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
              <Sparkles size={16} />
              New Workflow
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              How would you like to start?
            </h1>
            <p className="text-gray-600 text-lg">
              Choose a template or create your own custom workflow
            </p>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {workflowTemplates.map(template => {
              const Icon = template.icon
              return (
                <button
                  key={template.id}
                  onClick={() => selectTemplate(template.id)}
                  className="group bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-indigo-500 hover:shadow-lg transition-all duration-200 text-left"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-100 group-hover:bg-indigo-500 flex items-center justify-center transition-colors">
                      <Icon size={24} className="text-indigo-600 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">{template.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                          <Users size={12} />
                          {template.signers} {template.signers === 1 ? 'signer' : 'signers'}
                        </span>
                        <span className="text-xs text-gray-400">{template.preview}</span>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-300 group-hover:text-indigo-500 transition-colors mt-1" />
                  </div>
                </button>
              )
            })}
          </div>

          {/* Start from scratch */}
          <div className="text-center">
            <button
              onClick={startFromScratch}
              className="inline-flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-indigo-600 font-medium transition-colors"
            >
              <Plus size={18} />
              Start from scratch
            </button>
          </div>
        </div>

        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition"
          >
            <ArrowLeft size={18} />
            <span className="font-medium">Back</span>
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="flex h-full bg-slate-50">
      {/* Left Sidebar - Node Library */}
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        {/* Sidebar Header with Tabs */}
        <div className="p-4 border-b border-gray-100">
          {/* Tab Switcher */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg mb-3">
            <button
              onClick={() => setSidebarTab('steps')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                sidebarTab === 'steps' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Steps
            </button>
            <button
              onClick={() => setSidebarTab('documents')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                sidebarTab === 'documents' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Documents
              {workflow.selectedDocuments.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center">
                  {workflow.selectedDocuments.length}
                </span>
              )}
            </button>
          </div>

          {sidebarTab === 'steps' && (
            <>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Workflow Steps</h3>
                <button 
                  onClick={() => setShowHelp(!showHelp)}
                  className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                >
                  <HelpCircle size={18} />
                </button>
              </div>
              
              {/* Quick Tips */}
              {showHelp && (
                <div className="p-3 bg-indigo-50 rounded-lg mb-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Lightbulb size={16} className="text-indigo-600 mt-0.5" />
                    <div>
                      <p className="text-indigo-900 font-medium">Quick Tips</p>
                      <ul className="text-indigo-700 mt-1 space-y-1 text-xs">
                        <li>• Drag nodes by the grip handle</li>
                        <li>• Click a step below to add it</li>
                        <li>• Ctrl+Z to undo, Ctrl+S to save</li>
                        <li>• Delete key removes selected node</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Completion Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Setup Progress</span>
                  <span className="font-semibold text-gray-900">{getCompletionPercentage()}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${getCompletionPercentage()}%` }}
                  />
                </div>
              </div>
            </>
          )}

          {sidebarTab === 'documents' && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Select Documents</h3>
              <p className="text-xs text-gray-500">Choose documents to include in this workflow</p>
            </div>
          )}
        </div>
        
        {/* Sidebar Content based on Tab */}
        {sidebarTab === 'steps' && (
          <>
            {/* Node Types */}
            <div className="flex-1 overflow-y-auto p-4">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Add Steps</p>
          
          <div className="space-y-2">
            {/* Signer Node */}
            <button
              onClick={() => addNode('signer')}
              className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-gray-100 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <UserCheck size={18} className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900 text-sm">Add Signer</p>
                <p className="text-xs text-gray-500">Request a signature</p>
              </div>
              <Plus size={16} className="text-gray-300 group-hover:text-blue-500" />
            </button>

            {/* Condition Node */}
            <button
              onClick={() => addNode('condition')}
              className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-gray-100 hover:border-amber-300 hover:bg-amber-50/50 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <GitBranch size={18} className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900 text-sm">Condition</p>
                <p className="text-xs text-gray-500">Add decision logic</p>
              </div>
              <Plus size={16} className="text-gray-300 group-hover:text-amber-500" />
            </button>

            {/* AI Review Node */}
            <button
              onClick={() => addNode('ai-review')}
              className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-gray-100 hover:border-pink-300 hover:bg-pink-50/50 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <Bot size={18} className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900 text-sm">AI Review</p>
                <p className="text-xs text-gray-500">Auto-analyze document</p>
              </div>
              <Plus size={16} className="text-gray-300 group-hover:text-pink-500" />
            </button>

            {/* Notification Node */}
            <button
              onClick={() => addNode('notification')}
              className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-gray-100 hover:border-orange-300 hover:bg-orange-50/50 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <Mail size={18} className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900 text-sm">Notification</p>
                <p className="text-xs text-gray-500">Send email or alert</p>
              </div>
              <Plus size={16} className="text-gray-300 group-hover:text-orange-500" />
            </button>

            {/* Action Node */}
            <button
              onClick={() => addNode('action')}
              className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-gray-100 hover:border-purple-300 hover:bg-purple-50/50 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <Play size={18} className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900 text-sm">Action</p>
                <p className="text-xs text-gray-500">Custom automation</p>
              </div>
              <Plus size={16} className="text-gray-300 group-hover:text-purple-500" />
            </button>
          </div>
            </div>
          </>
        )}

        {/* Documents Tab Content */}
        {sidebarTab === 'documents' && (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              {/* Search Documents */}
              <div className="relative mb-4">
                <input
                  type="text"
                  value={documentSearchQuery}
                  onChange={(e) => setDocumentSearchQuery(e.target.value)}
                  placeholder="Search documents..."
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Selected Documents */}
              {workflow.selectedDocuments.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Selected ({workflow.selectedDocuments.length})</p>
                  <div className="space-y-2">
                    {workflow.selectedDocuments.map(doc => (
                      <div 
                        key={doc.id}
                        className="flex items-center gap-3 p-3 bg-indigo-50 border-2 border-indigo-200 rounded-xl"
                      >
                        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
                          <FileText size={14} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                          <p className="text-xs text-gray-500">{doc.type} • {doc.size}</p>
                        </div>
                        <button
                          onClick={() => {
                            setWorkflow(prev => ({
                              ...prev,
                              selectedDocuments: prev.selectedDocuments.filter(d => d.id !== doc.id)
                            }))
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Documents */}
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Available Documents</p>
              <div className="space-y-2">
                {availableDocuments
                  .filter(doc => 
                    !workflow.selectedDocuments.find(d => d.id === doc.id) &&
                    (documentSearchQuery === '' || 
                     doc.name.toLowerCase().includes(documentSearchQuery.toLowerCase()) ||
                     doc.type.toLowerCase().includes(documentSearchQuery.toLowerCase()) ||
                     doc.folder.toLowerCase().includes(documentSearchQuery.toLowerCase()))
                  )
                  .map(doc => (
                    <button
                      key={doc.id}
                      onClick={() => {
                        setWorkflow(prev => ({
                          ...prev,
                          selectedDocuments: [...prev.selectedDocuments, doc]
                        }))
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-gray-100 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all group text-left"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-indigo-500 flex items-center justify-center transition-colors">
                        <FileText size={14} className="text-gray-500 group-hover:text-white transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.type} • {doc.folder}</p>
                      </div>
                      <Plus size={16} className="text-gray-300 group-hover:text-indigo-500" />
                    </button>
                  ))}
                
                {availableDocuments.filter(doc => 
                  !workflow.selectedDocuments.find(d => d.id === doc.id) &&
                  (documentSearchQuery === '' || 
                   doc.name.toLowerCase().includes(documentSearchQuery.toLowerCase()))
                ).length === 0 && (
                  <div className="text-center py-6 text-gray-400">
                    <FileText size={24} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No documents found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Documents Stats Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
              <div className="text-center p-3 bg-white rounded-lg border border-gray-100">
                <p className="text-2xl font-bold text-gray-900">
                  {workflow.selectedDocuments.length}
                </p>
                <p className="text-xs text-gray-500">Documents Selected</p>
              </div>
            </div>
          </>
        )}

        {sidebarTab === 'steps' && (
          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-white rounded-lg border border-gray-100">
                <p className="text-2xl font-bold text-gray-900">
                  {workflow.nodes.filter(n => n.type === 'signer').length}
                </p>
                <p className="text-xs text-gray-500">Signers</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-gray-100">
                <p className="text-2xl font-bold text-gray-900">{workflow.nodes.length}</p>
                <p className="text-xs text-gray-500">Total Steps</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Back Button */}
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft size={18} />
              <span className="text-sm font-medium">Back</span>
            </button>
            
            <div className="w-px h-8 bg-gray-200" />
            
            {/* Workflow Name */}
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={workflow.name}
                onChange={(e) => setWorkflow(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Workflow name..."
                className="text-lg font-semibold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-2 py-1 w-64"
              />
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                workflow.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                workflow.status === 'paused' ? 'bg-amber-100 text-amber-700' :
                'bg-gray-100 text-gray-600'
              }`}>
                {workflow.status === 'active' ? '● Active' : workflow.status === 'paused' ? '◐ Paused' : '○ Draft'}
              </span>
              {workflow.selectedDocuments.length > 0 && (
                <button
                  onClick={() => setSidebarTab('documents')}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold hover:bg-indigo-200 transition"
                >
                  <FileText size={12} />
                  {workflow.selectedDocuments.length} {workflow.selectedDocuments.length === 1 ? 'Document' : 'Documents'}
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Undo/Redo */}
            <div className="flex items-center gap-1 mr-2">
              <button
                onClick={handleUndo}
                disabled={!canUndo}
                className={`p-2 rounded-lg transition ${canUndo ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'}`}
                title="Undo (Ctrl+Z)"
              >
                <Undo2 size={18} />
              </button>
              <button
                onClick={handleRedo}
                disabled={!canRedo}
                className={`p-2 rounded-lg transition ${canRedo ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'}`}
                title="Redo (Ctrl+Shift+Z)"
              >
                <Redo2 size={18} />
              </button>
            </div>

            <div className="w-px h-8 bg-gray-200" />

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 mx-2">
              <button
                onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
                className="p-1.5 text-gray-600 hover:bg-white rounded transition"
              >
                <ZoomOut size={16} />
              </button>
              <span className="text-xs font-medium text-gray-600 w-12 text-center">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom(z => Math.min(1.5, z + 0.1))}
                className="p-1.5 text-gray-600 hover:bg-white rounded transition"
              >
                <ZoomIn size={16} />
              </button>
            </div>

            <div className="w-px h-8 bg-gray-200" />

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : showSuccess ? (
                <Check size={16} className="text-emerald-500" />
              ) : (
                <Save size={16} />
              )}
              <span className="text-sm font-medium">{showSuccess ? 'Saved!' : 'Save'}</span>
            </button>

            {/* Publish Button */}
            <button
              onClick={handlePublish}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-sm"
            >
              <Zap size={16} />
              <span className="text-sm font-medium">Publish</span>
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div 
          ref={canvasRef}
          className="flex-1 relative overflow-auto"
          style={{ 
            background: 'radial-gradient(circle, #e2e8f0 1px, transparent 1px)', 
            backgroundSize: '24px 24px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedNode(null)
          }}
        >
          <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', minWidth: '100%', minHeight: '100%' }}>
            {/* Connection Lines */}
            {renderConnections()}

            {/* Nodes */}
            {workflow.nodes.map(node => {
              const nodeType = nodeTypes[node.type]
              const Icon = nodeType.icon
              const isSelected = selectedNode?.id === node.id
              const isInvalid = node.type === 'signer' && !(node.data.config as SignerConfig)?.email

              return (
                <div
                  key={node.id}
                  onClick={(e) => {
                    if (!isDragging) {
                      e.stopPropagation()
                      setSelectedNode(node)
                    }
                  }}
                  className={`absolute w-[280px] bg-white rounded-xl shadow-md border-2 transition-all duration-200 ${
                    draggingNode === node.id ? 'cursor-grabbing shadow-2xl scale-105 z-50' : 'cursor-pointer'
                  } ${
                    isSelected 
                      ? `${nodeType.borderColor} shadow-lg` 
                      : 'border-gray-100 hover:border-gray-200 hover:shadow-lg'
                  }`}
                  style={{ 
                    left: node.position.x, 
                    top: node.position.y,
                    transition: draggingNode === node.id ? 'none' : 'all 0.2s'
                  }}
                >
                  {/* Validation indicator */}
                  {isInvalid && node.type === 'signer' && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shadow-sm">
                      <AlertTriangle size={14} className="text-white" />
                    </div>
                  )}

                  {/* Node Header */}
                  <div className={`flex items-center gap-3 p-3 rounded-t-xl ${nodeType.bgLight}`}>
                    {/* Drag Handle */}
                    <div
                      onMouseDown={(e) => handleDragStart(e, node.id)}
                      className="cursor-grab active:cursor-grabbing p-1 -ml-1 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded transition"
                      title="Drag to move"
                    >
                      <GripVertical size={16} />
                    </div>
                    <div className={`w-10 h-10 rounded-lg ${nodeType.color} flex items-center justify-center shadow-sm`}>
                      <Icon size={18} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 truncate">{node.data.label}</p>
                      <p className="text-xs text-gray-500 capitalize">{node.type.replace('-', ' ')}</p>
                    </div>
                    {node.type !== 'trigger' && node.type !== 'end' && (
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            duplicateNode(node.id)
                          }}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-lg transition"
                          title="Duplicate"
                        >
                          <Copy size={14} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNode(node.id)
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-white/50 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Node Content */}
                  <div className="p-3 space-y-2 text-sm">
                    {node.type === 'trigger' && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span>Workflow starts when document is uploaded</span>
                      </div>
                    )}

                    {node.type === 'signer' && (
                      <>
                        {(node.data.config as SignerConfig)?.email ? (
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-semibold text-xs">
                                  {((node.data.config as SignerConfig)?.name || 'S').charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">{(node.data.config as SignerConfig)?.name}</p>
                                <p className="text-xs text-gray-500 truncate">{(node.data.config as SignerConfig)?.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Clock size={12} />
                              <span>{(node.data.config as SignerConfig)?.deadline}h deadline</span>
                              <span className="px-1.5 py-0.5 bg-gray-100 rounded capitalize">
                                {(node.data.config as SignerConfig)?.role}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg text-amber-700">
                            <AlertTriangle size={14} />
                            <span className="text-xs font-medium">Click to configure signer details</span>
                          </div>
                        )}
                      </>
                    )}

                    {node.type === 'condition' && (
                      <div className="flex gap-2">
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-lg font-medium">✓ if true</span>
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-lg font-medium">✗ if false</span>
                      </div>
                    )}

                    {node.type === 'ai-review' && (
                      <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
                        <Sparkles size={14} className="text-purple-500" />
                        <span className="text-xs text-purple-700 font-medium">AI-powered document analysis</span>
                      </div>
                    )}

                    {node.type === 'notification' && (
                      <div className="text-xs text-gray-500">Send notification when step completes</div>
                    )}

                    {node.type === 'end' && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        <span>All signatures collected successfully</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            {/* Add More Hint */}
            {workflow.nodes.length > 0 && (
              <div 
                className="absolute flex flex-col items-center"
                style={{ 
                  left: (workflow.nodes.find(n => n.type === 'end')?.position.x || 400) + 85,
                  top: (workflow.nodes.find(n => n.type === 'end')?.position.y || 0) + 120
                }}
              >
                <div className="w-px h-6 bg-gray-200" />
                <button
                  onClick={() => addNode('signer')}
                  className="group flex items-center gap-2 px-4 py-2 bg-white border-2 border-dashed border-gray-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50 transition-all"
                >
                  <Plus size={16} className="text-gray-400 group-hover:text-indigo-500" />
                  <span className="text-sm text-gray-500 group-hover:text-indigo-600 font-medium">Add another step</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Configuration */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col shadow-sm">
        {selectedNode ? (
          <>
            {/* Panel Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${nodeTypes[selectedNode.type].color} flex items-center justify-center`}>
                    {(() => {
                      const Icon = nodeTypes[selectedNode.type].icon
                      return <Icon size={18} className="text-white" />
                    })()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedNode.data.label}</h3>
                    <p className="text-xs text-gray-500 capitalize">{selectedNode.type.replace('-', ' ')} Configuration</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedNode(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => setActiveTab('properties')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                  activeTab === 'properties' 
                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Properties
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                  activeTab === 'settings' 
                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Settings
              </button>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'properties' && (
                <div className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Step Name</label>
                    <input
                      type="text"
                      value={selectedNode.data.label}
                      onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={selectedNode.data.description || ''}
                      onChange={(e) => updateNodeData(selectedNode.id, { description: e.target.value })}
                      placeholder="Add a description..."
                      rows={2}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition"
                    />
                  </div>

                  {/* Signer-specific fields */}
                  {selectedNode.type === 'signer' && (
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                      <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <UserCheck size={16} className="text-blue-500" />
                        Signer Information
                      </h4>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-gray-500 mb-1.5">Full Name *</label>
                          <input
                            type="text"
                            value={(selectedNode.data.config as SignerConfig)?.name || ''}
                            onChange={(e) => updateNodeConfig(selectedNode.id, { name: e.target.value })}
                            placeholder="John Doe"
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-gray-500 mb-1.5">Email Address *</label>
                          <input
                            type="email"
                            value={(selectedNode.data.config as SignerConfig)?.email || ''}
                            onChange={(e) => updateNodeConfig(selectedNode.id, { email: e.target.value })}
                            placeholder="john@company.com"
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1.5">Role</label>
                          <select
                            value={(selectedNode.data.config as SignerConfig)?.role || 'signer'}
                            onChange={(e) => updateNodeConfig(selectedNode.id, { role: e.target.value })}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
                          >
                            <option value="signer">Signer</option>
                            <option value="approver">Approver</option>
                            <option value="reviewer">Reviewer</option>
                            <option value="manager">Manager</option>
                            <option value="director">Director</option>
                            <option value="legal">Legal</option>
                            <option value="finance">Finance</option>
                            <option value="witness">Witness</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1.5">Order</label>
                          <input
                            type="number"
                            min={1}
                            value={(selectedNode.data.config as SignerConfig)?.order || 1}
                            onChange={(e) => updateNodeConfig(selectedNode.id, { order: parseInt(e.target.value) })}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1.5">Deadline (hours)</label>
                          <input
                            type="number"
                            min={1}
                            value={(selectedNode.data.config as SignerConfig)?.deadline || 48}
                            onChange={(e) => updateNodeConfig(selectedNode.id, { deadline: parseInt(e.target.value) })}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1.5">Reminder (days)</label>
                          <input
                            type="number"
                            min={0}
                            value={(selectedNode.data.config as SignerConfig)?.reminderDays || 1}
                            onChange={(e) => updateNodeConfig(selectedNode.id, { reminderDays: parseInt(e.target.value) })}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Required Signature</p>
                          <p className="text-xs text-gray-500">Workflow pauses until signed</p>
                        </div>
                        <button
                          onClick={() => updateNodeConfig(selectedNode.id, { 
                            required: !(selectedNode.data.config as SignerConfig)?.required 
                          })}
                          className={`relative w-12 h-7 rounded-full transition-colors ${
                            (selectedNode.data.config as SignerConfig)?.required 
                              ? 'bg-indigo-600' 
                              : 'bg-gray-300'
                          }`}
                        >
                          <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                            (selectedNode.data.config as SignerConfig)?.required 
                              ? 'translate-x-6' 
                              : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                    <h4 className="text-sm font-semibold text-gray-900">Runtime Options</h4>
                    
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-600">Auto-run on trigger</span>
                      <span className="text-sm font-medium text-emerald-600">Enabled</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-t border-gray-200">
                      <span className="text-sm text-gray-600">Timeout</span>
                      <span className="text-sm font-medium text-gray-900">24 hours</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-t border-gray-200">
                      <span className="text-sm text-gray-600">Retry attempts</span>
                      <span className="text-sm font-medium text-gray-900">3</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-t border-gray-200">
                      <span className="text-sm text-gray-600">Stop on error</span>
                      <span className="text-sm font-medium text-emerald-600">Enabled</span>
                    </div>
                  </div>

                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Info size={18} className="text-indigo-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-indigo-900">Advanced Settings</p>
                        <p className="text-xs text-indigo-700 mt-1">
                          Configure webhooks, custom fields, and integrations in the workflow settings page.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            {selectedNode.type !== 'trigger' && selectedNode.type !== 'end' && (
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <p className="text-xs font-medium text-gray-500 mb-2">Quick Actions</p>
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      const nodeId = selectedNode.id
                      duplicateNode(nodeId)
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                  >
                    <Copy size={14} />
                    Duplicate
                  </button>
                  <button 
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      const nodeId = selectedNode.id
                      deleteNode(nodeId)
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <MousePointer2 size={24} className="text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Select a Step</h3>
            <p className="text-sm text-gray-500 max-w-[200px]">
              Click on any step in the canvas to view and edit its properties
            </p>
            
            <div className="mt-8 p-4 bg-indigo-50 rounded-xl w-full">
              <div className="flex items-start gap-3">
                <Lightbulb size={18} className="text-indigo-600 mt-0.5" />
                <div className="text-left">
                  <p className="text-sm font-medium text-indigo-900">Pro Tip</p>
                  <p className="text-xs text-indigo-700 mt-1">
                    Use keyboard shortcuts: <br/>
                    • <kbd className="px-1 py-0.5 bg-white rounded text-[10px]">Ctrl+S</kbd> to save<br/>
                    • <kbd className="px-1 py-0.5 bg-white rounded text-[10px]">Ctrl+Z</kbd> to undo<br/>
                    • <kbd className="px-1 py-0.5 bg-white rounded text-[10px]">Delete</kbd> to remove<br/>
                    • Drag grip to move nodes
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SignatureWorkflowBuilder
