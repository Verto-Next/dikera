const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  express.static(path.join(__dirname), {
    extensions: ["html"],
    index: "index.html",
  })
);

// Clean URL routing: /hakkimizda -> hakkimizda.html
app.get("*", (req, res, next) => {
  const filePath = path.join(__dirname, req.path + ".html");
  res.sendFile(filePath, (err) => {
    if (err) {
      next();
    }
  });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Legasis website running on port ${PORT}`);
});
