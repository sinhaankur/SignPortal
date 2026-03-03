'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  RotateCw,
  Download,
  Maximize2,
  FileText,
  Loader2
} from 'lucide-react'

interface PDFViewerProps {
  /** PDF source - can be URL, File, or base64 string */
  src: string | File
  /** Initial page to display (1-indexed) */
  initialPage?: number
  /** Initial zoom level (1 = 100%) */
  initialZoom?: number
  /** Callback when page changes */
  onPageChange?: (page: number) => void
  /** Callback when PDF is loaded */
  onLoad?: (pageCount: number) => void
  /** Enable signature placement mode */
  signatureMode?: boolean
  /** Callback when signature area is selected */
  onSignatureAreaSelect?: (area: { page: number; x: number; y: number; width: number; height: number }) => void
  /** Overlay components to render on top of pages */
  overlays?: {
    page: number
    x: number
    y: number
    width: number
    height: number
    component: React.ReactNode
  }[]
  /** Height of the viewer */
  height?: string | number
  /** Show toolbar */
  showToolbar?: boolean
}

export function PDFViewer({
  src,
  initialPage = 1,
  initialZoom = 1,
  onPageChange,
  onLoad,
  signatureMode = false,
  onSignatureAreaSelect,
  overlays = [],
  height = '600px',
  showToolbar = true
}: PDFViewerProps) {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [totalPages, setTotalPages] = useState(0)
  const [zoom, setZoom] = useState(initialZoom)
  const [rotation, setRotation] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null)
  const [selectionBox, setSelectionBox] = useState<{
    x: number
    y: number
    width: number
    height: number
  } | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Load PDF
  useEffect(() => {
    const loadPdf = async () => {
      setIsLoading(true)
      setError(null)

      try {
        let url: string

        if (src instanceof File) {
          url = URL.createObjectURL(src)
        } else if (src.startsWith('data:')) {
          url = src
        } else {
          url = src
        }

        setPdfUrl(url)

        // Try to get page count (this is a simplification - in production you'd use pdf.js)
        // For now, we'll estimate based on the PDF or use pdf-lib
        const { pdfService } = await import('@/lib/pdf-service')
        
        if (src instanceof File) {
          const info = await pdfService.loadPDFFromFile(src)
          setTotalPages(info.pageCount)
          onLoad?.(info.pageCount)
        } else if (typeof src === 'string' && !src.startsWith('data:')) {
          const info = await pdfService.loadPDF(src)
          setTotalPages(info.pageCount)
          onLoad?.(info.pageCount)
        } else {
          // For data URLs, default to estimating
          setTotalPages(1)
          onLoad?.(1)
        }

        setIsLoading(false)
      } catch (err) {
        setError('Failed to load PDF')
        setIsLoading(false)
      }
    }

    loadPdf()

    return () => {
      // Cleanup object URL if created
      if (pdfUrl && pdfUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pdfUrl)
      }
    }
  }, [src])

  // Navigation handlers
  const goToPage = useCallback((page: number) => {
    const newPage = Math.max(1, Math.min(page, totalPages))
    setCurrentPage(newPage)
    onPageChange?.(newPage)
  }, [totalPages, onPageChange])

  const nextPage = () => goToPage(currentPage + 1)
  const prevPage = () => goToPage(currentPage - 1)

  // Zoom handlers
  const zoomIn = () => setZoom(z => Math.min(z + 0.25, 3))
  const zoomOut = () => setZoom(z => Math.max(z - 0.25, 0.5))
  const resetZoom = () => setZoom(1)

  // Rotation handler
  const rotate = () => setRotation(r => (r + 90) % 360)

  // Download handler
  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a')
      link.href = pdfUrl
      link.download = 'document.pdf'
      link.click()
    }
  }

  // Fullscreen handler
  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        containerRef.current.requestFullscreen()
      }
    }
  }

  // Signature area selection handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!signatureMode) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoom
    const y = (e.clientY - rect.top) / zoom
    
    setIsDragging(true)
    setDragStart({ x, y })
    setSelectionBox({ x, y, width: 0, height: 0 })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStart || !signatureMode) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const currentX = (e.clientX - rect.left) / zoom
    const currentY = (e.clientY - rect.top) / zoom
    
    setSelectionBox({
      x: Math.min(dragStart.x, currentX),
      y: Math.min(dragStart.y, currentY),
      width: Math.abs(currentX - dragStart.x),
      height: Math.abs(currentY - dragStart.y),
    })
  }

  const handleMouseUp = () => {
    if (isDragging && selectionBox && signatureMode) {
      if (selectionBox.width > 50 && selectionBox.height > 30) {
        onSignatureAreaSelect?.({
          page: currentPage,
          ...selectionBox,
        })
      }
    }
    setIsDragging(false)
    setDragStart(null)
    setSelectionBox(null)
  }

  // Get overlays for current page
  const currentPageOverlays = overlays.filter(o => o.page === currentPage)

  if (error) {
    return (
      <div 
        className="flex flex-col items-center justify-center bg-gray-100 rounded-lg border border-gray-200"
        style={{ height }}
      >
        <FileText className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-gray-600 font-medium">{error}</p>
        <p className="text-gray-500 text-sm">Please try uploading the document again.</p>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="flex flex-col bg-gray-100 rounded-lg overflow-hidden" style={{ height }}>
      {/* Toolbar */}
      {showToolbar && (
        <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
          {/* Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevPage}
              disabled={currentPage <= 1}
              className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
              title="Previous page"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={totalPages}
                value={currentPage}
                onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
                className="w-16 px-2 py-1 text-center border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-gray-500 text-sm">/ {totalPages}</span>
            </div>

            <button
              onClick={nextPage}
              disabled={currentPage >= totalPages}
              className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
              title="Next page"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={zoomOut}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Zoom out"
            >
              <ZoomOut size={20} />
            </button>
            
            <button
              onClick={resetZoom}
              className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              {Math.round(zoom * 100)}%
            </button>
            
            <button
              onClick={zoomIn}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Zoom in"
            >
              <ZoomIn size={20} />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={rotate}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Rotate"
            >
              <RotateCw size={20} />
            </button>
            
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Download"
            >
              <Download size={20} />
            </button>
            
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Fullscreen"
            >
              <Maximize2 size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Signature Mode Indicator */}
      {signatureMode && (
        <div className="px-4 py-2 bg-indigo-50 border-b border-indigo-100">
          <p className="text-sm text-indigo-700 font-medium">
            🖊️ Signature Mode: Click and drag to place a signature field
          </p>
        </div>
      )}

      {/* PDF Display Area */}
      <div 
        className="flex-1 overflow-auto relative"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: signatureMode ? 'crosshair' : 'default' }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            <span className="ml-3 text-gray-600">Loading PDF...</span>
          </div>
        ) : pdfUrl ? (
          <div 
            className="relative mx-auto"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transformOrigin: 'top center',
              transition: 'transform 0.2s ease',
            }}
          >
            {/* PDF iframe - for browsers with PDF support */}
            <iframe
              ref={iframeRef}
              src={`${pdfUrl}#page=${currentPage}`}
              className="w-full bg-white shadow-lg"
              style={{ 
                width: '816px', // Letter width at 96 DPI
                height: '1056px', // Letter height at 96 DPI
                border: 'none'
              }}
              title="PDF Document"
            />

            {/* Overlays (signature fields, etc.) */}
            {currentPageOverlays.map((overlay, index) => (
              <div
                key={index}
                className="absolute pointer-events-auto"
                style={{
                  left: overlay.x,
                  top: overlay.y,
                  width: overlay.width,
                  height: overlay.height,
                }}
              >
                {overlay.component}
              </div>
            ))}

            {/* Selection Box */}
            {selectionBox && selectionBox.width > 0 && selectionBox.height > 0 && (
              <div
                className="absolute border-2 border-indigo-500 bg-indigo-100/30 pointer-events-none"
                style={{
                  left: selectionBox.x,
                  top: selectionBox.y,
                  width: selectionBox.width,
                  height: selectionBox.height,
                }}
              />
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default PDFViewer
