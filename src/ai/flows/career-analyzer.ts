
'use server';
/**
 * @fileOverview AI agent for providing career-related analysis and advice.
 *
 * - analyzeResume - Analyzes a resume against a job description.
 * - ResumeAnalysisInput - The input type for the analyzeResume function.
 * - ResumeAnalysisOutput - The return type for the analyzeResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ResumeAnalysisInputSchema = z.object({
  resumeText: z.string().describe("The full text of the user's resume."),
  jobDescription: z.string().describe("The full text of the target job description."),
});
export type ResumeAnalysisInput = z.infer<typeof ResumeAnalysisInputSchema>;

const ResumeAnalysisOutputSchema = z.object({
    strengths: z.array(z.string()).describe("A list of specific strengths of the resume in relation to the job description."),
    areasForImprovement: z.array(z.string()).describe("A list of specific areas where the resume could be improved."),
    suggestedKeywords: z.array(z.string()).describe("A list of keywords from the job description that should be included in the resume."),
    overallFitScore: z.number().min(0).max(100).describe("A score from 0-100 indicating how well the resume matches the job description."),
});
export type ResumeAnalysisOutput = z.infer<typeof ResumeAnalysisOutputSchema>;

export async function analyzeResume(input: ResumeAnalysisInput): Promise<ResumeAnalysisOutput> {
  return resumeAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'resumeAnalysisPrompt',
  input: {schema: ResumeAnalysisInputSchema},
  output: {schema: ResumeAnalysisOutputSchema},
  prompt: `You are an expert career coach and resume writer. Your task is to analyze a student's resume against a specific job description and provide actionable feedback.

Analyze the provided resume and job description. Based on your analysis, provide the following:

1.  **Strengths**: Identify specific parts of the resume that align well with the job description. Be specific and quote examples if possible.
2.  **Areas for Improvement**: Pinpoint weaknesses or gaps in the resume. Suggest concrete changes, such as rephrasing bullet points, adding missing skills, or quantifying achievements.
3.  **Suggested Keywords**: Extract crucial keywords and phrases from the job description that are missing from the resume but should be included to pass through Applicant Tracking Systems (ATS).
4.  **Overall Fit Score**: Provide a numerical score from 0 to 100 that represents the resume's match for the job description.

**Resume Text:**
{{{resumeText}}}

**Job Description:**
{{{jobDescription}}}

Provide your response in the requested JSON format.`,
});

const resumeAnalysisFlow = ai.defineFlow(
  {
    name: 'resumeAnalysisFlow',
    inputSchema: ResumeAnalysisInputSchema,
    outputSchema: ResumeAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
