const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const Card = require("./../models/cardModel");

exports.addItem = catchAsync(async (req, res, next) => {
  const newItem = await Card.create({
    userId: req.body.userId,
    title: req.body.title,
    priority: req.body.priority,
    checklist: req.body.checklist,
    dueDate: req.body.dueDate,
  });
  res.status(201).json({
    status: "success",
    data: {
      newItem,
    },
  });
});

exports.getUserData = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const items = await Card.find({ userId: id });
  res.status(200).json({
    status: "success",
    results: items.length,
    data: {
      items,
    },
  });
});

exports.getOne = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  try {
    // Find the collection with the given collectionId
    const collection = await Card.findById(id);

    if (!collection) {
      return res.status(404).json({ error: "Collection not found" });
    }

    res.status(200).json({
      status: "success",
      data: {
        collection,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

exports.updateCheckbox = catchAsync(async (req, res, next) => {
  const { collectionId, checklistItemId } = req.params;
  const { checked } = req.body;

  try {
    // Find the collection with the given collectionId
    const collection = await Card.findById(collectionId);

    if (!collection) {
      return res.status(404).json({ error: "Collection not found" });
    }

    // Find the checklist item within the collection with the given checklistItemId
    const checklistItem = collection.checklist.find(
      (item) => item._id.toString() === checklistItemId
    );

    if (!checklistItem) {
      return res.status(404).json({ error: "Checklist item not found" });
    }

    // Update the checked property of the checklist item
    checklistItem.checked = checked;

    // Save the updated collection
    await collection.save();

    res.status(200).json({
      status: "success",
      data: {
        checklistItem,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

exports.updateItem = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const item = await Card.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!item) {
    return next(new AppError("No item found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      item,
    },
  });
});

exports.deleteItem = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const item = await Card.findByIdAndDelete(id);

  if (!item) {
    return next(new AppError("No item found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
})

exports.getPeriod = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const { period } = req.query;
  let startDate, endDate;

  // Determine start and end dates based on the requested period
  switch (period) {
    case 'today':
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0); // Start of the day
      endDate = new Date();
      endDate.setHours(23, 59, 59, 999); // End of the day
      break;
    case 'this_week':
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0); // Start of the day
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6 - startDate.getDay()); // End of the week
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'this_month':
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0); // Start of the day
      endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
      endDate.setHours(23, 59, 59, 999); // End of the month
      break;
    default:
      return res.status(400).json({ error: 'Invalid period' });
  }

  const items = await Card.find({
    userId: id,
    dueDate: { $gte: startDate, $lte: endDate }
  });

  res.status(200).json({
    status: "success",
    results: items.length,
    data: {
      items,
    },
  });
});
