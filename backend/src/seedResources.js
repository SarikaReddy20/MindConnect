import mongoose from "mongoose";
import dotenv from "dotenv";
import Resource from "./models/Resource.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected for seeding"))
  .catch(err => console.log(err));

const resources = [
  { title: "Deep Breathing Exercise", type: "exercise", content: "https://www.youtube.com/watch?v=nmFUDkj1Aq0" },
  { title: "Meditation Guide", type: "exercise", content: "https://www.headspace.com/meditation" },
  { title: "Stress Management Article", type: "article", content: "https://www.verywellmind.com/stress-management-4157261" },
];

const seed = async () => {
  await Resource.deleteMany({});
  await Resource.insertMany(resources);
  console.log("Resources seeded ✅");
  mongoose.disconnect();
};

seed();
