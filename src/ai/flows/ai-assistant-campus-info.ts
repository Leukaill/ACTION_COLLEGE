
'use server';
/**
 * @fileOverview AI assistant for providing campus information.
 *
 * - getCampusInfo - A function that retrieves campus information based on user query.
 * - getCampusInfoStream - A function that retrieves campus information as a stream.
 * - CampusInfoInput - The input type for the getCampusInfo function.
 * - CampusInfoOutput - The return type for the getCampusInfo function.
 */

import {ai} from '@/ai/genkit';
import { getCampusEvents as fetchEvents, getCampusLocations as fetchLocations } from '@/services/campus-data';
import {z} from 'genkit';

const getCampusEventsTool = ai.defineTool(
  {
    name: 'getCampusEvents',
    description: 'Get a list of upcoming campus events.',
    inputSchema: z.object({}),
    outputSchema: z.array(z.object({
      name: z.string().describe("The name of the event."),
      date: z.string().describe("The date of the event."),
      time: z.string().describe("The time of the event."),
      location: z.string().describe("The location of the event."),
    })),
  },
  async () => {
    // In a real application, this would fetch data from a database or a university API.
    return fetchEvents();
  }
);
// We are exporting this separately so the frontend can call it directly.
export const getCampusEvents = getCampusEventsTool;


const getCampusLocations = ai.defineTool(
  {
    name: 'getCampusLocations',
    description: 'Get information about campus locations, including their status and details.',
    inputSchema: z.object({ 
      locationName: z.string().optional().describe("The name of the location to find. If omitted, return all locations.") 
    }),
    outputSchema: z.array(z.object({
      name: z.string().describe("The name of the location."),
      category: z.string().describe("The category of the location (e.g., Academic, Dining)."),
      status: z.string().describe("The current status (e.g., Open, Closed)."),
      details: z.string().describe("Additional details like closing times or special notes."),
      capacity: z.string().describe("How busy the location is."),
      icon: z.string().describe("The name of the Lucide icon to use."),
      color: z.string().describe("The Tailwind CSS color class for the icon."),
      bgColor: z.string().describe("The Tailwind CSS background color class for the icon container."),
    })),
  },
  async ({ locationName }) => {
    const locations = await fetchLocations();
    // In a real application, this would fetch data from a database or a university API.
    if (locationName) {
      return locations.filter(loc => loc.name.toLowerCase().includes(locationName.toLowerCase()));
    }
    return locations;
  }
);
// We are exporting this separately so the frontend can call it directly.
export const getLocations = getCampusLocations;


const CampusInfoInputSchema = z.object({
  query: z.string().describe('The user query for campus information.'),
});
export type CampusInfoInput = z.infer<typeof CampusInfoInputSchema>;

const CampusInfoOutputSchema = z.object({
  answer: z.string().describe('The answer to the user query about campus information.'),
});
export type CampusInfoOutput = z.infer<typeof CampusInfoOutputSchema>;


const campusInfoPrompt = ai.definePrompt({
  name: 'campusInfoPrompt',
  tools: [getCampusEvents, getCampusLocations],
  prompt: `You are a helpful AI assistant for a university campus.
  Answer the following question about the campus:
  {{query}}
  
  If the user asks about events, use the getCampusEvents tool to provide accurate, real-time information.
  If the user asks about a location, use the getCampusLocations tool to provide details.
  Do not make up information. If the tools return no information, say that you cannot find the information.
  `,
});

const getCampusInfoFlow = ai.defineFlow({
    name: 'getCampusInfoFlow',
    inputSchema: CampusInfoInputSchema,
    outputSchema: CampusInfoOutputSchema
}, async (input) => {
    const {output} = await campusInfoPrompt(input);
    return output!;
});


export async function getCampusInfo(input: CampusInfoInput): Promise<CampusInfoOutput> {
  return getCampusInfoFlow(input);
}

export async function getCampusInfoStream(input: CampusInfoInput) {
    const { stream } = ai.generateStream({
        prompt: `You are a helpful AI assistant for a university campus.
        Answer the following question about the campus:
        ${input.query}
        
        If you can't answer, say so.`,
        tools: [getCampusEvents, getCampusLocations],
    });
    return stream;
}
