
'use server';

/**
 * @fileOverview AI-powered doctor suggestion flow.
 *
 * - suggestDoctors - A function that suggests relevant doctors based on user needs.
 * - SuggestDoctorsInput - The input type for the suggestDoctors function.
 * - SuggestDoctorsOutput - The return type for the suggestDoctors function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { adminDb } from "@/lib/firebase/firebase-admin";
import type { Doctor } from "@/lib/types";


const SuggestDoctorsInputSchema = z.object({
  needs: z.string().describe('The user inputted needs or description of their problem.'),
});
export type SuggestDoctorsInput = z.infer<typeof SuggestDoctorsInputSchema>;

const DoctorProfileSchema = z.object({
  name: z.string().describe('The name of the doctor.'),
  title: z.string().describe('The title of the doctor.'),
  specialty: z.string().describe('The medical specialty of the doctor.'),
  photoUrl: z.string().describe('The URL of the doctor profile photo.'),
});

const SuggestDoctorsOutputSchema = z.array(DoctorProfileSchema).describe('An array of suggested doctor profiles.');
export type SuggestDoctorsOutput = z.infer<typeof SuggestDoctorsOutputSchema>;

export async function suggestDoctors(input: SuggestDoctorsInput): Promise<SuggestDoctorsOutput> {
  return suggestDoctorsFlow(input);
}

const getDoctors = ai.defineTool({
  name: 'getDoctors',
  description: 'Retrieves a list of doctor profiles from the database.',
  inputSchema: z.object({}), // No input needed, it fetches all doctors
  outputSchema: z.array(DoctorProfileSchema),
},
async () => {
  if (!adminDb) {
    throw new Error("Firebase Admin DB not initialized.");
  }
  // Fetch doctors from Firestore
  const doctorsCollection = adminDb.collection("doctors");
  const querySnapshot = await doctorsCollection.get();
  
  const doctorsFromDb = querySnapshot.docs.map(doc => {
      const data = doc.data() as Doctor;
      return {
        name: data.name,
        title: data.specialty, // The public-facing pages use specialty as the title
        specialty: data.specialty,
        photoUrl: data.avatar, // The 'avatar' field in Firestore holds the photo URL
      }
  });

  return doctorsFromDb;
});

const prompt = ai.definePrompt({
  name: 'suggestDoctorsPrompt',
  tools: [getDoctors],
  input: {schema: SuggestDoctorsInputSchema},
  output: {schema: SuggestDoctorsOutputSchema},
  prompt: `Based on the user's needs: "{{needs}}", suggest the most relevant doctors from the available profiles.

  Use the getDoctors tool to retrieve all available doctor profiles.
  From that list, return only the doctors that are most relevant to the user's needs.
  Do not include any introductory or concluding sentences.
  Output should be a JSON array of doctor profiles.
  `
});

const suggestDoctorsFlow = ai.defineFlow(
  {
    name: 'suggestDoctorsFlow',
    inputSchema: SuggestDoctorsInputSchema,
    outputSchema: SuggestDoctorsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
