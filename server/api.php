<?php
/* Fit-Gap ERP – wspólna baza danych analizy (jeden plik JSON, bez bazy danych SQL).
   GET  api.php?ping          – czy serwer działa (bez hasła)
   GET  api.php?since=N       – wpisy zmienione po numerze N (nagłówek X-Team-Key)
   POST api.php               – {"ch": [[id, wpis], ...]} – nowszy wpis (ts) wygrywa, usunięcie jest trwałe */
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function out(int $code, array $body): void { http_response_code($code); echo json_encode($body, JSON_UNESCAPED_UNICODE); exit; }

$TEAM_KEY = '';
if (is_file(__DIR__ . '/config.php')) require __DIR__ . '/config.php';
$configured = is_string($TEAM_KEY) && strlen($TEAM_KEY) >= 10 && $TEAM_KEY !== 'ZMIEN-TO-HASLO';

if (isset($_GET['ping'])) out(200, ['app' => 'fitgap', 'v' => 1, 'configured' => $configured]);
if (!$configured) out(503, ['error' => 'config']);
$key = $_SERVER['HTTP_X_TEAM_KEY'] ?? '';
if (!is_string($key) || !hash_equals($TEAM_KEY, $key)) { usleep(300000); out(401, ['error' => 'auth']); }

$dir = __DIR__ . '/data';
if (!is_dir($dir) && !mkdir($dir, 0750, true)) out(500, ['error' => 'storage']);
if (!is_file($dir . '/.htaccess')) @file_put_contents($dir . '/.htaccess', "<IfModule mod_authz_core.c>\n  Require all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\n  Order allow,deny\n  Deny from all\n</IfModule>\n");
$fp = fopen($dir . '/state.json', 'c+');
if (!$fp) out(500, ['error' => 'storage']);

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
/* RODO: narzędzie nie przechowuje adresów e-mail ani numerów SGID – osoby opisuje imię i nazwisko.
   SGID z wersji 1.0 nie trafia już do pliku; wpisy, które go zawierają, aplikacja zapisuje ponownie bez numeru. */
function noMail(string $id, $v) { if (is_array($v)) unset($v['em']); return $v; }
function scrub(string $id, $v) { $v = noMail($id, $v); if (is_array($v)) unset($v['sgid']); return $v; }
flock($fp, $method === 'POST' ? LOCK_EX : LOCK_SH);
$raw = stream_get_contents($fp);
$db = $raw ? json_decode($raw, true) : null;
if (!is_array($db) || !isset($db['seq'], $db['e'])) $db = ['seq' => 0, 'e' => []];

if ($method === 'GET') {
  $since = max(0, (int)($_GET['since'] ?? 0));
  $list = [];
  foreach ($db['e'] as $id => $x) if ($x['sq'] > $since) $list[] = [(string)$id, noMail((string)$id, $x['v'])];
  flock($fp, LOCK_UN); fclose($fp);
  out(200, ['seq' => $db['seq'], 'e' => $list]);
}
if ($method !== 'POST') out(405, ['error' => 'method']);

/* oczyszczenie wpisu: tylko proste typy, ograniczona głębokość, długość i liczba elementów */
function clean($v, int $depth) {
  if (is_bool($v) || is_int($v) || is_null($v)) return $v;
  if (is_float($v)) return is_finite($v) ? $v : null;
  if (is_string($v)) return function_exists('mb_substr') ? mb_substr($v, 0, 10000) : substr($v, 0, 30000);
  if (!is_array($v) || $depth > 4) return null;
  $out = []; $n = 0;
  foreach ($v as $k => $x) {
    if (++$n > 300) break;
    if (is_string($k) && !preg_match('/^[A-Za-z0-9_]{1,40}$/', $k)) continue;
    $out[$k] = clean($x, $depth + 1);
  }
  return $out;
}
$body = file_get_contents('php://input', false, null, 0, 8 * 1024 * 1024);
$in = json_decode($body ?: '', true, 16);
if (!is_array($in) || !isset($in['ch']) || !is_array($in['ch']) || count($in['ch']) > 20000) out(400, ['error' => 'input']);

$acc = 0; $purged = 0;
foreach ($in['ch'] as $c) {
  if (!is_array($c) || count($c) !== 2) continue;
  [$id, $v] = $c;
  if (!is_string($id) || !preg_match('/^(an|ar|pr|rq|os|rk|bn|sg)\|[A-Za-z0-9_-]{1,40}(\|[A-Za-z0-9_-]{1,60})?$/', $id) || !is_array($v) || array_is_list($v) && $v !== []) continue;
  $v = scrub($id, clean($v, 0));
  if (!isset($v['ts']) || !is_string($v['ts']) || strlen($v['ts']) > 40) continue;
  if (strlen(json_encode($v, JSON_UNESCAPED_UNICODE)) > 65536) continue;
  $prev = $db['e'][$id]['v'] ?? null;
  if (is_array($prev) && !empty($prev['del'])) continue;              // usunięty wpis zostaje usunięty
  if (!empty($v['del'])) $v = ['del' => true, 'ts' => $v['ts']];       // znacznik usunięcia zastępuje wpis niezależnie od czasu
  elseif (strcmp($v['ts'], (string)($prev['ts'] ?? '')) <= 0) continue; // starszy lub ten sam zapis – pomijamy
  $db['seq']++;
  $db['e'][$id] = ['sq' => $db['seq'], 'v' => $v];
  $acc++;
}
if ($acc || $purged) {
  ftruncate($fp, 0); rewind($fp);
  fwrite($fp, json_encode($db, JSON_UNESCAPED_UNICODE));
  fflush($fp);
}
flock($fp, LOCK_UN); fclose($fp);
out(200, ['ok' => $acc, 'seq' => $db['seq']]);
