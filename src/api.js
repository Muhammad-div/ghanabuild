// Enhanced API integration with timeout and error handling
export async function getCostEstimate(userInput) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
  try {
    const response = await fetch(
      process.env.REACT_APP_API_URL + '/estimate',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userInput),
        signal: controller.signal,
      }
    );
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.cost;
  } catch (error) {
    console.error('API Error:', error);
    if (error.name === 'AbortError') throw new Error('Request timed out');
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}