type StatName =
  | 'hp'
  | 'attack'
  | 'defense'
  | 'special-attack'
  | 'special-defense'
  | 'speed';

type ComparisonOperator = '>' | '<' | '=';

interface StatFilter {
  stat: StatName;
  operator: ComparisonOperator;
  value: number;
}

interface FilterObject {
  // CORRECTED: These can hold multiple values.
  type?: string[];
  region?: string[];
  is_legendary?: boolean;

  // NEW: Holds parsed stat comparisons (e.g., attack > 100).
  statFilters?: StatFilter[];
}

// Targets for stat parsing
const STAT_NAMES: StatName[] = [
  'hp',
  'attack',
  'defense',
  'special-attack',
  'special-defense',
  'speed',
];

// Build regex from valid stat names -> (stat)(operator)(number)
const STAT_PATTERN = STAT_NAMES.join('|');
const STAT_REGEX = new RegExp(`\\b(${STAT_PATTERN})\\b\\s*(>|<|=)\\s*(\\d+)`, 'gi');

export function parseQuery(query: string): FilterObject {
  const filters: FilterObject = {};

  const q = query.toLowerCase();

  if (q.includes('all')) {
    return {}; // Handle the 'all' case and exit immediately.
  }

  const allTypes = [
    'bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting', 'fire',
    'flying', 'ghost', 'grass', 'ground', 'ice', 'normal', 'poison',
    'psychic', 'rock', 'steel', 'water'
  ];

  const foundTypes = allTypes.filter(type => q.includes(type));
  if (foundTypes.length > 0) {
    filters.type = foundTypes;
  }

  if (q.includes('legendary')) {
    filters.is_legendary = true;
  }

  // CORRECTED: Typo fixed.
  const regions = ['kanto', 'johto', 'hoenn', 'sinnoh', 'unova', 'kalos', 'alola', 'galar', 'paldea'];
  const foundRegions = regions.filter(region => q.includes(region));
  if (foundRegions.length > 0) {
    filters.region = foundRegions;
  }

  // NEW: Parse stat comparisons using the regex and matchAll
  const statFilters: StatFilter[] = [];
  for (const match of q.matchAll(STAT_REGEX)) {
    const stat = match[1] as StatName;
    const operator = match[2] as ComparisonOperator;
    const value = parseInt(match[3], 10);

    statFilters.push({ stat, operator, value });
  }

  if (statFilters.length > 0) {
    filters.statFilters = statFilters;
  }

  // CORRECTED: The function must always return the object.
  return filters;
}