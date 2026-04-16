'use server';
/**
 * @fileOverview An AI agent that provides product recommendations based on a given product.
 *
 * - getProductRecommendations - A function that handles the product recommendation process.
 * - AIProductRecommendationsInput - The input type for the getProductRecommendations function.
 * - AIProductRecommendationsOutput - The return type for the getProductRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIProductRecommendationsInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productDescription: z.string().describe('A detailed description of the product.'),
  productCategory: z.string().describe('The category of the product.'),
  productPrice: z.number().describe('The price of the product.'),
});
export type AIProductRecommendationsInput = z.infer<typeof AIProductRecommendationsInputSchema>;

const RecommendedProductSchema = z.object({
  id: z.string().describe('The unique identifier of the recommended product.'),
  name: z.string().describe('The name of the recommended product.'),
  description: z.string().describe('A brief description of the recommended product.'),
  price: z.number().describe('The price of the recommended product.'),
  imageUrl: z.string().url().describe('The URL of the image for the recommended product.'),
});

const AIProductRecommendationsOutputSchema = z.object({
  recommendations: z.array(RecommendedProductSchema).describe('A list of recommended products.'),
});
export type AIProductRecommendationsOutput = z.infer<typeof AIProductRecommendationsOutputSchema>;

export async function getProductRecommendations(
  input: AIProductRecommendationsInput
): Promise<AIProductRecommendationsOutput> {
  return aiProductRecommendationsFlow(input);
}

const productRecommendationsPrompt = ai.definePrompt({
  name: 'productRecommendationsPrompt',
  input: {schema: AIProductRecommendationsInputSchema},
  output: {schema: AIProductRecommendationsOutputSchema},
  prompt: `You are an expert e-commerce assistant whose goal is to recommend complementary or similar products based on a given product. You should provide 3 to 5 recommendations.

Here is the main product:
Name: {{{productName}}}
Description: {{{productDescription}}}
Category: {{{productCategory}}}
Price: ${{{productPrice}}}

Based on this product, suggest other relevant products that a customer might be interested in. Think about complementary items, upgrades, or similar alternatives. For each recommendation, provide a unique ID, a name, a brief description, a price, and a hypothetical image URL.
`,
});

const aiProductRecommendationsFlow = ai.defineFlow(
  {
    name: 'aiProductRecommendationsFlow',
    inputSchema: AIProductRecommendationsInputSchema,
    outputSchema: AIProductRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await productRecommendationsPrompt(input);
    if (!output) {
      throw new Error('No recommendations generated.');
    }
    return output;
  }
);
