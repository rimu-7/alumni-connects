import connectToDatabase from './mongodb';
import Alumni from '@/models/Alumni';

/**
 * Fetch all alumni directly from the database with fast `.lean()` queries.
 * Converts MongoDB ObjectId and Date objects into serializable JSON for Next.js.
 */
export async function getAlumniList({ search, bloodGroup, passingYear, limit = 500 } = {}) {
  try {
    await connectToDatabase();

    const query = {};

    if (bloodGroup && bloodGroup !== 'all') {
      query.bloodGroup = bloodGroup.toUpperCase();
    }

    if (passingYear && passingYear !== 'all') {
      // match as string or number
      query.passingYear = { $in: [String(passingYear), Number(passingYear)] };
    }

    if (search && search.trim()) {
      const term = search.trim();
      const regex = new RegExp(term, 'i');
      query.$or = [
        { fullName: regex },
        { organization: regex },
        { jobTitle: regex },
        { currentCity: regex },
        { bloodGroup: regex },
      ];
    }

    const docs = await Alumni.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('fullName email phone bloodGroup currentCity passingYear jobTitle organization quote photo createdAt')
      .lean();

    // Normalize documents to plain serializable objects
    const serialized = docs.map((doc) => {
      // Handle photo which can be string or object
      let photoUrl = '';
      if (typeof doc.photo === 'string') {
        photoUrl = doc.photo;
      } else if (doc.photo && typeof doc.photo === 'object') {
        photoUrl = doc.photo.url || doc.photo.secure_url || '';
      }

      return {
        _id: doc._id.toString(),
        fullName: doc.fullName || '',
        email: doc.email || '',
        phone: doc.phone || '',
        bloodGroup: doc.bloodGroup || '',
        currentCity: doc.currentCity || '',
        passingYear: doc.passingYear != null ? String(doc.passingYear) : '',
        jobTitle: doc.jobTitle || '',
        organization: doc.organization || '',
        quote: doc.quote || '',
        photo: photoUrl,
        createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
      };
    });

    return { alumni: serialized, error: null };
  } catch (error) {
    console.error('getAlumniList error:', error);
    return {
      alumni: [],
      error: error?.message || 'Failed to fetch alumni from database',
    };
  }
}
