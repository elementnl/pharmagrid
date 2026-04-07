import drugsData from "../data/drugs.json";
import { createSeededRandom, dateToSeed, seededShuffle } from "./seededRandom";

const CATEGORIES = [
  { key: "drug_class", label: "Drug Class" },
  { key: "therapeutic_category", label: "Category" },
  { key: "indication_group", label: "Indication" },
  { key: "route", label: "Route" },
  { key: "rx_status", label: "Rx Status" },
  { key: "dosage_form", label: "Dosage Form" },
  { key: "body_system", label: "Body System" },
  { key: "suffix", label: "Drug Suffix", excludeValues: ["none"] },
  { key: "dosing_frequency", label: "Dosing Frequency" },
  { key: "black_box_warning", label: "Black Box Warning?" },
  { key: "narrow_therapeutic_index", label: "Narrow Therapeutic Index?" },
  { key: "mechanism_type", label: "Mechanism" },
  { key: "common_side_effect", label: "Side Effect" },
  { key: "approval_era", label: "Approved in" },
  { key: "brand_starts_with", label: "Brand name Starts With", group: "letter" },
  { key: "brand_ends_with", label: "Brand name Ends With", group: "letter" },
];

const CONFLICT_PAIRS = [
  ["drug_class", "therapeutic_category"],
  ["indication_group", "body_system"],
  ["drug_class", "suffix"],
];

const SALT_FORMS = [
  "sodium", "hydrochloride", "hcl", "besylate", "calcium", "potassium",
  "mesylate", "maleate", "fumarate", "tartrate", "sulfate", "phosphate",
  "succinate", "acetate", "citrate", "bromide", "chloride", "nitrate",
  "disodium", "monohydrate", "dihydrate", "propionate", "furoate",
  "xinafoate", "pamoate", "decanoate", "valerate", "dipropionate",
  "hyclate", "oxalate", "hydrobromide", "bisulfate", "dimesylate",
  "trihydrate", "magnesium", "gluconate", "carbonate",
];

function stripSalt(name) {
  let result = name.toLowerCase().trim();
  for (const salt of SALT_FORMS) {
    result = result.replace(new RegExp(`\\s+${salt}\\b`, "g"), "");
  }
  return result.trim();
}

function enrichDrugs(drugs) {
  return drugs.map((drug) => {
    const genericLower = drug.generic_name.toLowerCase();
    const genericBase = stripSalt(genericLower);
    return {
      ...drug,
      _genericBase: genericBase !== genericLower ? genericBase : null,
      brand_starts_with: drug.brand_name[0].toUpperCase(),
      brand_ends_with: drug.brand_name[drug.brand_name.length - 1].toUpperCase(),
    };
  });
}

const drugs = enrichDrugs(drugsData);

function getDrugsForCell(rowCat, rowVal, colCat, colVal) {
  return drugs.filter(
    (drug) => drug[rowCat] === rowVal && drug[colCat] === colVal
  );
}

function nameMatchesDrug(input, drug) {
  const lower = input.toLowerCase().trim();
  if (drug.accepted_names.some((n) => n.toLowerCase() === lower)) return true;
  if (drug.generic_name.toLowerCase() === lower) return true;
  if (drug._genericBase === lower) return true;
  return false;
}

export function isDrugValidForCell(drugName, rowCategory, rowValue, colCategory, colValue) {
  return drugs.some(
    (drug) =>
      nameMatchesDrug(drugName, drug) &&
      drug[rowCategory] === rowValue &&
      drug[colCategory] === colValue
  );
}

export function getDrugByName(drugName) {
  return drugs.find((drug) => nameMatchesDrug(drugName, drug));
}

export function getValidDrugsForCell(rowCategory, rowValue, colCategory, colValue) {
  return drugs.filter(
    (drug) => drug[rowCategory] === rowValue && drug[colCategory] === colValue
  );
}

