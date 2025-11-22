export interface CalculationResult {
  year: number;
  balance: number;
  contributions: number;
  interest: number;
}

export interface CalculatorInputs {
  principal: number;
  rate: number;
  time: number;
  contribution: number;
}

export function calculateCompoundInterest(inputs: CalculatorInputs): CalculationResult[] {
  const { principal, rate, time, contribution } = inputs;
  const r = rate / 100;
  const results: CalculationResult[] = [];

  let currentBalance = principal;
  let totalContributions = principal;

  // Initial state (Year 0)
  results.push({
    year: 0,
    balance: Number(principal.toFixed(2)),
    contributions: Number(principal.toFixed(2)),
    interest: 0,
  });

  for (let year = 1; year <= time; year++) {
    const interestForYear = currentBalance * r;
    currentBalance += interestForYear + contribution;
    totalContributions += contribution;

    results.push({
      year,
      balance: Number(currentBalance.toFixed(2)),
      contributions: Number(totalContributions.toFixed(2)),
      interest: Number((currentBalance - totalContributions).toFixed(2)),
    });
  }

  return results;
}
