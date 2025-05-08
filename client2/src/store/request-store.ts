import { create } from 'zustand'
import { ProjectData } from '../types'

interface RequestState {
  projectData: ProjectData | null
  setProjectData: (data: ProjectData) => void
  updateLocation: (index: number, location: ProjectData['location'][0]) => void
  addLocation: (location: ProjectData['location'][0]) => void
  removeLocation: (index: number) => void
  addProduct: (locationIndex: number, product: ProjectData['location'][0]['products'][0]) => void
  removeProduct: (locationIndex: number, productIndex: number) => void
  updateProjectDetails: (details: ProjectData['project_details']) => void
  updateContactInfo: (contactInfo: ProjectData['contact_info']) => void
  updateComments: (comments: string | null) => void
}

// Create empty location template
const createEmptyLocation = (): ProjectData['location'][0] => ({
  address: '',
  start_date: '',
  end_date: null,
  time_slots: null,
  truck_spacing: '',
  delivery_rate: null,
  other_info: null,
  products: [{
    id: null,
    name: '',
    qty: 0,
    uom: '',
    product_specific_comments: null
  }]
})

// Create empty product template
const createEmptyProduct = (): ProjectData['location'][0]['products'][0] => ({
  id: null,
  name: '',
  qty: 0,
  uom: '',
  product_specific_comments: null
})

export const useRequestStore = create<RequestState>((set) => ({
  projectData: null,
  
  setProjectData: (data) => set({ projectData: data }),
  
  updateLocation: (index, location) => set((state) => {
    if (!state.projectData) return { projectData: null }
    
    const newLocations = [...state.projectData.location]
    newLocations[index] = location
    
    return {
      projectData: {
        ...state.projectData,
        location: newLocations
      }
    }
  }),
  
  addLocation: (location) => set((state) => {
    if (!state.projectData) return { projectData: null }
    
    return {
      projectData: {
        ...state.projectData,
        location: [...state.projectData.location, location]
      }
    }
  }),
  
  removeLocation: (index) => set((state) => {
    if (!state.projectData) return { projectData: null }
    if (state.projectData.location.length <= 1) return state
    
    const newLocations = [...state.projectData.location]
    newLocations.splice(index, 1)
    
    return {
      projectData: {
        ...state.projectData,
        location: newLocations
      }
    }
  }),
  
  addProduct: (locationIndex, product) => set((state) => {
    if (!state.projectData) return { projectData: null }
    
    const newLocations = [...state.projectData.location]
    const newProducts = [...newLocations[locationIndex].products, product]
    
    newLocations[locationIndex] = {
      ...newLocations[locationIndex],
      products: newProducts
    }
    
    return {
      projectData: {
        ...state.projectData,
        location: newLocations
      }
    }
  }),
  
  removeProduct: (locationIndex, productIndex) => set((state) => {
    if (!state.projectData) return { projectData: null }
    if (state.projectData.location[locationIndex].products.length <= 1) return state
    
    const newLocations = [...state.projectData.location]
    const newProducts = [...newLocations[locationIndex].products]
    newProducts.splice(productIndex, 1)
    
    newLocations[locationIndex] = {
      ...newLocations[locationIndex],
      products: newProducts
    }
    
    return {
      projectData: {
        ...state.projectData,
        location: newLocations
      }
    }
  }),
  
  updateProjectDetails: (details) => set((state) => {
    if (!state.projectData) return { projectData: null }
    
    return {
      projectData: {
        ...state.projectData,
        project_details: details
      }
    }
  }),
  
  updateContactInfo: (contactInfo) => set((state) => {
    if (!state.projectData) return { projectData: null }
    
    return {
      projectData: {
        ...state.projectData,
        contact_info: contactInfo
      }
    }
  }),
  
  updateComments: (comments) => set((state) => {
    if (!state.projectData) return { projectData: null }
    
    return {
      projectData: {
        ...state.projectData,
        comments: comments
      }
    }
  }),
}))