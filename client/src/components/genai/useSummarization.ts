import { useState } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";

interface SummarizationResult {
  summary: string;
  originalLength: number;
  summaryLength: number;
}

export const useSummarization = () => {
  const [summarizing, setSummarizing] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState("");

  const summarizeContent = async (
    content: string,
    entryId?: string,
  ): Promise<SummarizationResult | null> => {
    if (!content || content.trim().length < 50) {
      toast.error("Please write at least 50 characters to generate a summary.");
      return null;
    }

    setSummarizing(true);
    try {
      const endpoint = entryId
        ? `/entries/${entryId}/summarize`
        : `/entries/summarize`;

      const response = await axios.post(endpoint, {
        content: content,
      });

      const result: SummarizationResult = {
        summary: response.data.summary,
        originalLength: response.data.originalLength,
        summaryLength: response.data.summaryLength,
      };

      setGeneratedSummary(result.summary);
      toast.success("Summary generated successfully!");
      return result;
    } catch (error: unknown) {
      console.error("Summarization error:", error);

      let errorMessage = "Failed to generate summary.";

      if (error && typeof error === "object" && "response" in error) {
        const response = (
          error as {
            response?: { data?: { message?: string }; status?: number };
          }
        ).response;
        if (response?.data?.message) {
          errorMessage = response.data.message;
        } else if (response?.status === 500) {
          errorMessage =
            "AI summarization is not configured. Please contact the administrator.";
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      return null;
    } finally {
      setSummarizing(false);
    }
  };

  const clearSummary = () => {
    setGeneratedSummary("");
  };

  return {
    summarizing,
    generatedSummary,
    summarizeContent,
    clearSummary,
  };
};
