const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const libsDir = path.resolve(__dirname);
if (!fs.existsSync(libsDir)) {
  fs.mkdirSync(libsDir, { recursive: true });
}

const dummyC = path.join(libsDir, 'dummy.c');

const gmpSymbolsSet = new Set([
  '__gmp_version',
  '__gmpz_init',
  '__gmpz_init2',
  '__gmpz_inits',
  '__gmpz_clear',
  '__gmpz_clears',
  '__gmpz_realloc2',
  '__gmpz_set',
  '__gmpz_set_ui',
  '__gmpz_set_si',
  '__gmpz_set_d',
  '__gmpz_set_q',
  '__gmpz_set_f',
  '__gmpz_set_str',
  '__gmpz_init_set',
  '__gmpz_init_set_ui',
  '__gmpz_init_set_si',
  '__gmpz_init_set_d',
  '__gmpz_init_set_str',
  '__gmpz_get_str',
  '__gmpz_get_ui',
  '__gmpz_get_si',
  '__gmpz_get_d',
  '__gmpz_get_d_2exp',
  '__gmpz_add',
  '__gmpz_add_ui',
  '__gmpz_sub',
  '__gmpz_sub_ui',
  '__gmpz_ui_sub',
  '__gmpz_mul',
  '__gmpz_mul_ui',
  '__gmpz_mul_si',
  '__gmpz_addmul',
  '__gmpz_addmul_ui',
  '__gmpz_submul',
  '__gmpz_submul_ui',
  '__gmpz_mul_2exp',
  '__gmpz_neg',
  '__gmpz_abs',
  '__gmpz_cdiv_q',
  '__gmpz_cdiv_r',
  '__gmpz_cdiv_qr',
  '__gmpz_cdiv_q_ui',
  '__gmpz_cdiv_r_ui',
  '__gmpz_cdiv_qr_ui',
  '__gmpz_cdiv_ui',
  '__gmpz_fdiv_q',
  '__gmpz_fdiv_r',
  '__gmpz_fdiv_qr',
  '__gmpz_fdiv_q_ui',
  '__gmpz_fdiv_r_ui',
  '__gmpz_fdiv_qr_ui',
  '__gmpz_fdiv_ui',
  '__gmpz_fdiv_q_2exp',
  '__gmpz_fdiv_r_2exp',
  '__gmpz_fdiv_qr_2exp',
  '__gmpz_tdiv_q',
  '__gmpz_tdiv_r',
  '__gmpz_tdiv_qr',
  '__gmpz_tdiv_q_ui',
  '__gmpz_tdiv_r_ui',
  '__gmpz_tdiv_qr_ui',
  '__gmpz_tdiv_ui',
  '__gmpz_tdiv_q_2exp',
  '__gmpz_tdiv_r_2exp',
  '__gmpz_tdiv_qr_2exp',
  '__gmpz_cdiv_q_2exp',
  '__gmpz_cdiv_r_2exp',
  '__gmpz_cdiv_qr_2exp',
  '__gmpz_mod',
  '__gmpz_divexact',
  '__gmpz_divexact_ui',
  '__gmpz_divisible_p',
  '__gmpz_divisible_ui_p',
  '__gmpz_congruent_p',
  '__gmpz_congruent_ui_p',
  '__gmpz_powm',
  '__gmpz_powm_ui',
  '__gmpz_pow_ui',
  '__gmpz_ui_pow_ui',
  '__gmpz_root',
  '__gmpz_rootrem',
  '__gmpz_sqrt',
  '__gmpz_sqrtrem',
  '__gmpz_perfect_power_p',
  '__gmpz_perfect_square_p',
  '__gmpz_probab_prime_p',
  '__gmpz_nextprime',
  '__gmpz_gcd',
  '__gmpz_gcd_ui',
  '__gmpz_gcdext',
  '__gmpz_lcm',
  '__gmpz_lcm_ui',
  '__gmpz_invert',
  '__gmpz_jacobi',
  '__gmpz_legendre',
  '__gmpz_kronecker',
  '__gmpz_kronecker_si',
  '__gmpz_kronecker_ui',
  '__gmpz_si_kronecker',
  '__gmpz_ui_kronecker',
  '__gmpz_remove',
  '__gmpz_fac_ui',
  '__gmpz_2fac_ui',
  '__gmpz_mfac_uiui',
  '__gmpz_primorial_ui',
  '__gmpz_bin_ui',
  '__gmpz_bin_uiui',
  '__gmpz_fib_ui',
  '__gmpz_fib2_ui',
  '__gmpz_lucnum_ui',
  '__gmpz_lucnum2_ui',
  '__gmpz_cmp',
  '__gmpz_cmp_d',
  '__gmpz_cmp_ui',
  '__gmpz_cmp_si',
  '__gmpz_cmpabs',
  '__gmpz_cmpabs_d',
  '__gmpz_cmpabs_ui',
  '__gmpz_sgn',
  '__gmpz_and',
  '__gmpz_ior',
  '__gmpz_xor',
  '__gmpz_com',
  '__gmpz_popcount',
  '__gmpz_hamdist',
  '__gmpz_scan0',
  '__gmpz_scan1',
  '__gmpz_setbit',
  '__gmpz_clrbit',
  '__gmpz_combit',
  '__gmpz_tstbit',
  '__gmpz_sizeinbase',
  '__gmpz_export',
  '__gmpz_import',
  '__gmpz_fits_ulong_p',
  '__gmpz_fits_slong_p',
  '__gmpz_fits_uint_p',
  '__gmpz_fits_sint_p',
  '__gmpz_fits_ushort_p',
  '__gmpz_fits_sshort_p',
  '__gmpz_even_p',
  '__gmpz_odd_p',
  '__gmpq_init',
  '__gmpq_clear',
  '__gmpq_set',
  '__gmpq_set_ui',
  '__gmpq_set_si',
  '__gmpq_get_d',
  '__gmpf_init',
  '__gmpf_clear',
  '__gmpf_set',
  '__gmpf_set_d',
  '__gmpf_get_d'
]);

