export default function logger(error: unknown) {
  if (process.env.NODE_ENV === "development") {
    console.log("Error:", error);
  }
}
