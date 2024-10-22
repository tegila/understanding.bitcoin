# understanding.bitcoin
Using TCPdump to get into bitcoin p2p network

> tcpdump port 8333 -s0 -w - | node index.js

or

> tcpdump port 8333 -s0 -w - | node index.js decode_payload.js

docs:
https://en.bitcoin.it/wiki/Protocol_documentation
