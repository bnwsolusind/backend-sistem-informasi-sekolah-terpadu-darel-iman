<?php

namespace App\Helpers;

class QuranJuzHelper
{
    /**
     * Titik awal (surah dan ayat) untuk setiap Juz dari Juz 1 hingga Juz 30.
     */
    protected static array $juzStarts = [
        1  => ["surah" => 1,  "ayah" => 1],
        2  => ["surah" => 2,  "ayah" => 142],
        3  => ["surah" => 2,  "ayah" => 253],
        4  => ["surah" => 3,  "ayah" => 93],
        5  => ["surah" => 4,  "ayah" => 24],
        6  => ["surah" => 4,  "ayah" => 148],
        7  => ["surah" => 5,  "ayah" => 82],
        8  => ["surah" => 6,  "ayah" => 111],
        9  => ["surah" => 7,  "ayah" => 88],
        10 => ["surah" => 8,  "ayah" => 41],
        11 => ["surah" => 9,  "ayah" => 93],
        12 => ["surah" => 11, "ayah" => 6],
        13 => ["surah" => 12, "ayah" => 53],
        14 => ["surah" => 15, "ayah" => 1],
        15 => ["surah" => 17, "ayah" => 1],
        16 => ["surah" => 18, "ayah" => 75],
        17 => ["surah" => 21, "ayah" => 1],
        18 => ["surah" => 23, "ayah" => 1],
        19 => ["surah" => 25, "ayah" => 21],
        20 => ["surah" => 27, "ayah" => 56],
        21 => ["surah" => 29, "ayah" => 46],
        22 => ["surah" => 33, "ayah" => 31],
        23 => ["surah" => 36, "ayah" => 28],
        24 => ["surah" => 39, "ayah" => 32],
        25 => ["surah" => 41, "ayah" => 47],
        26 => ["surah" => 46, "ayah" => 1],
        27 => ["surah" => 51, "ayah" => 31],
        28 => ["surah" => 58, "ayah" => 1],
        29 => ["surah" => 67, "ayah" => 1],
        30 => ["surah" => 78, "ayah" => 1],
    ];

    /**
     * Dapatkan nomor Juz (1 s/d 30) untuk surah dan ayat tertentu.
     */
    public static function getJuz(int $surahNumber, int $ayahNumber = 1): int
    {
        if ($surahNumber < 1) return 1;
        if ($surahNumber >= 78) return 30;

        for ($juz = 30; $juz >= 1; $juz--) {
            $start = self::$juzStarts[$juz];
            if ($surahNumber > $start["surah"] || ($surahNumber === $start["surah"] && $ayahNumber >= $start["ayah"])) {
                return $juz;
            }
        }

        return 1;
    }

    /**
     * Dapatkan daftar Juz yang mencakup rentang ayat tertentu.
     */
    public static function getJuzForRange(int $surahNumber, int $ayahStart, int $ayahEnd): array
    {
        $juzStart = self::getJuz($surahNumber, $ayahStart);
        $juzEnd = self::getJuz($surahNumber, $ayahEnd);

        $juzList = [];
        for ($j = $juzStart; $j <= $juzEnd; $j++) {
            $juzList[] = $j;
        }

        return $juzList;
    }
}
