
export default function convertToStory(summary, title, source) {
  if (!summary || summary.trim() === "") return "This article doesn't have a detailed summary yet.";

  // Basic transformation to make it sound like a narration
  return `Here's what happened: ${summary.trim()} This update comes from ${source}, reported in an article titled "${title}".`;
}
