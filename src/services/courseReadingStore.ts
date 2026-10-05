export type StoredCourseReading = {
  id: string;
  course: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  notes: string;
  blob?: Blob;
  url?: string;
};

const DB_NAME = "personal-life-os-documents";
const STORE_NAME = "course-further-reading";

const openDatabase = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("course", "course", { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const run = async <T>(
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore) => IDBRequest<T>,
) => {
  const database = await openDatabase();
  return new Promise<T>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, mode);
    const request = action(transaction.objectStore(STORE_NAME));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => database.close();
  });
};

export const listCourseReadings = () =>
  run<StoredCourseReading[]>("readonly", (store) => store.getAll());

export const saveCourseReading = (reading: StoredCourseReading) =>
  run<IDBValidKey>("readwrite", (store) => store.put(reading));

export const updateCourseReadingNotes = async (id: string, notes: string) => {
  const reading = await run<StoredCourseReading | undefined>("readonly", (store) =>
    store.get(id),
  );
  if (reading) await saveCourseReading({ ...reading, notes });
};

export const deleteCourseReading = (id: string) =>
  run<undefined>("readwrite", (store) => store.delete(id));

export const downloadCourseReading = async (id: string, name: string) => {
  const reading = await run<StoredCourseReading | undefined>("readonly", (store) =>
    store.get(id),
  );
  if (!reading?.blob) throw new Error("Reading file is unavailable on this device.");
  const url = URL.createObjectURL(reading.blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
};
