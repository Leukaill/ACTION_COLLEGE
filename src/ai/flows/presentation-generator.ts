'use server';
/**
 * @fileOverview An AI flow for generating presentations with text and images.
 *
 * - generatePresentation - Generates a presentation outline and images for a given topic.
 * - PresentationInput - The input type for the generatePresentation function.
 * - Presentation - The return type for the generatePresentation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PresentationInputSchema = z.object({
  topic: z.string().describe('The topic for the presentation.'),
});
export type PresentationInput = z.infer<typeof PresentationInputSchema>;

const SlideSchema = z.object({
  title: z.string().describe('The title of the slide.'),
  points: z.array(z.string()).describe('A list of bullet points for the slide.'),
  imagePrompt: z.string().describe('A descriptive prompt for generating an image for this slide.'),
});

const PresentationOutputSchema = z.object({
  title: z.string().describe('The main title of the presentation.'),
  slides: z.array(z.object({
    title: z.string(),
    points: z.array(z.string()),
    imageUrl: z.string().url().optional(),
  })),
});
export type Presentation = z.infer<typeof PresentationOutputSchema>;

// This flow doesn't need to be exported to the client directly
const presentationGenerationFlow = ai.defineFlow(
  {
    name: 'presentationGenerationFlow',
    inputSchema: PresentationInputSchema,
    outputSchema: PresentationOutputSchema,
  },
  async ({ topic }) => {
    // Step 1: Generate the presentation outline (text content)
    const { output: presentationOutline } = await ai.generate({
        prompt: `Create a presentation outline for the topic: "${topic}". 
        The presentation should have a main title and 3-5 slides. 
        Each slide must have a title and 3-4 bullet points.
        For each slide, also provide a short, descriptive prompt that can be used to generate a relevant image.
        The image prompt should be simple and visually descriptive. For example: "A scientist looking at a glowing test tube" or "A world map with connected nodes".`,
        output: {
            schema: z.object({
                title: z.string(),
                slides: z.array(SlideSchema)
            })
        },
        model: 'googleai/gemini-2.0-flash',
    });

    if (!presentationOutline) {
      throw new Error('Failed to generate presentation outline.');
    }
    
    // Step 2: Generate an image for each slide in parallel
    const imagePromises = presentationOutline.slides.map(async (slide) => {
        try {
            const { media } = await ai.generate({
                model: 'googleai/gemini-2.0-flash-preview-image-generation',
                prompt: `Generate an image for a presentation slide about "${topic}". The slide is titled "${slide.title}". The image should represent: ${slide.imagePrompt}. Use a vibrant and professional style.`,
                config: {
                    responseModalities: ['TEXT', 'IMAGE'],
                },
            });
            return media?.url || null;
        } catch (error) {
            console.error(`Failed to generate image for slide "${slide.title}":`, error);
            // Return null if a single image generation fails, so the whole process doesn't stop.
            return null;
        }
    });

    const imageUrls = await Promise.all(imagePromises);

    // Step 3: Combine text and images into the final presentation object
    const finalPresentation: Presentation = {
      title: presentationOutline.title,
      slides: presentationOutline.slides.map((slide, index) => ({
        title: slide.title,
        points: slide.points,
        imageUrl: imageUrls[index] || undefined, // Use generated URL or undefined
      })),
    };

    return finalPresentation;
  }
);


// Exported wrapper function for the client to call
export async function generatePresentation(input: PresentationInput): Promise<Presentation> {
    return presentationGenerationFlow(input);
}
