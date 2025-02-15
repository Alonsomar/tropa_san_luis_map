import { writable } from 'svelte/store';

export const modalStore = writable({
  isOpen: false,
  images: [],
  currentIndex: 0
});

// Acciones del modal
export const modalActions = {
  open: (images, index) => {
    document.body.style.overflow = 'hidden';
    modalStore.set({
      isOpen: true,
      images,
      currentIndex: index
    });
  },
  close: () => {
    document.body.style.overflow = '';
    modalStore.set({
      isOpen: false,
      images: [],
      currentIndex: 0
    });
  },
  next: () => {
    modalStore.update(state => ({
      ...state,
      currentIndex: (state.currentIndex + 1) % state.images.length
    }));
  },
  prev: () => {
    modalStore.update(state => ({
      ...state,
      currentIndex: (state.currentIndex - 1 + state.images.length) % state.images.length
    }));
  }
}; 