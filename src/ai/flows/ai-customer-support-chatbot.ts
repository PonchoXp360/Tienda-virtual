'use server';
/**
 * @fileOverview Chatbot de soporte al cliente con herramienta de búsqueda de productos.
 * Usa el catálogo real desde las server actions (con fallback a datos mock).
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'genkit';
import { searchProducts, getAllProducts } from '@/lib/actions/products';

// ─────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────

const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  stock: z.number().int().min(0),
  category: z.string(),
});

const CustomerSupportChatInputSchema = z.string().describe("Consulta del usuario.");
export type CustomerSupportChatInput = z.infer<typeof CustomerSupportChatInputSchema>;
export type CustomerSupportChatOutput = string;

const InternalChatOutputSchema = z.object({
  response: z.string().describe("Respuesta del asistente."),
});

const CustomerSupportPromptInputSchema = z.object({
  input: z.string(),
  currentDate: z.string(),
});

// ─────────────────────────────────────────────
// Tool: búsqueda de productos en el catálogo real
// ─────────────────────────────────────────────

const getProductDetails = ai.defineTool(
  {
    name: 'getProductDetails',
    description:
      'Busca productos en el catálogo por nombre o descripción. Deja el query vacío para listar todos.',
    inputSchema: z.object({
      query: z.string().describe('Término de búsqueda. Vacío = todos los productos.'),
    }),
    outputSchema: z.array(ProductSchema),
  },
  async ({ query }) => {
    if (!query.trim()) {
      return getAllProducts();
    }
    return searchProducts(query);
  }
);

// ─────────────────────────────────────────────
// Prompt
// ─────────────────────────────────────────────

const customerSupportPrompt = ai.definePrompt({
  name: 'customerSupportPrompt',
  model: googleAI.model('gemini-2.0-flash'),
  input: { schema: CustomerSupportPromptInputSchema },
  output: { schema: InternalChatOutputSchema },
  tools: [getProductDetails],
  system: `Eres OmniShop, asistente virtual de ChAcHaRiTaS. Fecha de hoy: {{currentDate}}.

Reglas:
- Usa la herramienta getProductDetails para responder preguntas sobre productos, precios, stock y disponibilidad.
- Si no encuentras un producto, informa que no está en el catálogo.
- Responde siempre en español, de forma amable y concisa.
- Tu respuesta final debe ser el campo "response" en JSON.`,
  prompt: `Consulta del cliente: {{{input}}}`,
});

// ─────────────────────────────────────────────
// Flow
// ─────────────────────────────────────────────

const customerSupportChatFlow = ai.defineFlow(
  {
    name: 'customerSupportChatFlow',
    inputSchema: CustomerSupportChatInputSchema,
    outputSchema: InternalChatOutputSchema,
  },
  async (input) => {
    const currentDate = new Date().toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const { output } = await customerSupportPrompt({ input, currentDate });
    return output!;
  }
);

// ─────────────────────────────────────────────
// Exported function
// ─────────────────────────────────────────────

export async function customerSupportChat(
  input: CustomerSupportChatInput
): Promise<CustomerSupportChatOutput> {
  const result = await customerSupportChatFlow(input);
  return result.response;
}
