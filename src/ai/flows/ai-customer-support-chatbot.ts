'use server';
/**
 * @fileOverview An AI chatbot flow for customer support that can answer questions about product details.
 *
 * - customerSupportChat - A function that handles customer support queries using an AI chatbot.
 * - CustomerSupportChatInput - The input type for the customerSupportChat function.
 * - CustomerSupportChatOutput - The return type for the customerSupportChat function.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'genkit';

// --- Schemas ---

// Schema for a single product, based on the provided database schema
const ProductSchema = z.object({
  id: z.string().describe('Unique identifier for the product.'),
  name: z.string().describe('The name of the product.'),
  description: z.string().describe('A detailed description of the product.'),
  price: z.number().describe('The price of the product.'),
  imageUrl: z.string().url().describe('URL to the product image.'),
  stock: z.number().int().min(0).describe('Current stock level of the product.'),
});

const CustomerSupportChatInputSchema = z.string().describe("The user's query to the chatbot.");
export type CustomerSupportChatInput = z.infer<typeof CustomerSupportChatInputSchema>;

// The public function will still return a string
export type CustomerSupportChatOutput = string;

// Internal schema for the prompt's output, wrapped in an object to improve reliability
const InternalChatOutputSchema = z.object({
  response: z.string().describe("The chatbot's response to the query."),
});

const CustomerSupportPromptInputSchema = z.object({
  input: z.string().describe("The user's query to the chatbot."),
  currentDate: z.string().describe('The current date for context.'),
});

// --- Mock Product Data (for demonstration) ---
const mockProducts = [
  {
    id: 'prod_001',
    name: 'Teclado Mecánico RGB',
    description: 'Teclado mecánico retroiluminado con switches Gateron Brown, diseño ergonómico y 104 teclas. Ideal para gaming y trabajo.',
    price: 89.99,
    imageUrl: 'https://example.com/images/keyboard.jpg',
    stock: 15,
  },
  {
    id: 'prod_002',
    name: 'Ratón Inalámbrico Ergonómico',
    description: 'Ratón óptico inalámbrico con diseño ergonómico, 6 botones programables y DPI ajustable (hasta 1600).', 
    price: 29.50,
    imageUrl: 'https://example.com/images/mouse.jpg',
    stock: 30,
  },
  {
    id: 'prod_003',
    name: 'Monitor Curvo Gaming 27 pulgadas',
    description: 'Monitor de 27 pulgadas con panel VA curvo, resolución Full HD, 144Hz de tasa de refresco y 1ms de tiempo de respuesta. Compatible con FreeSync.',
    price: 299.00,
    imageUrl: 'https://example.com/images/monitor.jpg',
    stock: 8,
  },
  {
    id: 'prod_004',
    name: 'Auriculares Gaming con Micrófono',
    description: 'Auriculares estéreo con sonido envolvente 7.1, micrófono retráctil con cancelación de ruido y almohadillas de memoria para máxima comodidad.',
    price: 59.99,
    imageUrl: 'https://example.com/images/headset.jpg',
    stock: 22,
  },
  {
    id: 'prod_005',
    name: 'Webcam HD 1080p',
    description: 'Webcam con resolución Full HD 1080p a 30fps, enfoque automático y micrófono dual integrado. Perfecta para videollamadas y streaming.',
    price: 45.00,
    imageUrl: 'https://example.com/images/webcam.jpg',
    stock: 12,
  },
];

// --- Tools ---

/**
 * Genkit tool to retrieve details of products from a simulated catalog.
 * In a real application, this would interact with a database or an API.
 */
const getProductDetails = ai.defineTool(
  {
    name: 'getProductDetails',
    description: 'Retrieves details for a specific product or lists products based on a search query from the product catalog.',
    inputSchema: z.object({
      query: z.string().describe('The name or part of the name of the product to search for. Leave empty to list all products.'),
    }),
    outputSchema: z.array(ProductSchema).describe('A list of products matching the search query, or all products if no query is provided.'),
  },
  async ({ query }) => {
    // Simulate database lookup
    if (!query) {
      return mockProducts;
    }
    const lowerCaseQuery = query.toLowerCase();
    return mockProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerCaseQuery) ||
        p.description.toLowerCase().includes(lowerCaseQuery)
    );
  }
);

// --- Prompt ---

const customerSupportPrompt = ai.definePrompt({
  name: 'customerSupportPrompt',
  model: googleAI.model('gemini-1.0-pro'),
  input: { schema: CustomerSupportPromptInputSchema },
  output: { schema: InternalChatOutputSchema },
  tools: [getProductDetails],
  system: `You are OmniShop, an AI customer support assistant. Your goal is to provide helpful and accurate information to customers.

- Use the 'getProductDetails' tool to answer questions about specific products, their features, specifications, price, stock, or availability.
- If a customer asks a general question, try to answer it based on your general knowledge.
- If you cannot find a product, inform the user that the product is not in the catalog.
- Always be polite and professional.
- Your final answer must be a JSON object with a 'response' field containing your reply.

Here is the current date: {{currentDate}}.`,
  prompt: `Customer Query: {{{input}}}`,
});

// --- Flow ---

const customerSupportChatFlow = ai.defineFlow(
  {
    name: 'customerSupportChatFlow',
    inputSchema: CustomerSupportChatInputSchema,
    outputSchema: InternalChatOutputSchema,
  },
  async (input) => {
    // Provide currentDate to the prompt if needed, for context-aware responses.
    const currentDate = new Date().toLocaleDateString();
    const { output } = await customerSupportPrompt({
      input: input,
      currentDate: currentDate,
    });
    return output!;
  }
);

// --- Exported Wrapper Function ---

export async function customerSupportChat(input: CustomerSupportChatInput): Promise<CustomerSupportChatOutput> {
  const result = await customerSupportChatFlow(input);
  return result.response;
}
