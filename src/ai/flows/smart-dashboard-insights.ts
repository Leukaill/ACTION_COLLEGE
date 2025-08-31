'use server';

/**
 * @fileOverview An AI agent that provides personalized insights and course recommendations to students based on their academic history.
 *
 * - getSmartDashboardInsights - A function that retrieves personalized insights for the smart dashboard.
 * - SmartDashboardInsightsInput - The input type for the getSmartDashboardInsights function.
 * - SmartDashboardInsightsOutput - The return type for the getSmartDashboardInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartDashboardInsightsInputSchema = z.object({
  academicHistory: z
    .string()
    .describe(
      'A detailed summary of the student\'s academic history, including courses taken, grades received, and any relevant academic achievements or challenges.'
    ),
  studentGoals: z
    .string()
    .describe(
      'A description of the student\'s academic and career goals, including their desired GPA, graduation timeline, and career aspirations.'
    ),
});
export type SmartDashboardInsightsInput = z.infer<typeof SmartDashboardInsightsInputSchema>;

const SmartDashboardInsightsOutputSchema = z.object({
  insights: z.array(
    z.string().describe('Personalized insights based on the student\'s academic history and goals.')
  ),
  courseRecommendations: z.array(
    z.string().describe('Recommended courses based on the student\'s academic history and goals.')
  ),
});
export type SmartDashboardInsightsOutput = z.infer<typeof SmartDashboardInsightsOutputSchema>;

export async function getSmartDashboardInsights(input: SmartDashboardInsightsInput): Promise<SmartDashboardInsightsOutput> {
  return smartDashboardInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartDashboardInsightsPrompt',
  input: {schema: SmartDashboardInsightsInputSchema},
  output: {schema: SmartDashboardInsightsOutputSchema},
  prompt: `You are an AI assistant that provides personalized insights and course recommendations to students based on their academic history and goals.

  Analyze the student\'s academic history and goals, and provide personalized insights and course recommendations to help them make informed decisions about their studies.

  Academic History: {{{academicHistory}}}
  Student Goals: {{{studentGoals}}}

  Insights:
  -...

  Course Recommendations:
  -...
  `,
});

const smartDashboardInsightsFlow = ai.defineFlow(
  {
    name: 'smartDashboardInsightsFlow',
    inputSchema: SmartDashboardInsightsInputSchema,
    outputSchema: SmartDashboardInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
