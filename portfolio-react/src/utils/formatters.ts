/** Count skills — TypeScript knows `skills` must be string[] */
export function formatSkillCount(skills: string[]): string {
  return `${skills.length} skills`;
}

/** Greet user — name must be string, age must be number */
export function greetUser(name: string, age: number): string {
  return `Mhoro ${name}, une makore ${age}.`;
}
