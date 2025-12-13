import React from "react";
import { createRoot } from "react-dom/client";
import Memory from "./Memory.jsx";
import "./Memory.css";

const root = createRoot(document.getElementById("root"));
root.render(<Memory />);
