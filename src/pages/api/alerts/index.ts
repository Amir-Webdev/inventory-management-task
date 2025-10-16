// pages/api/alerts/index.ts
import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";
import { alertSchema, alertsSchema, type Alert } from "../../../types";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const filePath = path.join(process.cwd(), "data", "alerts.json");
  const jsonData = fs.readFileSync(filePath);
  let alerts: Alert[] = JSON.parse(jsonData.toString());

  if (req.method === "GET") {
    const parsed = alertsSchema.safeParse(alerts);
    if (!parsed.success)
      return res.status(500).json({ message: "Invalid data" });
    res.status(200).json(parsed.data);
  } else if (req.method === "POST") {
    const bodyParsed = alertSchema
      .omit({ id: true, createdAt: true, updatedAt: true })
      .safeParse(req.body);
    if (!bodyParsed.success)
      return res.status(400).json({ message: "Invalid body" });

    const now = new Date().toISOString();
    const newAlert: Alert = {
      ...bodyParsed.data,
      id: alerts.length ? Math.max(...alerts.map((a) => a.id)) + 1 : 1,
      createdAt: now,
      updatedAt: now,
    } as Alert;

    alerts.push(newAlert);
    fs.writeFileSync(filePath, JSON.stringify(alerts, null, 2));
    const outParsed = alertSchema.safeParse(newAlert);
    if (!outParsed.success)
      return res.status(500).json({ message: "Invalid output" });
    res.status(201).json(outParsed.data);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
