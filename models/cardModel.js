const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  userId : {
    type: String,
    required: [true, "Please logIn again to save data.."],
  },
  title: {
    type: String,
    required: [true, "Please provide the title"],
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
    required: [true, "Please provide the priority"],
  },
  checklist: [
    {
      item: {
        type: String,
        required: [true, "Checklist item cannot be empty"],
      },
      checked: {
        type: Boolean,
        default: false,
      },
    },
  ],
  card: {
    type: String,
    enum: ["backlog", "todo", "progress", "done"],
    default: "todo",
  },
  dueDate: {
    type: Date,
    set: function (value) {
      if (value === null) {
        return undefined;
      }
      return new Date(value);
    },
  },
});

const Card = mongoose.model("Card", cardSchema);

module.exports = Card;
