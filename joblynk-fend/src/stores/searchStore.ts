import { create } from 'zustand'

interface SearchState {
  searchQuery: string
  location: string
  setSearchParams: (query: string, location: string) => void
}

const useSearchStore = create<SearchState>((set) => ({
  searchQuery: '',
  location: '',
  setSearchParams: (query, location) =>
    set({ searchQuery: query, location: location }),
}))

export default useSearchStore
