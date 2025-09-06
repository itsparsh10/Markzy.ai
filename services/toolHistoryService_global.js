/**
 * Tool History Service
 * Handles saving, fetching, and deleting tool usage history from MongoDB
 */

// --------------------------------------------
// Save tool history to MongoDB
// --------------------------------------------
/**
 * Save tool history to MongoDB
 * @param {Object} params
 * @param {string} params.toolName
 * @param {string} params.toolId
 * @param {Object} params.outputResult
 * @param {string} [params.prompt]
 * @param {string} [params.userId]
 * @returns {Promise<Object>}
 */
export async function saveToolHistory({
	toolName,
	toolId,
	outputResult,
	prompt = null,
	userId = null,
  }) {
	try {
	  // Get user ID from localStorage if not provided
	  if (!userId) {
		const userData = JSON.parse(localStorage.getItem("userData") || "{}");
		userId = userData._id || userData.id;
	  }
  
	  if (!userId) {
		console.warn("⚠️ No user ID found, skipping history save");
		return { success: false, message: "No user ID found" };
	  }
  
	  const historyData = {
		userId,
		toolName,
		toolId,
		outputResult,
		prompt,
		generatedDate: new Date().toISOString(),
	  };
  
	  console.log("💾 Saving tool history:", historyData);
  
	  const response = await fetch("/api/save-history", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(historyData),
	  });
  
	  if (response.ok) {
		console.log("✅ Tool history saved successfully");
		return { success: true, message: "Tool history saved successfully" };
	  } else {
		const errorData = await response.json();
		console.warn("⚠️ Failed to save tool history:", errorData.error);
		return {
		  success: false,
		  message: errorData.error || "Failed to save tool history",
		};
	  }
	} catch (error) {
	  console.warn("⚠️ Error saving tool history:", error);
	  return { success: false, message: "Error saving tool history", error };
	}
  }
  
  // --------------------------------------------
  // Save silently (won't break UI if failed)
  // --------------------------------------------
  /**
   * Save tool history silently
   * @param {Object} params
   * @returns {Promise<void>}
   */
  export async function saveToolHistorySilent({
	toolName,
	toolId,
	outputResult,
	prompt = null,
	userId = null,
  }) {
	try {
	  await saveToolHistory({ toolName, toolId, outputResult, prompt, userId });
	} catch (error) {
	  console.warn("⚠️ Failed to save tool history silently:", error);
	}
  }
  
  // --------------------------------------------
  // Get tool history for a specific user
  // --------------------------------------------
  /**
   * Get tool history for a user
   * @param {string} userId
   * @param {string} [toolName]
   * @returns {Promise<Array>}
   */
  export async function getToolHistory(userId, toolName = null) {
	try {
	  if (!userId) {
		console.warn("⚠️ No user ID provided for fetching tool history");
		return [];
	  }
  
	  let url = `/api/save-history?userId=${userId}`;
	  if (toolName) {
		url += `&toolName=${encodeURIComponent(toolName)}`;
	  }
  
	  const response = await fetch(url, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	  });
  
	  if (response.ok) {
		const data = await response.json();
		return data.history || [];
	  }
  
	  const errorData = await response.json();
	  console.warn("⚠️ Failed to fetch tool history:", errorData.error);
	  return [];
	} catch (error) {
	  console.warn("⚠️ Error fetching tool history:", error);
	  return [];
	}
  }
  
  // --------------------------------------------
  // Delete tool history by ID
  // --------------------------------------------
  /**
   * Delete a history record
   * @param {string} historyId
   * @returns {Promise<Object>}
   */
  export async function deleteToolHistory(historyId) {
	try {
	  const response = await fetch(`/api/save-history/${historyId}`, {
		method: "DELETE",
		headers: { "Content-Type": "application/json" },
	  });
  
	  if (response.ok) {
		console.log("✅ Tool history deleted successfully");
		return { success: true, message: "Tool history deleted successfully" };
	  } else {
		const errorData = await response.json();
		console.warn("⚠️ Failed to delete tool history:", errorData.error);
		return {
		  success: false,
		  message: errorData.error || "Failed to delete tool history",
		};
	  }
	} catch (error) {
	  console.warn("⚠️ Error deleting tool history:", error);
	  return { success: false, message: "Error deleting tool history", error };
	}
  }
  