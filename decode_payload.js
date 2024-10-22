const log = console.log;

const get_data = (payload) => {
  const count = payload.slice(0, 1).readUInt8();
  return {
    count,
    payload: [...new Array(count)]
      .map((v, i) => payload.slice(i * 36 + 1, (i + 1) * 36 + 1))
      .map((v) => ({
        type: v.slice(0, 4).reverse().toString("hex"),
        hash: v.slice(4).reverse().toString("hex"),
      })),
  };
};

const INV = [
  "ERROR",
  "MSG_TX",
  "MSG_BLOCK",
  "MSG_FILTERED_BLOCK",
  "MSG_CMPCT_BLOCK",
  "MSG_WTX",
  "MSG_WITNESS_TX", //0x40000001
  "MSG_WITNESS_BLOCK", //0x40000002
  "MSG_FILTERED_WITNESS_BLOCK", //0x40000003
];

const inv = (data) => {
  const count = data.slice(0, 1); //.readUInt8();
  //log("count", count);

  const payload = data.slice(1);
  const vector_size = payload.length / (2 * 36);
  //log("length", payload.length, vector_size);
  let vector = [];
  for (i = 0; i < vector_size; i++)
    vector.push(payload.slice(i * 36, (i + 1) * 36));
  //log(vector);
  vector = vector.map((v) => {
    const type = v.slice(0, 4);
    const hash = v.slice(4);
    return {
      type: INV[type.readUint32LE()],
      type_: type.readUint32LE(),
      //hash: hash.toString("hex").match(/.{2}/g).reverse().join(""),
      hash: hash.reverse().toString("hex"),
      hash_t: hash.length * 8,
    };
  });

  //vector.forEach((v) => log(v));
  return {
    count,
    //type_t: type.length,
    vector,
  };
};

const tx = (data) => {
  //const hash_0 = createHash("sha256").update(data).digest();
  //const hash_1 = createHash("sha256").update(hash_0).digest();
  //log(hash_1.reverse().toString("hex"));

  //.slice(0, 8);
  const payload = {
    version: data.slice(0, 2).toString("hex"),
    flags: data.slice(2, 6).toString("hex"),
    tx_in: {
      count: data.slice(6, 7).readUInt8(),
      values: [
        {
          outpoint: {
            //outpoint
            hash: null, //char[32]
            index: null, //uint32_t
          },
          script_length: null, //var_int == n
          signature_script: null, //uchar[n]
          sequence: null, //uint32_t
        },
      ],
    },
    tx_out: {
      count: null, //var_int
      values: [
        {
          value: null, //int64_t
          pk_script_length: null, //var_int = n
          pk_script: null, //uchar[n]
        },
      ],
    },
    tx_witnesses: null, //tx_witness[]
    locktime: data.slice(-4).toString("hex"),
  };
  //log(payload);
  //log("data.length.t", data.length);
  //let tx_ins = data.slice(7);
  let last = 7;
  //log("tx_in.count", payload.tx_in.count);
  payload.tx_in.values = [...new Array(payload.tx_in.count)].map((v, i) => {
    //log("tx_in", last);
    //log("data.length.t", data.length);
    const tx_ins = data.slice(last);

    const script_length = tx_ins.slice(32 + 2, 32 + 2 + 3).readUInt8();
    last = last + 32 + 2 + 3 + script_length + 4;
    //log("script_length", script_length);

    return {
      outpoint: {
        hash: tx_ins.slice(0, 32).reverse().toString("hex"),
        index: tx_ins.slice(32, 32 + 2).readUInt8(),
      },
      script_length,
      signature_script: tx_ins
        .slice(32 + 2 + 3, 32 + 2 + 3 + script_length)
        .toString("hex"),
      sequence: tx_ins
        .slice(32 + 2 + 3 + script_length, 32 + 2 + 3 + script_length + 4)
        .reverse()
        .toString("hex"),
    };
  });
  log(payload.tx_in.values);

  //log("last", last);
  payload.tx_out.count = data.slice(last, last + 1).readUInt8();
  //log("tx_out.count", payload.tx_out.count);
  last = last + 1;
  //log("last + 1", last);

  payload.tx_out.values = [...new Array(payload.tx_out.count)].map((v, i) => {
    //log("tx_out", last);
    //log("data.length.t", data.length);
    const tx_outs = data.slice(last);
    //log(tx_outs.toString("hex"));
    const pk_script_length = tx_outs.slice(8, 8 + 1).readUInt8();
    last = last + 8 + 1 + pk_script_length;
    //log("pk_script_length", pk_script_length);

    return {
      value: tx_outs.slice(0, 8).toString("hex"), //int64_t
      pk_script_length, //var_int
      pk_script: tx_outs.slice(8 + 1, 8 + 1 + pk_script_length).toString("hex"), //uchar[]
    };
  });
  log(payload.tx_out.values);

  //last = last + 2;
  //log("last + 1", last);
  //log(data.slice(last, -4).toString("hex"));
  witness_count = data.slice(last, last + 1).readUInt8();
  last = last + 1;
  payload.tx_witnesses = [...new Array(witness_count)].map((v, i) => {
    //log("tx_witnesses", last);
    //log("data.length.t", data.length);

    const tx_witnesses = data.slice(last);
    const witness_length = tx_witnesses.slice(0, 1).readUInt8();
    //log("witness_length", witness_length);

    last = last + 1 + witness_length;
    return {
      witness_length,
      witness: tx_witnesses.slice(1, 1 + witness_length).toString("hex"),
    };
  });
  //log(payload.tx_witnesses);

  if (data.length === last + 4) {
    log(payload);
    return payload;
  }
  //log("data.length.t", data.length);
  //log("last_last", last + 4);
  //log(data.length === last + 4);
};

module.exports = (payload, command) => {
  log(payload);

  //log(command, data);
  if (command === "getdata") {
    get_data(payload);
  } else if (command === "inv") {
    inv(payload);
  } else if (command === "tx") {
    tx(payload);
  }

  return payload;
};
