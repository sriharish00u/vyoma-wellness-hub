import mongoose, { Schema, type Document } from "mongoose";

export interface ISubscription extends Document {
  endpoint: string;
  keys: { p256dh: string; auth: string };
  userId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>({
  endpoint: { type: String, required: true, unique: true },
  keys: {
    p256dh: { type: String, required: true },
    auth: { type: String, required: true },
  },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
  createdAt: { type: Date, default: Date.now },
});

export const Subscription = mongoose.model<ISubscription>("Subscription", subscriptionSchema);
