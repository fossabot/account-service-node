//
// Quick & Dirty Google Cloud Storage emulator for tests. Requires
// `stream-buffers` from npm. Use it like this:
//
// `new MockStorage().bucket('my-bucket').file('my_file').createWriteStream()`
// @ https://gist.github.com/nfarina/90ba99a5187113900c86289e67586aaa
import { ReadableStreamBuffer, WritableStreamBuffer } from "stream-buffers";

export class MockStorage {
  buckets = {};

  constructor() {
    this.buckets = {};
  }

  bucket(name) {
    return this.buckets[name] || (this.buckets[name] = new MockBucket(name));
  }
}

class MockBucket {
  name;
  files = {};

  constructor(name) {
    this.name = name;
    this.files = {};
  }

  file(path) {
    return this.files[path] || (this.files[path] = new MockFile(path));
  }
}

class MockFile {
  path;
  contents;
  metadata;

  constructor(path) {
    this.path = path;
    this.contents = Buffer.from("");
    this.metadata = {};
  }

  get() {
    return [this, this.metadata];
  }

  setMetadata(metadata) {
    const customMetadata = { ...this.metadata.metadata, ...metadata.metadata };
    this.metadata = { ...this.metadata, ...metadata, metadata: customMetadata };
  }

  createReadStream() {
    const readable = new ReadableStreamBuffer();
    readable.put(this.contents);
    readable.stop();
    return readable;
  }

  createWriteStream({ metadata }) {
    this.setMetadata(metadata);
    const writable = new WritableStreamBuffer();
    writable.on("finish", () => {
      this.contents = writable.getContents();
    });
    return writable;
  }

  delete() {
    return Promise.resolve();
  }
}
