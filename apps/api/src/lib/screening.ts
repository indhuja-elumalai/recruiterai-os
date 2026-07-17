interface ScreeningInput {
  candidateName: string;
  currentTitle: string;
  jobTitle: string;
  jobSkills: string[];
  stage: "SCREENING" | "TECHNICAL" | "MANAGER" | "FINAL";
}

export function generateInterviewQuestions(input: ScreeningInput): string[] {
  const skillQuestions = input.jobSkills
    .slice(0, 3)
    .map(
      (skill) =>
        `Describe a specific project where you used ${skill}. What was your contribution and measurable outcome?`,
    );
  const stageQuestion = {
    SCREENING: `What interests you about the ${input.jobTitle} role, and what would make your next opportunity successful?`,
    TECHNICAL: `Walk through a difficult technical trade-off you made recently. What alternatives did you evaluate?`,
    MANAGER: `How do you prioritize delivery, quality, and stakeholder expectations when they conflict?`,
    FINAL: `What impact would you aim to deliver in your first 90 days in this role?`,
  }[input.stage];

  return [
    stageQuestion,
    ...skillQuestions,
    `Tell us about a time you received difficult feedback and how you applied it.`,
  ].slice(0, 5);
}
