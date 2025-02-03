import { writable } from 'svelte/store';
import campamentosData from '../../data/campamentos.json';

const initialData = {
  selectedCamp: null,
  camps: campamentosData.campamentos.map(camp => ({
    ...camp,
    lat: camp.coordenadas.lat,
    lng: camp.coordenadas.lng
  }))
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
