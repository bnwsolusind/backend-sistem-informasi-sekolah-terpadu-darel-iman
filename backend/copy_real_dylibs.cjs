const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const libsDir = path.resolve(__dirname, 'libs');
if (!fs.existsSync(libsDir)) {
  fs.mkdirSync(libsDir, { recursive: true });
}

const dylibSources = [
  ['libtidy.58.dylib', '/usr/local/opt/tidy-html5/lib/libtidy.58.dylib'],
  ['libaspell.15.dylib', '/usr/local/opt/aspell/lib/libaspell.15.dylib'],
  ['libpspell.15.dylib', '/usr/local/opt/aspell/lib/libpspell.15.dylib'],
  ['libpq.5.dylib', '/usr/local/opt/libpq/lib/libpq.5.dylib'],
  ['libsybdb.5.dylib', '/usr/local/opt/freetds/lib/libsybdb.5.dylib'],
  ['libldap.2.dylib', '/usr/local/opt/openldap/lib/libldap.2.dylib'],
  ['liblber.2.dylib', '/usr/local/opt/openldap/lib/liblber.2.dylib'],
  ['libgmp.10.dylib', '/usr/local/opt/gmp/lib/libgmp.10.dylib'],
  ['libintl.8.dylib', '/usr/local/opt/gettext/lib/libintl.8.dylib'],
  ['libgssapi_krb5.2.2.dylib', '/usr/local/opt/krb5/lib/libgssapi_krb5.2.2.dylib'],
  ['libkrb5.3.3.dylib', '/usr/local/opt/krb5/lib/libkrb5.3.3.dylib'],
  ['libk5crypto.3.1.dylib', '/usr/local/opt/krb5/lib/libk5crypto.3.1.dylib'],
  ['libcom_err.3.0.dylib', '/usr/local/opt/krb5/lib/libcom_err.3.0.dylib'],
  ['libssl.3.dylib', '/usr/local/opt/openssl@3/lib/libssl.3.dylib'],
  ['libcrypto.3.dylib', '/usr/local/opt/openssl@3/lib/libcrypto.3.dylib'],
  ['libpcre2-8.0.dylib', '/usr/local/opt/pcre2/lib/libpcre2-8.0.dylib'],
  ['libsqlite3.0.dylib', '/usr/local/opt/sqlite/lib/libsqlite3.0.dylib'],
  ['libcurl.4.dylib', '/usr/local/opt/curl/lib/libcurl.4.dylib'],
  ['libgd.3.dylib', '/usr/local/opt/gd/lib/libgd.3.dylib'],
  ['libicuuc.76.dylib', '/usr/local/opt/icu4c@76/lib/libicuuc.76.dylib'],
  ['libicuio.76.dylib', '/usr/local/opt/icu4c@76/lib/libicuio.76.dylib'],
  ['libicui18n.76.dylib', '/usr/local/opt/icu4c@76/lib/libicui18n.76.dylib'],
  ['libonig.5.dylib', '/usr/local/opt/oniguruma/lib/libonig.5.dylib'],
  ['libodbc.2.dylib', '/usr/local/opt/unixodbc/lib/libodbc.2.dylib'],
  ['libsodium.26.dylib', '/usr/local/opt/libsodium/lib/libsodium.26.dylib'],
  ['libargon2.1.dylib', '/usr/local/opt/argon2/lib/libargon2.1.dylib'],
  ['libzip.5.dylib', '/usr/local/opt/libzip/lib/libzip.5.dylib'],
];

for (const [filename, sourcePath] of dylibSources) {
  const destPath = path.join(libsDir, filename);
  try {
    if (fs.existsSync(sourcePath)) {
      const realPath = fs.realpathSync(sourcePath);
      fs.copyFileSync(realPath, destPath);
      console.log(`Copied real dylib: ${filename} from ${realPath}`);
    } else {
      console.log(`Source dylib not found: ${sourcePath}`);
    }
  } catch (e) {
    console.error(`Failed to copy ${filename}:`, e.message);
  }
}

console.log('Finished copying real Homebrew dylibs to workspace libs folder.');
