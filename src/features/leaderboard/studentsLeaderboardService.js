import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../services/firebase.js';

export async function listTopStudents(limitCount = 50) {
  const snap = await getDocs(
    query(collection(db, 'students'), orderBy('totalScore', 'desc'))
  );
  const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return rows.slice(0, limitCount);
}