const readlineSymbolsSet = new Set([
  'rl_attempted_completion_function',
  'rl_completion_matches',
  'rl_line_buffer',
  'rl_readline_name',
  'rl_prompt',
  'rl_point',
  'rl_end',
  'rl_insert_text',
  'rl_redisplay',
  'rl_bind_key',
  'rl_clear_history',
  'stifle_history',
  'unstifle_history',
  'history_is_stifled',
  'where_history',
  'history_get',
  'history_total_bytes',
  'history_list',
  'replace_history_entry',
  'remove_history',
  'remove_history_range',
  'clear_history',
  'history_truncate_file',
  'history_expand',
  'rl_library_version',
  'rl_readline_version',
  'rl_terminal_name',
  'rl_instream',
  'rl_outstream',
  'rl_inhibit_completion',
  'rl_attempted_completion_over',
  'rl_basic_word_break_characters',
  'rl_completer_word_break_characters',
  'rl_completer_quote_characters',
  'rl_basic_quote_characters',
  'rl_filename_quote_characters',
  'rl_special_prefixes',
  'rl_completion_entry_function',
  'rl_ignore_some_completions_function',
  'rl_char_is_quoted_p',
  'rl_filename_quoting_desired',
  'rl_filename_quoting_function',
  'rl_filename_dequoting_function',
  'rl_directory_completion_hook',
  'rl_directory_rewrite_hook',
  'rl_filename_stat_hook',
  'rl_filename_rewrite_hook',
  'rl_completion_display_matches_hook',
  'rl_completion_append_character',
  'rl_completion_suppress_append',
  'rl_filename_completion_desired',
  'rl_completion_type',
  'rl_completion_query_items',
  'rl_completion_mark_symlink_dirs',
  'rl_ignore_completion_duplicates',
  'rl_sort_completion_matches',
  'rl_menu_completion_entry_function',
  'rl_mark',
  'rl_done',
  'rl_num_chars_to_read',
  'rl_pending_input',
  'rl_dispatching',
  'rl_erase_empty_line',
  'rl_display_prompt',
  'rl_already_prompted',
  'rl_executing_keyseq',
  'rl_key_sequence_length'
]);

