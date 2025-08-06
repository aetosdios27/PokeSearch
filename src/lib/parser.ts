interface FilterObject {
  // CORRECTED: These can hold multiple values.
  type?: string[];
  region?: string[];
  is_legendary?: boolean;
}

export function parseQuery(query: string): FilterObject {
  const filters: FilterObject = {};

  if (query.includes('all')) {
    return {}; // Handle the 'all' case and exit immediately.
  }

  const allTypes = [
    'bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting', 'fire', 
    'flying', 'ghost', 'grass', 'ground', 'ice', 'normal', 'poison', 
    'psychic', 'rock', 'steel', 'water'
  ];

  const foundTypes = allTypes.filter(type => query.includes(type));
  if (foundTypes.length > 0) {
    filters.type = foundTypes;
  }

  if (query.includes('legendary')) {
    filters.is_legendary = true;
  }

  // CORRECTED: Typo fixed.
  const regions = ['kanto', 'johto', 'hoenn', 'sinnoh', 'unova', 'kalos', 'alola', 'galar', 'paldea'];
  const foundRegions = regions.filter(region => query.includes(region));
  if (foundRegions.length > 0) {
    filters.region = foundRegions;
  }

  // CORRECTED: The function must always return the object.
  return filters;
}