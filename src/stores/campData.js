import { writable } from 'svelte/store';
import campamentosData from '../../data/campamentos.json';

const initialData = {
  selectedCamp: null,
  camps: campamentosData.campamentos
};

function createCampStore() {
  const { subscribe, set, update } = writable(initialData);

  return {
    subscribe,
    selectCamp: (camp) => update(state => ({ ...state, selectedCamp: camp })),
    reset: () => set(initialData)
  };
}

export const campStore = createCampStore(); 