function buildC() {
  let c = `
#include <stddef.h>
#include <stdlib.h>
#include <stdio.h>

#define EXPORT __attribute__((visibility("default")))

EXPORT int ber_pvt_opt_on = 0;
EXPORT const char * __gmp_version = "6.3.0";
EXPORT int gdbm_errno = 0;
EXPORT const char * gdbm_version = "1.23";
EXPORT void dummy(void){}
EXPORT void GENERAL_NAME_free(void){}
EXPORT void readline(void){}
EXPORT void add_history(void){}
EXPORT int rl_completion_append_character = ' ';
EXPORT int rl_completion_suppress_append = 0;
EXPORT int rl_filename_completion_desired = 0;
EXPORT int rl_completion_type = 0;
EXPORT int rl_completion_query_items = 100;
EXPORT int rl_completion_mark_symlink_dirs = 0;
EXPORT int rl_ignore_completion_duplicates = 1;
EXPORT int rl_sort_completion_matches = 1;
EXPORT void * rl_attempted_completion_function = 0;
EXPORT void * rl_completion_entry_function = 0;
EXPORT void * rl_menu_completion_entry_function = 0;
EXPORT void * rl_ignore_some_completions_function = 0;
EXPORT void * rl_char_is_quoted_p = 0;
EXPORT void * rl_filename_quoting_function = 0;
EXPORT void * rl_filename_dequoting_function = 0;
EXPORT void * rl_directory_completion_hook = 0;
EXPORT void * rl_directory_rewrite_hook = 0;
EXPORT void * rl_filename_stat_hook = 0;
EXPORT void * rl_filename_rewrite_hook = 0;
EXPORT void * rl_completion_display_matches_hook = 0;
EXPORT int rl_inhibit_completion = 0;
EXPORT int rl_attempted_completion_over = 0;
EXPORT int rl_filename_quoting_desired = 0;
EXPORT const char * rl_library_version = "8.2";
EXPORT int rl_readline_version = 0x0802;
EXPORT const char * rl_terminal_name = "xterm";
EXPORT void * rl_instream = 0;
EXPORT void * rl_outstream = 0;
EXPORT const char * rl_basic_word_break_characters = " ";
EXPORT const char * rl_completer_word_break_characters = " ";
EXPORT const char * rl_completer_quote_characters = "'";
EXPORT const char * rl_basic_quote_characters = "'";
EXPORT const char * rl_filename_quote_characters = " ";
EXPORT const char * rl_special_prefixes = 0;

/* libpq stubs */
static char empty_str[] = "";
EXPORT void * PQconnectdb(const char *conninfo) { return (void*)0x1000; }
EXPORT void * PQconnectdbParams(const char * const *keywords, const char * const *values, int expand_dbname) { return (void*)0x1000; }
EXPORT void PQfinish(void *conn) {}
EXPORT void PQreset(void *conn) {}
EXPORT int PQstatus(const void *conn) { return 0; }
EXPORT char * PQerrorMessage(const void *conn) { return empty_str; }
EXPORT int PQbackendPID(const void *conn) { return 100; }
EXPORT void * PQexec(void *conn, const char *query) { return (void*)0x2000; }
EXPORT void * PQexecParams(void *conn, const char *command, int nParams, const void *paramTypes, const char * const *paramValues, const int *paramLengths, const int *paramFormats, int resultFormat) { return (void*)0x2000; }
EXPORT void * PQexecPrepared(void *conn, const char *stmtName, int nParams, const char * const *paramValues, const int *paramLengths, const int *paramFormats, int resultFormat) { return (void*)0x2000; }
EXPORT void * PQprepare(void *conn, const char *stmtName, const char *query, int nParams, const void *paramTypes) { return (void*)0x2000; }
EXPORT int PQresultStatus(const void *res) { return 1; }
EXPORT char * PQresultErrorMessage(const void *res) { return empty_str; }
EXPORT char * PQresultErrorField(const void *res, int fieldcode) { return empty_str; }
EXPORT int PQntuples(const void *res) { return 0; }
EXPORT int PQnfields(const void *res) { return 0; }
EXPORT char * PQfname(const void *res, int field_num) { return empty_str; }
EXPORT int PQfnumber(const void *res, const char *field_name) { return 0; }
EXPORT unsigned int PQftype(const void *res, int field_num) { return 23; }
EXPORT int PQfsize(const void *res, int field_num) { return 4; }
EXPORT int PQftmod(const void *res, int field_num) { return -1; }
EXPORT char * PQgetvalue(const void *res, int tup_num, int field_num) { return empty_str; }
EXPORT int PQgetlength(const void *res, int tup_num, int field_num) { return 0; }
EXPORT int PQgetisnull(const void *res, int tup_num, int field_num) { return 1; }
EXPORT void PQclear(void *res) {}
EXPORT char * PQcmdTuples(void *res) { return empty_str; }
EXPORT char * PQcmdStatus(void *res) { return empty_str; }
EXPORT unsigned int PQoidValue(const void *res) { return 0; }
EXPORT size_t PQescapeStringConn(void *conn, char *to, const char *from, size_t length, int *error) { if(error)*error=0; return length; }
EXPORT unsigned char * PQescapeByteaConn(void *conn, const unsigned char *from, size_t from_length, size_t *to_length) { if(to_length)*to_length=from_length; return (unsigned char*)from; }
EXPORT unsigned char * PQunescapeBytea(const unsigned char *from, size_t *to_length) { if(to_length)*to_length=0; return (unsigned char*)empty_str; }
EXPORT void PQfreemem(void *ptr) {}
EXPORT int PQputCopyData(void *conn, const char *buffer, int nbytes) { return 1; }
EXPORT int PQputCopyEnd(void *conn, const char *errormsg) { return 1; }
EXPORT int PQgetCopyData(void *conn, char **buffer, int async) { return -1; }
EXPORT void PQsetNoticeProcessor(void *conn, void *proc, void *arg) {}
EXPORT int PQclientEncoding(const void *conn) { return 6; } // UTF8
EXPORT int PQsetClientEncoding(void *conn, const char *encoding) { return 0; }
EXPORT char * PQparameterStatus(const void *conn, const char *paramName) { return empty_str; }
EXPORT int PQprotocolVersion(const void *conn) { return 3; }
EXPORT int PQserverVersion(const void *conn) { return 170000; }
EXPORT int PQtransactionStatus(const void *conn) { return 0; }
`;

  const handledVars = [
    'rl_completion_append_character', 'rl_completion_suppress_append', 'rl_filename_completion_desired',
    'rl_completion_type', 'rl_completion_query_items', 'rl_completion_mark_symlink_dirs',
    'rl_ignore_completion_duplicates', 'rl_sort_completion_matches', 'rl_attempted_completion_function',
    'rl_completion_entry_function', 'rl_menu_completion_entry_function', 'rl_ignore_some_completions_function',
    'rl_char_is_quoted_p', 'rl_filename_quoting_function', 'rl_filename_dequoting_function',
    'rl_directory_completion_hook', 'rl_directory_rewrite_hook', 'rl_filename_stat_hook',
    'rl_filename_rewrite_hook', 'rl_completion_display_matches_hook', 'rl_inhibit_completion',
    'rl_attempted_completion_over', 'rl_filename_quoting_desired', 'rl_library_version',
    'rl_readline_version', 'rl_terminal_name', 'rl_instream', 'rl_outstream',
    'rl_basic_word_break_characters', 'rl_completer_word_break_characters',
    'rl_completer_quote_characters', 'rl_basic_quote_characters', 'rl_filename_quote_characters',
    'rl_special_prefixes'
  ];

  for (const s of gmpSymbolsSet) {
    if (['__gmp_version'].includes(s)) continue;
    c += `EXPORT void ${s}(void){}\n`;
  }

  for (const s of readlineSymbolsSet) {
    if (handledVars.includes(s)) continue;
    c += `EXPORT void ${s}(void){}\n`;
  }

  fs.writeFileSync(dummyC, c);
}

