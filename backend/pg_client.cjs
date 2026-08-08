const net = require('net');
const crypto = require('crypto');

function queryPg(sql, callback) {
  const socket = net.createConnection('/tmp/.s.PGSQL.5432');
  let buf = Buffer.alloc(0);
  let authenticated = false;

  socket.on('connect', () => {
    // StartupMessage: length (4), protocol v3 (4), user\0postgres\0database\0school_management\0\0
    const params = 'user\0postgres\0database\0school_management\0\0';
    const len = 4 + 4 + Buffer.byteLength(params);
    const packet = Buffer.alloc(len);
    packet.writeInt32BE(len, 0);
    packet.writeInt32BE(196608, 4); // Protocol 3.0
    packet.write(params, 8);
    socket.write(packet);
  });

  socket.on('data', (data) => {
    buf = Buffer.concat([buf, data]);

    while (buf.length >= 5) {
      const type = String.fromCharCode(buf[0]);
      const len = buf.readInt32BE(1);
      if (buf.length < 1 + len) break; // Need full packet

      const payload = buf.slice(5, 1 + len);
      buf = buf.slice(1 + len);

      if (type === 'R') { // Authentication request
        const authType = payload.readInt32BE(0);
        if (authType === 0) { // AuthOK
          authenticated = true;
          sendQuery(sql);
        } else if (authType === 3) { // CleartextPassword
          sendPassword('password');
        } else if (authType === 5) { // MD5Password
          const salt = payload.slice(4, 8);
          const hash1 = crypto.createHash('md5').update('passwordpostgres').digest('hex');
          const hash2 = crypto.createHash('md5').update(hash1).update(salt).digest('hex');
          sendPassword('md5' + hash2);
        }
      } else if (type === 'Z') { // ReadyForQuery
        // Done
      } else if (type === 'D') { // DataRow
        // Read columns
      } else if (type === 'T') { // RowDescription
      } else if (type === 'E') { // ErrorResponse
        console.error('PG Error:', payload.toString());
      }
    }
  });

  function sendPassword(pwd) {
    const pLen = 4 + Buffer.byteLength(pwd) + 1;
    const packet = Buffer.alloc(1 + pLen);
    packet[0] = 'p'.charCodeAt(0);
    packet.writeInt32BE(pLen, 1);
    packet.write(pwd, 5);
    packet[1 + pLen - 1] = 0;
    socket.write(packet);
  }

  function sendQuery(q) {
    const qLen = 4 + Buffer.byteLength(q) + 1;
    const packet = Buffer.alloc(1 + qLen);
    packet[0] = 'Q'.charCodeAt(0);
    packet.writeInt32BE(qLen, 1);
    packet.write(q, 5);
    packet[1 + qLen - 1] = 0;
    socket.write(packet);
  }
}
