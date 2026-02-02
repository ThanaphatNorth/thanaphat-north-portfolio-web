/**
 * Utility functions for calculating years of experience
 */

export interface ExperienceYears {
  totalYears: number;
  leadershipYears: number;
  totalYearsDisplay: string;
  leadershipYearsDisplay: string;
}

/**
 * Calculate years from a start date to today
 * @param startDate - The start date string (YYYY-MM-DD format)
 * @returns Number of years (floored)
 */
export function calculateYears(startDate: string): number {
  const start = new Date(startDate);
  const today = new Date();
  
  let years = today.getFullYear() - start.getFullYear();
  
  // Adjust if we haven't reached the anniversary month/day yet
  const monthDiff = today.getMonth() - start.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < start.getDate())) {
    years--;
  }
  
  return Math.max(0, years);
}

/**
 * Format years for display (e.g., "8+")
 * @param years - Number of years
 * @returns Formatted string
 */
export function formatYearsDisplay(years: number): string {
  return `${years}+`;
}

/**
 * Calculate both total and leadership years
 * @param careerStartDate - Start date for career (YYYY-MM-DD)
 * @param leadershipStartDate - Start date for leadership roles (YYYY-MM-DD)
 * @returns ExperienceYears object
 */
export function calculateExperienceYears(
  careerStartDate: string,
  leadershipStartDate: string
): ExperienceYears {
  const totalYears = calculateYears(careerStartDate);
  const leadershipYears = calculateYears(leadershipStartDate);
  
  return {
    totalYears,
    leadershipYears,
    totalYearsDisplay: formatYearsDisplay(totalYears),
    leadershipYearsDisplay: formatYearsDisplay(leadershipYears),
  };
}

/**
 * Default start dates (fallback if database is unavailable)
 */
export const DEFAULT_CAREER_START_DATE = "2018-01-01";
export const DEFAULT_LEADERSHIP_START_DATE = "2021-01-01";

/**
 * Get default experience years (for fallback scenarios)
 */
export function getDefaultExperienceYears(): ExperienceYears {
  return calculateExperienceYears(
    DEFAULT_CAREER_START_DATE,
    DEFAULT_LEADERSHIP_START_DATE
  );
}
