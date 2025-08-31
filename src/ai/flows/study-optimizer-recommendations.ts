'use server';

/**
 * @fileOverview AI-powered study time and resource optimizer.
 *
 * - getStudyRecommendations - A function that provides personalized study recommendations.
 * - StudyRecommendationsInput - The input type for the getStudyRecommendations function.
 * - StudyRecommendationsOutput - The return type for the getStudyRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StudyRecommendationsInputSchema = z.object({
  schedule: z
    .string()
    .describe('The student’s current schedule, including class times and other commitments.'),
  learningStyle: z
    .string()
    .describe(
      'A description of the student’s preferred learning style (e.g., visual, auditory, kinesthetic).'
    ),
  courses: z
    .string()
    .describe('A list of courses the student is currently taking.'),
  academicGoals: z
    .string()
    .describe('The student’s academic goals (e.g., improve GPA, master specific subjects).'),
});
export type StudyRecommendationsInput = z.infer<typeof StudyRecommendationsInputSchema>;

const StudyRecommendationsOutputSchema = z.object({
  optimalStudyTimes: z.array(z.object({
    day: z.string().describe("The day of the week for the study session."),
    time: z.string().describe("The suggested time slot (e.g., '7:00 PM - 8:00 PM')."),
    activity: z.string().describe("The recommended study activity or subject."),
  })).describe('A list of suggested optimal times for studying.'),
  recommendedResources: z.array(z.object({
    title: z.string().describe("The title of the resource."),
    type: z.string().describe("The type of resource (e.g., Video, Article, Book, Website)."),
    url: z.string().optional().describe("An optional URL for the resource."),
  })).describe(
      'A list of recommended study resources tailored to the student’s courses and learning style.'
    ),
  personalizedLearningTips: z.array(z.object({
    title: z.string().describe("A short, catchy title for the learning tip."),
    description: z.string().describe("A detailed explanation of the learning tip."),
  })).describe(
      'A list of personalized tips for improving learning and retention based on the student’s learning style and academic goals.'
    ),
});
export type StudyRecommendationsOutput = z.infer<typeof StudyRecommendationsOutputSchema>;

export async function getStudyRecommendations(
  input: StudyRecommendationsInput
): Promise<StudyRecommendationsOutput> {
  return studyRecommendationsFlow(input);
}

const studyRecommendationsPrompt = ai.definePrompt({
  name: 'studyRecommendationsPrompt',
  input: {schema: StudyRecommendationsInputSchema},
  output: {schema: StudyRecommendationsOutputSchema},
  prompt: `You are an AI-powered study optimizer. Analyze the student's schedule, learning style, courses, and academic goals to provide personalized study recommendations.

Schedule: {{{schedule}}}
Learning Style: {{{learningStyle}}}
Courses: {{{courses}}}
Academic Goals: {{{academicGoals}}}

Based on this information, provide:

1.  Optimal Study Times: A list of specific time slots for studying, broken down by day, time, and recommended activity.
2.  Recommended Resources: A list of resources tailored to the student's courses and learning style. Each resource should have a title and a type (e.g., Video, Article, Book).
3.  Personalized Learning Tips: A list of personalized tips for improving learning and retention. Each tip should have a clear title and a description.

Format your response as a JSON object that matches the provided output schema. Be as detailed as possible.`,
});

const studyRecommendationsFlow = ai.defineFlow(
  {
    name: 'studyRecommendationsFlow',
    inputSchema: StudyRecommendationsInputSchema,
    outputSchema: StudyRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await studyRecommendationsPrompt(input);
    return output!;
  }
);
