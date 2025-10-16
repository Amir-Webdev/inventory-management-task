// pages/api/alerts/[id].ts
import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";
import { alertSchema, type Alert } from "../../../types";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const filePath = path.join(process.cwd(), "data", "alerts.json");
  const jsonData = fs.readFileSync(filePath);
  let alerts: Alert[] = JSON.parse(jsonData.toString());

  if (req.method === "GET") {
    const alert = alerts.find((a) => a.id === parseInt(id as string));
    if (alert) {
      const parsed = alertSchema.safeParse(alert);
      if (!parsed.success)
        return res.status(500).json({ message: "Invalid data" });
      res.status(200).json(parsed.data);
    } else {
      res.status(404).json({ message: "Alert not found" });
    }
  } else if (req.method === "PUT") {
    const index = alerts.findIndex((a) => a.id === parseInt(id as string));
    if (index !== -1) {
      const bodyParsed = alertSchema
        .partial()
        .omit({ id: true, createdAt: true })
        .safeParse(req.body);
      if (!bodyParsed.success)
        return res.status(400).json({ message: "Invalid body" });

      alerts[index] = {
        ...alerts[index],
        ...bodyParsed.data,
        id: parseInt(id as string),
        updatedAt: new Date().toISOString(),
      };
      fs.writeFileSync(filePath, JSON.stringify(alerts, null, 2));
      const outParsed = alertSchema.safeParse(alerts[index]);
      if (!outParsed.success)
        return res.status(500).json({ message: "Invalid output" });
      res.status(200).json(outParsed.data);
    } else {
      res.status(404).json({ message: "Alert not found" });
    }
  } else if (req.method === "DELETE") {
    const index = alerts.findIndex((a) => a.id === parseInt(id as string));
    if (index !== -1) {
      alerts.splice(index, 1);
      fs.writeFileSync(filePath, JSON.stringify(alerts, null, 2));
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Alert not found" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
