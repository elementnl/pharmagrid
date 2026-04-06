import drugsData from "../data/drugs.json";
import { createSeededRandom, dateToSeed, seededShuffle } from "./seededRandom";

// All category keys that can appear as row/column headers
const CATEGORIES = [
  { key: "drug_class", label: "Drug Class" },
  { key: "indication", label: "Indication" },
  { key: "route", label: "Route" },
  { key: "rx_status", label: "Rx Status" },
  { key: "dosage_form", label: "Dosage Form" },
  { key: "body_system", label: "Body System" },
  { key: "suffix", label: "Drug Suffix" },
  { key: "dosing_frequency", label: "Dosing Frequency" },
  { key: "black_box_warning", label: "Black Box Warning" },
  { key: "narrow_therapeutic_index", label: "Narrow TI" },
  { key: "mechanism_type", label: "Mechanism" },
  { key: "common_side_effect", label: "Side Effect" },
  { key: "approval_era", label: "Approval Era" },
  { key: "generic_starts_with", label: "Generic Starts With" },
  { key: "generic_ends_with", label: "Generic Ends With" },
  { key: "brand_starts_with", label: "Brand Starts With" },
];

// Enrich drugs with derived fields
function enrichDrugs(drugs) {
  return drugs.map((drug) => ({
    ...drug,
    generic_starts_with: drug.generic_name[0].toUpperCase(),
    generic_ends_with: drug.generic_name[drug.generic_name.length - 1].toUpperCase(),
    brand_starts_with: drug.brand_name[0].toUpperCase(),
  }));
}

const drugs = enrichDrugs(drugsData);

// Get all unique values for a category
function getUniqueValues(categoryKey) {
  const values = new Set();
  drugs.forEach((drug) => {
    if (drug[categoryKey]) {
      values.add(drug[categoryKey]);
    }
  });
  return [...values];
}

// Find drugs that match a specific category-value pair
function matchingDrugs(categoryKey, value) {
  return drugs.filter((drug) => drug[categoryKey] === value);
}

// Check if a cell (intersection of row and col) has at least one valid drug
function cellHasAnswer(rowCat, rowVal, colCat, colVal) {
  return drugs.some(
    (drug) => drug[rowCat] === rowVal && drug[colCat] === colVal
  );
}

// Check if a drug is a valid answer for a cell
export function isDrugValidForCell(drugName, rowCategory, rowValue, colCategory, colValue) {
  const normalizedInput = drugName.toLowerCase().trim();
  return drugs.some(
    (drug) =>
      (drug.generic_name.toLowerCase() === normalizedInput ||
        drug.brand_name.toLowerCase() === normalizedInput) &&
      drug[rowCategory] === rowValue &&
      drug[colCategory] === colValue
  );
}

// Get the drug object by name (generic or brand)
export function getDrugByName(drugName) {
  const normalizedInput = drugName.toLowerCase().trim();
  return drugs.find(
    (drug) =>
      drug.generic_name.toLowerCase() === normalizedInput ||
      drug.brand_name.toLowerCase() === normalizedInput
  );
}

// Get all valid drug names for a cell (for showing answers)
export function getValidDrugsForCell(rowCategory, rowValue, colCategory, colValue) {
  return drugs.filter(
    (drug) => drug[rowCategory] === rowValue && drug[colCategory] === colValue
  );
}

// Generate a puzzle for a given date string
export function generatePuzzle(dateStr) {
  const seed = dateToSeed(dateStr);
  let random = createSeededRandom(seed);

  // Try multiple attempts to find a valid grid
  for (let attempt = 0; attempt < 100; attempt++) {
    // Shuffle categories and pick 6 unique ones (3 for rows, 3 for cols)
    const shuffled = seededShuffle(CATEGORIES, random);
    const rowCategories = shuffled.slice(0, 3);
    const colCategories = shuffled.slice(3, 6);

    // For each category, pick a random value
    const rows = rowCategories.map((cat) => {
      const values = seededShuffle(getUniqueValues(cat.key), random);
      return { ...cat, value: values[0] };
    });

    const cols = colCategories.map((cat) => {
      const values = seededShuffle(getUniqueValues(cat.key), random);
      return { ...cat, value: values[0] };
    });

    // Validate: every cell must have at least one valid answer
    let valid = true;
    for (const row of rows) {
      for (const col of cols) {
        if (!cellHasAnswer(row.key, row.value, col.key, col.value)) {
          valid = false;
          break;
        }
      }
      if (!valid) break;
    }

    if (valid) {
      return { date: dateStr, rows, cols };
    }

    // Re-seed for next attempt
    random = createSeededRandom(seed + attempt + 1);
  }

  // Fallback: should never happen with 200 drugs and good categories
  throw new Error(`Could not generate valid puzzle for ${dateStr}`);
}

export { drugs, CATEGORIES };
