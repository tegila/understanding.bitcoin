const log = console.log;
const { Transform } = require("stream");
const { createHash } = require("crypto");

const { readGlobalHeader, readPacketHeader } = require("./parser.js");
const has_magic_bytes = /^f9beb4d9/i;

const mqtt = require("mqtt");
const local = new mqtt.connect("mqtt://localhost");
local.on("connect", () => log("mqtt local connected"));

// Function to parse the PCAP stream and handle reassembly of fragmented TCP packets
const parsePcapStream = () => {
  let isHeaderParsed = false;
  let buffer = Buffer.alloc(0); // This will hold the data as we read from the stream
  let globalHeader = null;
  let offset = 0; // Offset for parsing
  let tcpFragments = {}; // To store fragments while reassembling TCP packets

  const __checksum__ = (data) => {
    if (data.length < 16) return false;
    const size = data.slice(12 + 4, 12 + 4 + 4).readUint32LE();
    const checksum = data.slice(12 + 4 + 4, 12 + 4 + 4 + 4).toString("hex");
    const payload = data.slice(12 + 4 + 4 + 4, 12 + 4 + 4 + 4 + size);

    const hash_0 = createHash("sha256").update(payload).digest();
    const hash_1 = createHash("sha256")
      .update(hash_0)
      .digest()
      .toString("hex")
      .slice(0, 8);
    //log(hash_1 === checksum);
    return hash_1 === checksum;
  };

  return new Transform({
    readableObjectMode: true,
    writableObjectMode: false,
    transform(chunk, encoding, callback) {
      buffer = Buffer.concat([buffer, chunk]);

      // Process the PCAP global header once
      if (!isHeaderParsed && buffer.length >= 24) {
        globalHeader = readGlobalHeader(buffer);
        console.log("Global Header:", globalHeader);
        isHeaderParsed = true;
        buffer = buffer.slice(24); // Remove the global header (24 bytes)
        offset = 0; // Reset offset for packet headers
      }

      // Continue parsing packets as long as we have enough data
      while (buffer.length >= offset + 16) {
        const packetHeader = readPacketHeader(buffer, offset);
        //log(packetHeader);

        const capturedLength = packetHeader.capturedLength;

        if (buffer.length < offset + 16 + capturedLength) break;
        // Read the packet data (captured length)
        const packetData = buffer.slice(offset, offset + 16 + capturedLength);
        //log(packetData);
        offset += 16;
        offset += capturedLength; // Move the offset past the packet data

        const data = packetData.slice(82);
        const data_string = data.toString("hex");
        //log(data_string);
        const keys = packetData.slice(42, 50).toString("hex");

        if (has_magic_bytes.test(data.slice(0, 4).toString("hex"))) {
          if (__checksum__(data)) {
            log("__checksum__");
            this.push(data);
          } else {
            tcpFragments[keys] = data;
          }
        } else if (tcpFragments[keys]) {
          tcpFragments[keys] = Buffer.concat([tcpFragments[keys], data]);
          if (__checksum__(tcpFragments[keys])) {
            log("__checksum__ tcpFragments ");
            this.push(tcpFragments[keys]);
            delete tcpFragments[keys];
          }
        }
      }

      callback();
    },
  });
};

// Set up the pipe to parse the PCAP from stdin (or a file stream)
process.stdin.pipe(parsePcapStream()).on("data", (packet) => {
  console.log("Parsed Packet:", packet);
  local.publish("/bitcoin/network", packet.toString("hex"));
  const command = packet
    .slice(4, 12 + 4)
    .toString()
    .replace(/\x00/gi, "");
  console.log("Parsed Command:", command);
});
