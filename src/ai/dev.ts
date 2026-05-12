import { config } from 'dotenv';
config();

// ai-product-recommendations no longer uses Genkit (replaced with Prisma query in 2026-05-12)
import '@/ai/flows/ai-customer-support-chatbot.ts';