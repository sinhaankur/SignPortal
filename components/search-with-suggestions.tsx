"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export interface SearchSuggestion {
  id: string
  title: string
  description?: string
  href: string
  category?: string
  icon?: React.ReactNode
}

interface SearchWithSuggestionsProps {
  placeholder?: string
  suggestions: SearchSuggestion[]
  onSearch?: (query: string) => void
  className?: string
  inputClassName?: string
  maxSuggestions?: number
  showCategoryLabels?: boolean
  emptyMessage?: string
  debounceMs?: number
}

export default function SearchWithSuggestions({
  placeholder = "Search...",
  suggestions,
  onSearch,
  className = "",
  inputClassName = "",
  maxSuggestions = 8,
  showCategoryLabels = true,
  emptyMessage = "No results found",
  debounceMs = 150,
}: SearchWithSuggestionsProps) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Filter suggestions based on query
  const filteredSuggestions = query.trim()
    ? suggestions
        .filter((s) => {
          const searchTerms = query.toLowerCase().split(" ")
          const searchableText = `${s.title} ${s.description || ""} ${s.category || ""}`.toLowerCase()
          return searchTerms.every((term) => searchableText.includes(term))
        })
        .slice(0, maxSuggestions)
    : []

  // Group by category if enabled
  const groupedSuggestions = showCategoryLabels
    ? filteredSuggestions.reduce<Record<string, SearchSuggestion[]>>((acc, s) => {
        const cat = s.category || "Other"
        if (!acc[cat]) acc[cat] = []
        acc[cat].push(s)
        return acc
      }, {})
    : { "": filteredSuggestions }

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === "ArrowDown" && query) {
          setIsOpen(true)
          setSelectedIndex(0)
          e.preventDefault()
        }
        return
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev < filteredSuggestions.length - 1 ? prev + 1 : prev
          )
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
          break
        case "Enter":
          e.preventDefault()
          if (selectedIndex >= 0 && filteredSuggestions[selectedIndex]) {
            router.push(filteredSuggestions[selectedIndex].href)
            setIsOpen(false)
            setQuery("")
          } else if (onSearch) {
            onSearch(query)
          }
          break
        case "Escape":
          setIsOpen(false)
          setSelectedIndex(-1)
          inputRef.current?.blur()
          break
      }
    },
    [isOpen, filteredSuggestions, selectedIndex, query, onSearch, router]
  )

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(-1)
  }, [query])

  // Debounced opening
  useEffect(() => {
    if (!query.trim()) {
      setIsOpen(false)
      return
    }
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, debounceMs)
    return () => clearTimeout(timer)
  }, [query, debounceMs])

  const getFlatIndex = (category: string, indexInCategory: number) => {
    let flatIndex = 0
    for (const [cat, items] of Object.entries(groupedSuggestions)) {
      if (cat === category) {
        return flatIndex + indexInCategory
      }
      flatIndex += items.length
    }
    return -1
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#37322f]/40 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full pl-10 pr-4 py-2 bg-white border border-[#37322f]/10 rounded-lg text-sm text-[#37322f] placeholder-[#37322f]/40 focus:outline-none focus:ring-2 focus:ring-[#37322f]/20 ${inputClassName}`}
          autoComplete="off"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("")
              setIsOpen(false)
              inputRef.current?.focus()
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#37322f]/40 hover:text-[#37322f]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && query.trim() && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-[#37322f]/10 rounded-xl shadow-lg overflow-hidden max-h-[400px] overflow-y-auto">
          {filteredSuggestions.length === 0 ? (
            <div className="px-4 py-8 text-center text-[#37322f]/60 text-sm">
              {emptyMessage}
            </div>
          ) : (
            Object.entries(groupedSuggestions).map(([category, items]) => (
              <div key={category}>
                {showCategoryLabels && category && (
                  <div className="px-3 py-2 bg-[#F7F5F3] text-xs font-semibold text-[#37322f]/70 uppercase tracking-wider">
                    {category}
                  </div>
                )}
                {items.map((suggestion, idx) => {
                  const flatIndex = getFlatIndex(category, idx)
                  const isSelected = flatIndex === selectedIndex
                  return (
                    <Link
                      key={suggestion.id}
                      href={suggestion.href}
                      onClick={() => {
                        setIsOpen(false)
                        setQuery("")
                      }}
                      onMouseEnter={() => setSelectedIndex(flatIndex)}
                      className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                        isSelected ? "bg-[#37322f]/5" : "hover:bg-[#37322f]/5"
                      }`}
                    >
                      {suggestion.icon && (
                        <div className="flex-shrink-0 w-8 h-8 bg-[#37322f]/10 rounded-lg flex items-center justify-center text-[#37322f]/60">
                          {suggestion.icon}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-[#37322f] truncate">
                          {highlightMatch(suggestion.title, query)}
                        </div>
                        {suggestion.description && (
                          <div className="text-sm text-[#37322f]/60 truncate">
                            {highlightMatch(suggestion.description, query)}
                          </div>
                        )}
                      </div>
                      {isSelected && (
                        <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs font-mono bg-[#37322f]/10 text-[#37322f]/60 rounded">
                          Enter
                        </kbd>
                      )}
                    </Link>
                  )
                })}
              </div>
            ))
          )}
          {filteredSuggestions.length > 0 && (
            <div className="px-4 py-2 bg-[#F7F5F3] border-t border-[#37322f]/10 text-xs text-[#37322f]/50 flex items-center justify-between">
              <span>
                <kbd className="px-1.5 py-0.5 bg-white border border-[#37322f]/20 rounded text-[10px]">↑</kbd>
                <kbd className="ml-1 px-1.5 py-0.5 bg-white border border-[#37322f]/20 rounded text-[10px]">↓</kbd>
                <span className="ml-2">to navigate</span>
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 bg-white border border-[#37322f]/20 rounded text-[10px]">Enter</kbd>
                <span className="ml-2">to select</span>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Highlight matching text
function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text

  const terms = query.toLowerCase().split(" ").filter(Boolean)
  let result = text
  
  // Create a simple highlight by wrapping matched terms
  terms.forEach((term) => {
    const regex = new RegExp(`(${escapeRegex(term)})`, "gi")
    result = result.replace(regex, '<mark class="bg-yellow-200/60 text-[#37322f] rounded px-0.5">$1</mark>')
  })

  return <span dangerouslySetInnerHTML={{ __html: result }} />
}

function escapeRegex(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