function hasConflicts(selectedKeys) {
  for (const [a, b] of CONFLICT_PAIRS) {
    if (selectedKeys.includes(a) && selectedKeys.includes(b)) return true;
  }
  return false;
}

function tooManyLetterCategories(selected) {
  return selected.filter((c) => c.group === "letter").length > 1;
}

function hasNineUniqueDrugs(rows, cols) {
  const cellDrugs = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const matches = getDrugsForCell(rows[r].key, rows[r].value, cols[c].key, cols[c].value);
      if (matches.length === 0) return false;
      cellDrugs.push(matches);
    }
  }

  const used = new Set();
  function solve(cellIdx) {
    if (cellIdx === 9) return true;
    for (const drug of cellDrugs[cellIdx]) {
      const id = drug.generic_name;
      if (!used.has(id)) {
        used.add(id);
        if (solve(cellIdx + 1)) return true;
        used.delete(id);
      }
    }
    return false;
  }

  return solve(0);
}

function scorePuzzle(rows, cols) {
  const cellCounts = [];
  const drugAppearances = {};

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const matches = getDrugsForCell(rows[r].key, rows[r].value, cols[c].key, cols[c].value);
      cellCounts.push(matches.length);
      for (const drug of matches) {
        drugAppearances[drug.generic_name] = (drugAppearances[drug.generic_name] || 0) + 1;
      }
    }
  }

  const singleAnswerCells = cellCounts.filter((c) => c === 1).length;
  const maxAppearances = Math.max(...Object.values(drugAppearances));
  const avgCount = cellCounts.reduce((a, b) => a + b, 0) / 9;

  return avgCount * 2 - singleAnswerCells * 3 - maxAppearances * 2;
}

export function generatePuzzle(dateStr) {
  const seed = dateToSeed(dateStr);
  let random = createSeededRandom(seed);

  let bestPuzzle = null;
  let bestScore = -Infinity;

  for (let attempt = 0; attempt < 500; attempt++) {
    const shuffled = seededShuffle(CATEGORIES, random);
    const selected = [];
    for (const cat of shuffled) {
      if (selected.length >= 6) break;
      const testKeys = [...selected.map((c) => c.key), cat.key];
      if (hasConflicts(testKeys)) continue;
      if (tooManyLetterCategories([...selected, cat])) continue;
      selected.push(cat);
    }

    if (selected.length < 6) {
      random = createSeededRandom(seed ^ Math.imul(attempt + 1, 2654435761));
      continue;
    }

    const rowCategories = selected.slice(0, 3);
    const colCategories = selected.slice(3, 6);

    const rows = [];
    const cols = [];
    let failed = false;

    for (const cat of [...rowCategories, ...colCategories]) {
      const excluded = new Set(cat.excludeValues || []);
      const valueCounts = {};
      for (const drug of drugs) {
        const val = drug[cat.key];
        if (val && !excluded.has(val)) {
          valueCounts[val] = (valueCounts[val] || 0) + 1;
        }
      }

      const values = Object.keys(valueCounts);
      if (values.length === 0) { failed = true; break; }

      const preferred = values.filter((v) => valueCounts[v] >= 2);
      const shuffledValues = seededShuffle(preferred.length > 0 ? preferred : values, random);

      if (rows.length < 3) {
        rows.push({ ...cat, value: shuffledValues[0] });
      } else {
        cols.push({ ...cat, value: shuffledValues[0] });
      }
    }

    if (failed || !hasNineUniqueDrugs(rows, cols)) {
      random = createSeededRandom(seed ^ Math.imul(attempt + 1, 2654435761));
      continue;
    }

    const score = scorePuzzle(rows, cols);
    if (score > bestScore) {
      bestScore = score;
      bestPuzzle = { date: dateStr, rows, cols };
    }

    if (score > 10) break;

    random = createSeededRandom(seed ^ Math.imul(attempt + 1, 2654435761));
  }

  if (bestPuzzle) return bestPuzzle;

  throw new Error(`Could not generate valid puzzle for ${dateStr}`);
}

export { drugs, CATEGORIES };
