import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  company: String,
  title: String,
  description: String,
  eligibility: String,
  lastDate: String,
  recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'pending' }
});

export default mongoose.model('Job', jobSchema);
