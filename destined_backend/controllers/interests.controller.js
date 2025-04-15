const interests = [
  "📷Photography",
  "👨‍🍳Cooking",
  "🎮Video_Games",
  "🎵Music",
  "✈️Travelling",
  "🛍️Shopping",
  "🎨Art & Crafts",
  "🏊Swimming",
  "⚽Sports",
  "💪Gym",
];

exports.getInterests = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      interests,
    });
  } catch (error) {
    console.error("Error fetching interests:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
