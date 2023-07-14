const Counter = require('../models/counterModel')

const autoIncrementID = async function (schema, options) {
  const { modelName, field } = options;

  schema.pre('validate', async function (next) {
    const doc = this;

    if (!doc.isNew) {
      return next();
    }

    try {
      const counter = await Counter.findByIdAndUpdate(
        modelName,
        { $inc: { seq: 1 } },
        { upsert: true, new: true }
      );
      doc[field] = counter.seq;
      next();
    } catch (err) {
      next(err);
    }
  });
};

module.exports = {autoIncrementID};