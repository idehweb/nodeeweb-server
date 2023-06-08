import mongo from 'mongoose';

export default (mongoose) => {
  const ModelSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      crontab_expr: { type: String, required: true },
      query_pipe: {
        type: {
          _id: false,
          model: { type: String, required: true },
          query: { type: {}, required: true },
        },
        default: undefined,
      },
      aggregation_pipe: {
        type: {
          _id: false,
          model: { type: String, required: true },
          pipeline: { type: [], required: true },
        },
        default: undefined,
      },
      action: {
        type: {
          base_action_name: { type: String, required: true },
          args: { type: mongo.Schema.Types.Mixed },
        },
        required: true,
      },
      active: { type: Boolean, default: true },
    },
    { timestamps: true }
  );
  return ModelSchema;
};
