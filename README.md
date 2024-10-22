# Decoding Bitcoin p2p network to learn how to get into it using plain simple javascript

Using TCPdump to get into bitcoin p2p network

> tcpdump port 8333 -s0 -w - | node index.js

or

> tcpdump port 8333 -s0 -w - | node index.js ./decode_payload.js

```   
tcpdump: listening on eth0, link-type EN10MB (Ethernet), snapshot length 262144 bytes
[ '/usr/bin/node', '/***/index.js', './****.js' ]
{ script_name: './****.js', callback: [Function (anonymous)] }
addrv2 4d98ede4 4d98ede4 true
<Buffer 04 72 d1 17 67 fd 49 0c 01 04 05 a4 c5 41 20 8d 5d d1 17 67 fd 09 0c 01 04 d9 6e b3 12 20 8d 72 d1 17 67 fd 09 04 01 04 68 3e 88 0c 20 8d f2 d0 17 67 ... 11 more bytes>
inv af888602 af888602 true
<Buffer 04 05 00 00 00 5d 57 da db db c9 91 e5 a1 85 95 c0 fd b6 ed 1c b8 81 48 b8 db 50 71 d6 ac d9 cc bc da fc d0 1f 05 00 00 00 ef 24 67 7e ea f1 d5 42 a0 ... 95 more bytes>
inv 0cfb7748 0cfb7748 true
<Buffer 0e 05 00 00 00 5f 4b c7 42 0e b3 3d a7 64 9c 7c 24 ef 17 3e 35 b3 e9 cf dc 92 9a 13 d0 6a ae 74 8a ea 20 29 aa 05 00 00 00 ce 6a ea e9 7a 3a b0 68 fd ... 455 more bytes>
tx 9ac711c5 9ac711c5 true
<Buffer 02 00 00 00 00 01 01 c9 93 05 46 18 90 be 9e 94 db d9 6c e1 32 02 5d 78 b4 be 0c ba fa c3 a0 8e 28 34 77 b5 7b 2b dc 00 00 00 00 00 fd ff ff ff 01 22 ... 338 more bytes>
[
  {
    outpoint: {
      hash: 'dc2b7bb57734288ea0c3faba0cbeb4785d0232e16cd9db949ebe9018460593c9',
      index: 0
    },
    script_length: 0,
    signature_script: '',
    sequence: 'fffffffd'
  }
]
[
  {
    value: '2202000000000000',
    pk_script_length: 34,
    pk_script: '512067bff446fb12267fe50b4320517bdcccf86123da7be52e44daad5bba7c831ac4'                                                                                               
  }                                                                                                                                                                                 
]                                                                                                                                                                                   
{                                                                                                                                                                                   
  version: '0200',                                                                                                                                                                  
  flags: '00000001',
  tx_in: { count: 1, values: [ [Object] ] },
  tx_out: { count: 1, values: [ [Object] ] },
  tx_witnesses: [
    {
      witness_length: 64,
      witness: '8d4e92fefb3c7b15583a9c87c9c9154a4f40a54afeb24d2bea17546186ffe780656fe29dda064f6283a5ee35d501dfad34ee5f3bee449e075297d236c6c77893'
    },
    {
      witness_length: 191,
      witness: '20cad1a11d7bc1e5053e84a1194bac1dd38370e09ab82fae7cda94d38c7c41f484ac0063036f726401010a696d6167652f6a706567010b200a66c17ab348bb9d8ba6130ac4329c069f8040984f5c86d5018f
ff539fb72b0f01020001054c5ea36249441909996454696572684e616b616d6f746f6e65787472615f6d65746164617461783868747470733a2f2f67656e657369732d6d657461732e6d696e746966792e78797a2f6f7264696e
616c732f6e616b616d6f746f2f323435370068'
    },
    {
      witness_length: 33,
      witness: 'c0cad1a11d7bc1e5053e84a1194bac1dd38370e09ab82fae7cda94d38c7c41f484'
    }
  ],
  locktime: '00000000'
}
inv adfc9c27 adfc9c27 true
<Buffer 16 05 00 00 00 a8 fb 8e be 1c 71 e9 cd f8 0b a5 55 34 04 57 72 fc 8d ca b0 7a 52 8b 63 cc c0 aa b6 b6 9c 47 de 05 00 00 00 25 55 a1 c3 36 96 0c 6c 07 ... 743 more bytes>
tx c5244b63 c5244b63 true
<Buffer 02 00 00 00 00 01 01 79 9a 25 48 fc 81 51 35 c1 8a 2a 94 43 0c 2c 94 64 52 3d 89 17 f2 e3 88 5f e4 3f 50 d0 85 bc 49 01 00 00 00 00 ff ff ff ff 02 00 ... 160 more bytes>
[
  {
    outpoint: {
      hash: '49bc85d0503fe45f88e3f217893d5264942c0c43942a8ac1355181fc48259a79',
      index: 1
    },
    script_length: 0,
    signature_script: '',
    sequence: 'ffffffff'
  }
]
[
  {
    value: '0000000000000000',
    pk_script_length: 10,
    pk_script: '6a5d0714a3f23414c502'
  },
  {
    value: '91a1000000000000',
    pk_script_length: 22,
    pk_script: '00144cc58d2de644958b7b1b2ef78f4e8c5a3cc574a9'
  }
]
{
  version: '0200',
  flags: '00000001',
  tx_in: { count: 1, values: [ [Object] ] },
  tx_out: { count: 2, values: [ [Object], [Object] ] },
  tx_witnesses: [
    {
      witness_length: 71,
      witness: '3044022014fc8ff6a4da0d5fff151edb6f1a4f473cdcdb36d8da6b7ae8c12dab1c96adcf02202e5dee3531fe6268f84605b5d2b9dd03d34fc5f28d151bbdf618771efcad15c301'
    },
    {
      witness_length: 33,
      witness: '039540a16d4f412d216f903c329ec9684b4585685d7c20f3d77535f6877b2c5a39'
    }
  ],
  locktime: '00000000'
}
208 packets captured
209 packets received by filter
0 packets dropped by kernel
```


docs:
https://en.bitcoin.it/wiki/Protocol_documentation