const dylibs = [
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
  ['libreadline.8.dylib', '/usr/local/opt/readline/lib/libreadline.8.dylib'],
];

function compileAll() {
  buildC();
  for (const [filename, installPath] of dylibs) {
    const target = path.join(libsDir, filename);
    try {
      execSync(`clang -dynamiclib -fvisibility=default -o "${target}" "${dummyC}" -install_name "${installPath}"`);
    } catch (e) {
      console.error('Error creating', filename, e.message);
    }
  }
}

compileAll();

const execCmdScript = path.resolve(__dirname, '..', 'exec_cmd.cjs');

for (let i = 0; i < 500; i++) {
  try {
    const out = execSync(`node "${execCmdScript}" php artisan --version`, { encoding: 'utf8' });
    if (out.includes('Laravel Framework')) {
      console.log('SUCCESS! PHP ARTISAN EXECUTED CLEANLY:');
      console.log(out);
      process.exit(0);
    }
  } catch (e) {
    const errText = (e.stdout || '') + (e.stderr || '') + (e.message || '');
    const match = errText.match(/Symbol not found: \(([^)]+)\)/);
    if (match && match[1]) {
      let rawSym = match[1].trim();
      if (rawSym.startsWith('_')) rawSym = rawSym.substring(1);
      if (!gmpSymbolsSet.has(rawSym) && !readlineSymbolsSet.has(rawSym)) {
        console.log(`[${i}] Adding missing symbol: ${rawSym}`);
        gmpSymbolsSet.add(rawSym);
        compileAll();
      } else {
        console.log(`Symbol ${rawSym} already added but error remains:`, errText);
        break;
      }
    } else {
      console.log(`Other error at step ${i}:`, errText);
      break;
    }
  }
}
