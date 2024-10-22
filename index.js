const log = console.log;
const { createHash } = require("crypto");

const _bitcoin_message_parser = (d) => {
  const command = d
    .slice(4, 12 + 4)
    .toString()
    .replace(/\x00/gi, "");
  //log(command);
  const size = d.slice(12 + 4, 12 + 4 + 4).readUint32LE();
  const checksum = d.slice(12 + 4 + 4, 12 + 4 + 4 + 4).toString("hex");
  const payload = d.slice(12 + 4 + 4 + 4, 12 + 4 + 4 + 4 + size);

  const hash_0 = createHash("sha256").update(payload).digest();
  const hash_1 = createHash("sha256")
    .update(hash_0)
    .digest()
    .toString("hex")
    .slice(0, 8);
  if (hash_1 != checksum) return hash_1 === checksum;
  log(command, checksum, hash_1, hash_1 === checksum);
  //log("rest", d.slice(12 + 4 + 4 + 4 + size));
};

const has_magic_bytes = /f9beb4d9/i;
process.stdin.on("readable", (c) => {
  let chunk;
  while ((chunk = process.stdin.read()) !== null) {
    //log("we have a chunk: \n");
    const chunk_string = chunk.slice().toString("hex");
    //log(chunk_string);
    //log(has_magic_bytes.test(chunk_string));
    if (!has_magic_bytes.test(chunk_string)) return;
    const m = chunk_string.match(has_magic_bytes);
    if (!m) return;
    log(m.index / 2, chunk_string.length / 2, chunk.length);
    _bitcoin_message_parser(chunk.slice(m.index / 2));
  }
});
