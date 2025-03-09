import { jobQueue } from "../jobQueue";

jobQueue.processJobs("test", async (payload) => {
  console.log("Processing Test Job", payload);

  return new Promise((resolve) => setTimeout(resolve, 3_500));
});
