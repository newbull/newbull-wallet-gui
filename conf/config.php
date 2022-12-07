<?php
if (!defined('IN_SCRIPT')) {die('Invalid attempt!');}
$config = array(
    "name" => "NewBull", // Coin name/title
    "symbol" => "NB", // Coin symbol
    "description" => "You could browse and manage your NewBull wallet detail, send and receive coin with NewBull Wallet GUI.",
    "homepage" => "https://newbull.org/",
    "root_path" => "/", //start with '/', end with '/'
    "copy_name" => "newbull.org",
    "start_year" => 2016,
    "wallet_name" => "NewBull Wallet GUI",
    // "wallet_path" => "wallet-gui-0.14.2.17/", //do not start with '/',  but end with '/', if root write ""
    "theme" => "theme2",
    "url_rewrite" => true,
    "rpc_host" => "127.0.0.1", // Host/IP for the daemon
    "rpc_port" => 10102, // RPC port for the daemon
    "rpc_user" => "newbullrpc", // 'rpcuser' from the coin's .conf
    "rpc_password" => "kMewATKm0S8J7uG76ZZQ10TiaD2X5kRPmV0uQ2O8klbR", // 'rpcpassword' from the coin's .conf
    "proofof" => "pow", //pow,pos
    "nTargetTimespan" => 1209600, //14 * 24 * 60 * 60
    "nTargetSpacing" => 180, //3 * 60
    "blocks_per_page" => 10,
    "date_format" => "Y-m-d H:i:s",
    "refresh_interval" => 180, //seconds
    "explore_url_block" => "explorer-1.7.0/blockhash/", //do not start with '/',  but end with '/', if root write ""
    "explore_url_tx" => "explorer-1.7.0/tx/", //do not start with '/',  but end with '/', if root write ""
    "http_auth_username" => "admin",
    "http_auth_password" => "123456",
);
