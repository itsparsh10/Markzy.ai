// Utility functions for tool handling and SEO-friendly URLs

// Tool interface
export interface Tool {
  id: number;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  bgColor: string;
  estimatedTime: string;
  category: string[];
  isFavorite?: boolean;
}

// Utility function to convert tool title to SEO-friendly slug
export const createSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
};

// Note: toolsData will be imported from ToolsGrid component to avoid duplication
// We'll create a function to find tool by slug that can be used in both components
export const findToolBySlugFromList = (slug: string, toolsList: Tool[]): Tool | undefined => {
  return toolsList.find(tool => createSlug(tool.title) === slug);
};

// Utility function to get slug from tool ID
export const getSlugFromToolId = (toolId: number, toolsList: Tool[]): string => {
  const tool = toolsList.find(tool => tool.id === toolId);
  return tool ? createSlug(tool.title) : `tool-${toolId}`;
};
