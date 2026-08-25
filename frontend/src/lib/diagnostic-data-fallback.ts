/**
 * Workbook-backed fallback for the laboratory catalogue.
 * The API can enrich these rows, but the workbook remains authoritative for
 * the public names, departments, and rates.
 */

export {
  CANONICAL_LAB_CATEGORIES as FALLBACK_LAB_CATEGORIES,
  CANONICAL_LAB_TESTS as FALLBACK_LAB_TESTS,
} from './lab-price-list';
