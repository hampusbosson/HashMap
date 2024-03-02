const HashMap = (() => {
  let bucketsSize = 16;
  let buckets = new Array(bucketsSize).fill(null).map(() => []);
  const loadFactor = 0.75;

  const hash = (key) => {
    let hashCode = 0;

    const primeNumber = 31;
    for (let i = 0; i < key.length; i++) {
      hashCode = (primeNumber * hashCode + key.charCodeAt(i)) % bucketsSize;
    }

    return hashCode;
  };

  const getLoadFactor = () => {
    const nonEmptyBuckets = buckets.reduce(
      (accumulated, current) =>
        current.length !== 0 ? accumulated + 1 : accumulated,
      0,
    );

    return nonEmptyBuckets / buckets.length;
  };

  const set = (key, value) => {
    //hash the key to get the bucket index
    const index = hash(key);
    const bucket = buckets[index];

    //check if the key already exists in the bucket
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        //key found, update value
        bucket[i][1] = value;
        return; //exit after updating
      }
    }
    //if key dont exist push key-value pair to the right index
    bucket.push([key, value]);
    //grow buckets if needed
    if (getLoadFactor() > loadFactor) {
      growBuckets();
    }
  };

  const get = (key) => {
    const index = hash(key);
    const bucket = buckets[index];

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        return bucket[i][1];
      }
    }
    return null;
  };

  const has = (key) => {
    const index = hash(key);
    const bucket = buckets[index];

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        return true;
      }
    }
    return false;
  };

  const remove = (key) => {
    if (!has(key)) {
      return false;
    }

    const index = hash(key);
    const bucket = buckets[index];

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket.splice(i, 1);
        return true;
      }
    }

    return false;
  };

  const length = () => {
    return buckets.reduce(
      (accumulated, current) => accumulated + current.length,
      0,
    );
  };

  const clear = () => {
    buckets.forEach((bucket) => bucket.splice(0, bucket.length));
  };

  const keys = () => {
    const returnArray = [];

    buckets.forEach((bucket) => {
      bucket.forEach((pair) => returnArray.push(pair[0]));
    });
    return returnArray;
  };

  const values = () => {
    const returnArray = [];

    buckets.forEach((bucket) => {
      bucket.forEach((pair) => returnArray.push(pair[1]));
    });
    return returnArray;
  };

  const entries = () => {
    const returnArray = [];

    buckets.forEach((bucket) => {
      bucket.forEach((pair) => returnArray.push(pair));
    });
    return returnArray;
  };

  const growBuckets = () => {
    const oldEntries = entries();

    bucketsSize = bucketsSize * 2;
    const newBuckets = Array(bucketsSize)
      .fill(null)
      .map(() => []);

    buckets = newBuckets;
    oldEntries.forEach((pair) => {
      set(pair[0], pair[1]);
    });
  };

  return {
    set, 
    get, 
    has, 
    remove, 
    length,
    clear, 
    keys, 
    values, 
    entries
  }
});
