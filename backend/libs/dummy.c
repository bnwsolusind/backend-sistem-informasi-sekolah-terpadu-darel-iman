
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
EXPORT void __gmpz_init(void){}
EXPORT void __gmpz_init2(void){}
EXPORT void __gmpz_inits(void){}
EXPORT void __gmpz_clear(void){}
EXPORT void __gmpz_clears(void){}
EXPORT void __gmpz_realloc2(void){}
EXPORT void __gmpz_set(void){}
EXPORT void __gmpz_set_ui(void){}
EXPORT void __gmpz_set_si(void){}
EXPORT void __gmpz_set_d(void){}
EXPORT void __gmpz_set_q(void){}
EXPORT void __gmpz_set_f(void){}
EXPORT void __gmpz_set_str(void){}
EXPORT void __gmpz_init_set(void){}
EXPORT void __gmpz_init_set_ui(void){}
EXPORT void __gmpz_init_set_si(void){}
EXPORT void __gmpz_init_set_d(void){}
EXPORT void __gmpz_init_set_str(void){}
EXPORT void __gmpz_get_str(void){}
EXPORT void __gmpz_get_ui(void){}
EXPORT void __gmpz_get_si(void){}
EXPORT void __gmpz_get_d(void){}
EXPORT void __gmpz_get_d_2exp(void){}
EXPORT void __gmpz_add(void){}
EXPORT void __gmpz_add_ui(void){}
EXPORT void __gmpz_sub(void){}
EXPORT void __gmpz_sub_ui(void){}
EXPORT void __gmpz_ui_sub(void){}
EXPORT void __gmpz_mul(void){}
EXPORT void __gmpz_mul_ui(void){}
EXPORT void __gmpz_mul_si(void){}
EXPORT void __gmpz_addmul(void){}
EXPORT void __gmpz_addmul_ui(void){}
EXPORT void __gmpz_submul(void){}
EXPORT void __gmpz_submul_ui(void){}
EXPORT void __gmpz_mul_2exp(void){}
EXPORT void __gmpz_neg(void){}
EXPORT void __gmpz_abs(void){}
EXPORT void __gmpz_cdiv_q(void){}
EXPORT void __gmpz_cdiv_r(void){}
EXPORT void __gmpz_cdiv_qr(void){}
EXPORT void __gmpz_cdiv_q_ui(void){}
EXPORT void __gmpz_cdiv_r_ui(void){}
EXPORT void __gmpz_cdiv_qr_ui(void){}
EXPORT void __gmpz_cdiv_ui(void){}
EXPORT void __gmpz_fdiv_q(void){}
EXPORT void __gmpz_fdiv_r(void){}
EXPORT void __gmpz_fdiv_qr(void){}
EXPORT void __gmpz_fdiv_q_ui(void){}
EXPORT void __gmpz_fdiv_r_ui(void){}
EXPORT void __gmpz_fdiv_qr_ui(void){}
EXPORT void __gmpz_fdiv_ui(void){}
EXPORT void __gmpz_fdiv_q_2exp(void){}
EXPORT void __gmpz_fdiv_r_2exp(void){}
EXPORT void __gmpz_fdiv_qr_2exp(void){}
EXPORT void __gmpz_tdiv_q(void){}
EXPORT void __gmpz_tdiv_r(void){}
EXPORT void __gmpz_tdiv_qr(void){}
EXPORT void __gmpz_tdiv_q_ui(void){}
EXPORT void __gmpz_tdiv_r_ui(void){}
EXPORT void __gmpz_tdiv_qr_ui(void){}
EXPORT void __gmpz_tdiv_ui(void){}
EXPORT void __gmpz_tdiv_q_2exp(void){}
EXPORT void __gmpz_tdiv_r_2exp(void){}
EXPORT void __gmpz_tdiv_qr_2exp(void){}
EXPORT void __gmpz_cdiv_q_2exp(void){}
EXPORT void __gmpz_cdiv_r_2exp(void){}
EXPORT void __gmpz_cdiv_qr_2exp(void){}
EXPORT void __gmpz_mod(void){}
EXPORT void __gmpz_divexact(void){}
EXPORT void __gmpz_divexact_ui(void){}
EXPORT void __gmpz_divisible_p(void){}
EXPORT void __gmpz_divisible_ui_p(void){}
EXPORT void __gmpz_congruent_p(void){}
EXPORT void __gmpz_congruent_ui_p(void){}
EXPORT void __gmpz_powm(void){}
EXPORT void __gmpz_powm_ui(void){}
EXPORT void __gmpz_pow_ui(void){}
EXPORT void __gmpz_ui_pow_ui(void){}
EXPORT void __gmpz_root(void){}
EXPORT void __gmpz_rootrem(void){}
EXPORT void __gmpz_sqrt(void){}
EXPORT void __gmpz_sqrtrem(void){}
EXPORT void __gmpz_perfect_power_p(void){}
EXPORT void __gmpz_perfect_square_p(void){}
EXPORT void __gmpz_probab_prime_p(void){}
EXPORT void __gmpz_nextprime(void){}
EXPORT void __gmpz_gcd(void){}
EXPORT void __gmpz_gcd_ui(void){}
EXPORT void __gmpz_gcdext(void){}
EXPORT void __gmpz_lcm(void){}
EXPORT void __gmpz_lcm_ui(void){}
EXPORT void __gmpz_invert(void){}
EXPORT void __gmpz_jacobi(void){}
EXPORT void __gmpz_legendre(void){}
EXPORT void __gmpz_kronecker(void){}
EXPORT void __gmpz_kronecker_si(void){}
EXPORT void __gmpz_kronecker_ui(void){}
EXPORT void __gmpz_si_kronecker(void){}
EXPORT void __gmpz_ui_kronecker(void){}
EXPORT void __gmpz_remove(void){}
EXPORT void __gmpz_fac_ui(void){}
EXPORT void __gmpz_2fac_ui(void){}
EXPORT void __gmpz_mfac_uiui(void){}
EXPORT void __gmpz_primorial_ui(void){}
EXPORT void __gmpz_bin_ui(void){}
EXPORT void __gmpz_bin_uiui(void){}
EXPORT void __gmpz_fib_ui(void){}
EXPORT void __gmpz_fib2_ui(void){}
EXPORT void __gmpz_lucnum_ui(void){}
EXPORT void __gmpz_lucnum2_ui(void){}
EXPORT void __gmpz_cmp(void){}
EXPORT void __gmpz_cmp_d(void){}
EXPORT void __gmpz_cmp_ui(void){}
EXPORT void __gmpz_cmp_si(void){}
EXPORT void __gmpz_cmpabs(void){}
EXPORT void __gmpz_cmpabs_d(void){}
EXPORT void __gmpz_cmpabs_ui(void){}
EXPORT void __gmpz_sgn(void){}
EXPORT void __gmpz_and(void){}
EXPORT void __gmpz_ior(void){}
EXPORT void __gmpz_xor(void){}
EXPORT void __gmpz_com(void){}
EXPORT void __gmpz_popcount(void){}
EXPORT void __gmpz_hamdist(void){}
EXPORT void __gmpz_scan0(void){}
EXPORT void __gmpz_scan1(void){}
EXPORT void __gmpz_setbit(void){}
EXPORT void __gmpz_clrbit(void){}
EXPORT void __gmpz_combit(void){}
EXPORT void __gmpz_tstbit(void){}
EXPORT void __gmpz_sizeinbase(void){}
EXPORT void __gmpz_export(void){}
EXPORT void __gmpz_import(void){}
EXPORT void __gmpz_fits_ulong_p(void){}
EXPORT void __gmpz_fits_slong_p(void){}
EXPORT void __gmpz_fits_uint_p(void){}
EXPORT void __gmpz_fits_sint_p(void){}
EXPORT void __gmpz_fits_ushort_p(void){}
EXPORT void __gmpz_fits_sshort_p(void){}
EXPORT void __gmpz_even_p(void){}
EXPORT void __gmpz_odd_p(void){}
EXPORT void __gmpq_init(void){}
EXPORT void __gmpq_clear(void){}
EXPORT void __gmpq_set(void){}
EXPORT void __gmpq_set_ui(void){}
EXPORT void __gmpq_set_si(void){}
EXPORT void __gmpq_get_d(void){}
EXPORT void __gmpf_init(void){}
EXPORT void __gmpf_clear(void){}
EXPORT void __gmpf_set(void){}
EXPORT void __gmpf_set_d(void){}
EXPORT void __gmpf_get_d(void){}
EXPORT void rl_completion_matches(void){}
EXPORT void rl_line_buffer(void){}
EXPORT void rl_readline_name(void){}
EXPORT void rl_prompt(void){}
EXPORT void rl_point(void){}
EXPORT void rl_end(void){}
EXPORT void rl_insert_text(void){}
EXPORT void rl_redisplay(void){}
EXPORT void rl_bind_key(void){}
EXPORT void rl_clear_history(void){}
EXPORT void stifle_history(void){}
EXPORT void unstifle_history(void){}
EXPORT void history_is_stifled(void){}
EXPORT void where_history(void){}
EXPORT void history_get(void){}
EXPORT void history_total_bytes(void){}
EXPORT void history_list(void){}
EXPORT void replace_history_entry(void){}
EXPORT void remove_history(void){}
EXPORT void remove_history_range(void){}
EXPORT void clear_history(void){}
EXPORT void history_truncate_file(void){}
EXPORT void history_expand(void){}
EXPORT void rl_mark(void){}
EXPORT void rl_done(void){}
EXPORT void rl_num_chars_to_read(void){}
EXPORT void rl_pending_input(void){}
EXPORT void rl_dispatching(void){}
EXPORT void rl_erase_empty_line(void){}
EXPORT void rl_display_prompt(void){}
EXPORT void rl_already_prompted(void){}
EXPORT void rl_executing_keyseq(void){}
EXPORT void rl_key_sequence_length(void){}
