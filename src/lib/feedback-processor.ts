import { GoogleGenerativeAI } from "@google/generative-ai";
import { IssuePriority, IssueStatus } from "./issue-store";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export interface AIProposedTask {
    title: string;
    description: string;
    status: IssueStatus;
    priority: IssuePriority;
}

export const processFeedback = async (text: string): Promise<AIProposedTask[]> => {
    try {
        if (!import.meta.env.VITE_GEMINI_API_KEY) {
            throw new Error("Missing Gemini API Key. Please add VITE_GEMINI_API_KEY to your .env file.");
        }

        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `
        Analyze the following feedback text and extract actionable tasks for an issue tracker.
        Return ONLY a raw JSON array of objects (no markdown code blocks, no explanation).
        
        Each object in the array should have these fields:
        - title: A concise summary of the task (max 50 chars).
        - description: The full context of the task based on the feedback.
        - status: Always use "OPEN".
        - priority: Infer "LOW", "MEDIUM", or "HIGH" based on urgency and emotion in the text. Default to "MEDIUM".
        
        Feedback Text:
        "${text}"
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textResponse = response.text();

        // Clean up markdown code blocks if the model includes them despite instructions
        const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();

        const tasks: AIProposedTask[] = JSON.parse(cleanJson);
        
        // Validate the structure slightly (optional but good for TS safety at runtime)
        return tasks.map(task => ({
            ...task,
            status: 'OPEN', // Enforce OPEN for new tasks
            priority: ['LOW', 'MEDIUM', 'HIGH'].includes(task.priority) ? task.priority : 'MEDIUM'
        }));

    } catch (error: any) {
        console.error("Error processing feedback with AI:", error);

        let errorMessage = "Failed to process feedback via AI.";

        if (error.message?.includes("429") || error.message?.toLowerCase().includes("quota") || error.message?.toLowerCase().includes("limit")) {
            errorMessage = "AI Usage Limit Exceeded. Please wait a minute and try again.";
        } else if (error.message?.includes("503")) {
            errorMessage = "AI Service Temporary Unavailable. Please try again.";
        } else if (error.message) {
             errorMessage = error.message;
        }

        throw new Error(errorMessage);
    }
};
